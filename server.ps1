Param(
    [int]$Port = 5050,
    [switch]$NoBrowser
)

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { throw 'Node.js 18 or newer is required for the live AI coach. Install Node.js and run this again.' }
$serverPath = Join-Path $PSScriptRoot 'server.cjs'
$url = "http://127.0.0.1:$Port/"
try { $online = (Invoke-RestMethod -Uri "${url}api/status" -TimeoutSec 2).status -eq 'online' -and $null -ne (Invoke-RestMethod -Uri "${url}api/ai-status" -TimeoutSec 2).configured } catch { $online = $false }
if (-not $online) {
    $process = Start-Process -FilePath $node.Source -ArgumentList @($serverPath, $Port) -WindowStyle Hidden -PassThru
    for ($attempt = 0; $attempt -lt 25; $attempt++) {
        if ($process.HasExited) { throw "MindBridge server stopped. Port $Port may already be in use." }
        try { $online = (Invoke-RestMethod -Uri "${url}api/status" -TimeoutSec 1).status -eq 'online' -and $null -ne (Invoke-RestMethod -Uri "${url}api/ai-status" -TimeoutSec 1).configured } catch { $online = $false }
        if ($online) { break }
        Start-Sleep -Milliseconds 200
    }
    if (-not $online) { throw 'MindBridge server did not start.' }
}
Write-Host "MindBridge is ready at $url" -ForegroundColor Green
try { $aiStatus = Invoke-RestMethod -Uri "${url}api/ai-status" -TimeoutSec 2 } catch { $aiStatus = $null }
if ($aiStatus -and $aiStatus.configured) {
    Write-Host 'AI study coach is connected.' -ForegroundColor Green
} elseif ($env:GEMINI_API_KEY) {
    Write-Warning 'The running server has no AI key. Stop that MindBridge server, then start it again so it inherits GEMINI_API_KEY.'
} else {
    Write-Warning 'AI study coach is disconnected. Set GEMINI_API_KEY in the server environment and restart MindBridge.'
}
if (-not $NoBrowser) { Start-Process $url }
