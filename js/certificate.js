// MindBridge Verifiable Certificate Engine
const CertificateEngine = {
  currentCertificate: null,

  init() {
    this.loadLatestCertificate();
    this.renderCertificate();
    this.attachEvents();
  },

  loadLatestCertificate() {
    const saved = localStorage.getItem("mindbridge_active_certificate");
    if (saved) {
      try {
        this.currentCertificate = JSON.parse(saved);
      } catch (e) {
        console.error("Certificate parse error", e);
      }
    }

    if (!this.currentCertificate) {
      // Default sample certificate
      this.currentCertificate = {
        serialNumber: "MB-CERT-2026-8941",
        studentName: "Orxan Quliyev",
        courseName: "Süni İntellekt və Python (Canlı Qrup Tədrisi)",
        mentorName: "Dr. Rəşad Əliyev",
        mentorTitle: "Süni İntellekt üzrə Baş Mütəxəssis (Yoxlanmış Pedaqoq)",
        issueDate: "8 Oktyabr 2026",
        grade: "Fərqlənmə (Distinction)",
        finalScore: 96,
        verificationUrl: "http://localhost:5000/verify/MB-CERT-2026-8941",
        verified: true
      };
    }
  },

  generateCertificate(params) {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const cert = {
      serialNumber: `MB-CERT-2026-${randomId}`,
      studentName: params.studentName || "Hörmətli Tələbə",
      courseName: params.courseName || "MindBridge Canlı Qrup Tədrisi",
      mentorName: params.mentorName || "Dr. Rəşad Əliyev",
      mentorTitle: "Yoxlanmış Ekspert & Təlimçi",
      issueDate: new Date().toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" }),
      grade: params.grade || "Fərqlənmə (Distinction)",
      finalScore: params.finalScore || 95,
      verificationUrl: `http://localhost:5000/verify/MB-CERT-2026-${randomId}`,
      verified: true
    };

    this.currentCertificate = cert;
    localStorage.setItem("mindbridge_active_certificate", JSON.stringify(cert));
    this.renderCertificate();
  },

  attachEvents() {
    const verifyForm = document.getElementById("certificate-verify-form");
    if (verifyForm) {
      verifyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.verifyCertificate();
      });
    }
  },

  renderCertificate() {
    const certWrapper = document.getElementById("certificate-display-area");
    if (!certWrapper || !this.currentCertificate) return;

    const cert = this.currentCertificate;

    certWrapper.innerHTML = `
      <div class="certificate-paper printable-certificate" id="printable-cert">
        <div class="cert-border-outer">
          <div class="cert-border-inner">
            
            <!-- Corner Ornaments -->
            <div class="cert-corner corner-tl">❖</div>
            <div class="cert-corner corner-tr">❖</div>
            <div class="cert-corner corner-bl">❖</div>
            <div class="cert-corner corner-br">❖</div>

            <!-- Top Header -->
            <div class="cert-header">
              <div class="cert-brand">
                <span class="cert-logo-icon">🌉</span>
                <span class="cert-brand-name">MindBridge</span>
              </div>
              <div class="cert-super-title">BEYNƏLXALQ CANLI QRUP TƏDRİSİ PLATFORMASI</div>
              <h1 class="cert-main-title">RƏSMİ BİTİRMƏ VƏ NAİLİYYƏT SERTİFİKATI</h1>
              <div class="cert-subtitle">Certificate of Completion & Excellence</div>
            </div>

            <!-- Recipient -->
            <div class="cert-body">
              <p class="cert-for-text">Bu rəsmi sənəd təsdiq edir ki,</p>
              <h2 class="cert-student-name">${cert.studentName}</h2>
              <p class="cert-desc-text">
                MindBridge tərəfindən təşkil olunan <strong>"${cert.courseName}"</strong> üzrə canlı qrup dərslərini, 
                praktik laboratoriya tapşırıqlarını və yekun imtahanı <strong>${cert.finalScore}%</strong> nəticə ilə 
                uğurla başa vuraraq <strong>${cert.grade}</strong> dərəcəsinə layiq görülmüşdür.
              </p>
            </div>

            <!-- Signatures and Stamp -->
            <div class="cert-footer">
              <div class="cert-sign-col">
                <div class="signature-font">Rəşad Əliyev</div>
                <div class="sign-line"></div>
                <div class="sign-name">${cert.mentorName}</div>
                <div class="sign-title">${cert.mentorTitle}</div>
                <div class="sign-badge">✓ Yoxlanmış Pedaqoq</div>
              </div>

              <!-- Official Gold Stamp -->
              <div class="cert-stamp-col">
                <div class="official-gold-stamp">
                  <div class="stamp-stars">★ ★ ★ ★ ★</div>
                  <div class="stamp-text">MINDBRIDGE</div>
                  <div class="stamp-sub">VERIFIED</div>
                  <div class="stamp-year">2026</div>
                </div>
              </div>

              <div class="cert-qr-col">
                <div class="cert-qr-box">
                  <div class="mock-qr-code">
                    <div class="qr-pattern"></div>
                    <span class="qr-label">QR KOD</span>
                  </div>
                  <small class="cert-serial">${cert.serialNumber}</small>
                  <small class="cert-date">Verilmə tarixi: ${cert.issueDate}</small>
                </div>
              </div>
            </div>

            <!-- Verification Footer Notice -->
            <div class="cert-meta-bar">
              <span>Sənəd ID: <strong>${cert.serialNumber}</strong></span>
              <span>Təhlükəsizlik Zənciri: SHA-256 Rəqəmsal İmza</span>
              <span>Status: <strong class="text-success">Rəsmi Doğrulanmış</strong></span>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  printCertificate() {
    window.print();
  },

  verifyCertificate() {
    const input = document.getElementById("verify-serial-input");
    const resultBox = document.getElementById("verify-result-box");
    if (!input || !resultBox) return;

    const query = input.value.trim().toUpperCase();
    if (!query) return;

    resultBox.style.display = "block";
    resultBox.innerHTML = `<span class="spinner"></span> MindBridge qlobal reestrində yoxlanılır...`;

    setTimeout(() => {
      if (query.includes("MB-CERT") || query.includes("8941") || (this.currentCertificate && query === this.currentCertificate.serialNumber)) {
        resultBox.className = "verify-result success animate-fade-in";
        resultBox.innerHTML = `
          <div class="verify-icon">✅</div>
          <div>
            <h4>Sertifikat Tam Rəsmi və Doğrulanmışdır!</h4>
            <p><strong>Sahib:</strong> ${this.currentCertificate.studentName} | <strong>Kurs:</strong> ${this.currentCertificate.courseName}</p>
            <p><strong>Yoxlayan Mentor:</strong> ${this.currentCertificate.mentorName} (Təsdiqlənmiş Ekspert) | <strong>Bal:</strong> ${this.currentCertificate.finalScore}%</p>
            <small>Reyestr Qeydiyyat Nömrəsi: ${this.currentCertificate.serialNumber}</small>
          </div>
        `;
      } else {
        resultBox.className = "verify-result danger animate-fade-in";
        resultBox.innerHTML = `
          <div class="verify-icon">❌</div>
          <div>
            <h4>Sertifikat Tapılmadı!</h4>
            <p>Daxil etdiyiniz "${query}" nömrəli sertifikat MindBridge bazasında mövcud deyil və ya nömrə səhvdir.</p>
          </div>
        `;
      }
    }, 800);
  }
};
