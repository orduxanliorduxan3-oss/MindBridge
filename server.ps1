# MindBridge Localhost Web Server (PowerShell .NET Native)
Param(
    [int]$Port = 5000,
    [switch]$NoBrowser
)

$hostUrl = "http://localhost:$Port/"
$baseDir = $PSScriptRoot

# MIME Types dictionary
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
    ".pdf"  = "application/pdf"
}

# Ensure data directory exists
$dataDir = Join-Path $baseDir "data"
if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

$stateFile = Join-Path $dataDir "state.json"
if (-not (Test-Path $stateFile)) {
    @{
        created = (Get-Date).ToString("o")
        lastUpdated = (Get-Date).ToString("o")
        users = @()
        enrollments = @()
        certificates = @()
    } | ConvertTo-Json -Depth 5 | Set-Content -Path $stateFile -Encoding UTF8
}

# Create and start listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($hostUrl)

try {
    $listener.Start()
} catch {
    Write-Warning "Port $Port may be in use, trying port 5050..."
    $Port = 5050
    $hostUrl = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($hostUrl)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  MindBridge Platformasi Localhost Serveri ise dusdu!" -ForegroundColor Green
Write-Host "  Unvan: $hostUrl" -ForegroundColor Yellow
Write-Host "  Durdurmaq ucun: Ctrl + C" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Open default browser
try {
    if (-not $NoBrowser) { Start-Process $hostUrl }
} catch {
    # Ignore if headless
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        $httpMethod = $request.HttpMethod
        
        # Enable CORS for local interactions
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        if ($httpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # API Handlers
        if ($localPath.StartsWith("/api/")) {
            if ($localPath -eq "/api/status") {
                $statusJson = @{
                    status = "online"
                    service = "MindBridge Engine"
                    port = $Port
                    serverTime = (Get-Date).ToString("o")
                } | ConvertTo-Json
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($statusJson)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.Close()
                continue
            }
            elseif ($localPath -eq "/api/state" -and $httpMethod -eq "GET") {
                $content = Get-Content -Path $stateFile -Raw -Encoding UTF8
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.Close()
                continue
            }
            elseif ($localPath -eq "/api/save" -and $httpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $body = $reader.ReadToEnd()
                $reader.Close()
                Set-Content -Path $stateFile -Value $body -Encoding UTF8
                
                $okJson = '{"success":true,"message":"Data yadda saxlanildi"}'
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($okJson)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.Close()
                continue
            }
        }

        # Static File Serving
        if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "/index.html"
        }

        # Sanitize path to prevent directory traversal
        $sanitizedPath = $localPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $baseDir $sanitizedPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $mime = $mimeTypes[$ext]
            }
            $response.ContentType = $mime
            
            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
        }
        else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - Fayl tapilmadi: $localPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }

        $response.Close()
    }
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
