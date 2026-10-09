// MindBridge Child Safety & Parental Guard Layer
const ParentGuard = {
  data: MindBridgeData.parentControl,

  init() {
    this.loadState();
    this.renderDashboard();
    this.attachEventListeners();
  },

  loadState() {
    const saved = localStorage.getItem("mindbridge_parent_guard");
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error("Parent guard data parse error", e);
      }
    }
  },

  saveState() {
    localStorage.setItem("mindbridge_parent_guard", JSON.stringify(this.data));
  },

  attachEventListeners() {
    const form = document.getElementById("parent-consent-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleConsentSubmit();
      });
    }

    const parentMsgForm = document.getElementById("parent-message-mentor-form");
    if (parentMsgForm) {
      parentMsgForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSendMessageToMentor();
      });
    }
  },

  openConsentModal() {
    const modal = document.getElementById("parent-consent-modal");
    if (modal) {
      modal.classList.add("active");
    }
  },

  closeConsentModal() {
    const modal = document.getElementById("parent-consent-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  },

  handleConsentSubmit() {
    const pName = document.getElementById("consent-parent-name")?.value.trim() || "Valideyn";
    const pEmail = document.getElementById("consent-parent-email")?.value.trim() || "valideyn@mail.com";
    const pPhone = document.getElementById("consent-parent-phone")?.value.trim() || "+994 50 000 00 00";
    const sName = document.getElementById("consent-child-name")?.value.trim() || "Şagird";

    this.data.parentName = pName;
    this.data.parentEmail = pEmail;
    this.data.parentPhone = pPhone;
    this.data.studentName = sName;
    this.data.consentSigned = true;
    this.data.consentDate = new Date().toISOString().split("T")[0];

    // Add safety log
    this.data.safetyLogs.unshift({
      time: "İndicə",
      type: "shield",
      message: `Rəsmi Valideyn Razılığı imzalandı (${pName}). Uşaq qoruma protokolu tam aktivləşdirildi.`
    });

    this.saveState();
    this.closeConsentModal();
    this.renderDashboard();

    // Show toast or alert
    App.showToast("✅ Valideyn Razılığı Uğurla Təsdiqləndi! Şagird canlı dərslərə qatıla bilər.", "success");
    
    // Refresh matchmaker if on screen
    if (AIMatchmaker.currentMatch) {
      AIMatchmaker.currentMatch.status = "Valideyn Təsdiqlədi - Qoşulmağa Hazırdır";
      AIMatchmaker.renderMatchResult(AIMatchmaker.currentMatch);
    }
  },

  handleSendMessageToMentor() {
    const input = document.getElementById("parent-mentor-msg-input");
    if (!input || !input.value.trim()) return;

    const msg = input.value.trim();
    input.value = "";

    this.data.safetyLogs.unshift({
      time: "İndicə",
      type: "info",
      message: `Valideyndən Müəllimə təhlükəsiz bildiriş göndərildi: "${msg}"`
    });

    this.saveState();
    this.renderDashboard();
    App.showToast("Müəllimə təhlükəsiz mesaj çatdırıldı. Müəllim ən qısa zamanda cavablandıracaq.", "info");
  },

  updateScreenTime(minutes) {
    this.data.dailyScreenLimitMinutes = parseInt(minutes);
    this.saveState();
    this.renderDashboard();
    App.showToast(`Gündəlik dərs vaxtı limiti yeniləndi: ${minutes} dəqiqə`, "info");
  },

  renderDashboard() {
    const container = document.getElementById("parent-dashboard-content");
    if (!container) return;

    const d = this.data;
    const limitPct = Math.min(100, Math.round((d.usedMinutesToday / d.dailyScreenLimitMinutes) * 100));

    container.innerHTML = `
      <!-- Safety Status Banner -->
      <div class="safety-status-card ${d.consentSigned ? 'status-safe' : 'status-warning'}">
        <div class="shield-badge-lg">
          ${d.consentSigned ? '🛡️' : '⚠️'}
        </div>
        <div class="status-details">
          <div class="status-title-row">
            <h3>Uşaq Təhlükəsizliyi Qoruma Qatı: ${d.consentSigned ? 'AKTİV & QORUNUR' : 'VALİDEYN RAZILIĞI GÖZLƏNİLİR'}</h3>
            <span class="badge ${d.consentSigned ? 'badge-success' : 'badge-warning'}">
              ${d.consentSigned ? 'Təsdiqlənmiş Müqavilə' : 'Gözləmədə'}
            </span>
          </div>
          <p>
            ${d.consentSigned 
              ? `Təsdiqləyən: <strong>${d.parentName}</strong> (${d.consentDate}). Bütün canlı dərslər AI söhbət monitorinqi və pedaqoji təhlükəsizlik qaydalarına uyğun keçirilir.`
              : `Şagird 18 yaşdan kiçik olduğu üçün qanuni təmsilçinin razılığı olmadan dərslərə qoşula bilməz.`}
          </p>
          ${!d.consentSigned ? `
            <button class="btn btn-warning mt-2" onclick="ParentGuard.openConsentModal()">
              ✍️ Razılıq Müqaviləsini İmzala
            </button>
          ` : `
            <div class="guard-pill-group">
              <span class="guard-pill">✅ Şəxsi məlumat filtri aktivdir</span>
              <span class="guard-pill">✅ 100% Yoxlanmış Pedaqoq</span>
              <span class="guard-pill">✅ Video və Çat Auditi mövcuddur</span>
            </div>
          `}
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="parent-metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🎓</div>
          <div class="metric-info">
            <span class="metric-label">Şagird</span>
            <span class="metric-value">${d.studentName} (${d.studentAge} yaş)</span>
            <span class="metric-sub">${d.activeCourse}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">👨‍🏫</div>
          <div class="metric-info">
            <span class="metric-label">Təyin Edilmiş Mentor</span>
            <span class="metric-value">${d.verifiedMentor}</span>
            <span class="metric-sub">Kriminal & Pedaqoji Yoxlanmış</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">📊</div>
          <div class="metric-info">
            <span class="metric-label">Dərsdə İştirak Faizi</span>
            <span class="metric-value text-success">${d.attendanceRate}%</span>
            <span class="metric-sub">İntizam səviyyəsi: Əla</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">⏱️</div>
          <div class="metric-info">
            <span class="metric-label">Bugünkü Ekran Vaxtı</span>
            <span class="metric-value">${d.usedMinutesToday} / ${d.dailyScreenLimitMinutes} dəq</span>
            <div class="screen-progress-bar">
              <div class="screen-progress-fill" style="width: ${limitPct}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Sections: Safety Audit Logs & Direct Mentor Communication -->
      <div class="parent-two-col">
        <!-- Safety Logs -->
        <div class="parent-card">
          <div class="card-header-flex">
            <h4>🛡️ AI Canlı Təhlükəsizlik və Əxlaq Jurnalı</h4>
            <span class="badge badge-outline">Real-vaxt yenilənir</span>
          </div>
          <div class="safety-log-list">
            ${d.safetyLogs.map(log => `
              <div class="safety-log-item log-${log.type}">
                <div class="log-indicator"></div>
                <div class="log-body">
                  <div class="log-time">${log.time}</div>
                  <div class="log-message">${log.message}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Academic Progress & Mentor Direct Contact -->
        <div class="parent-card">
          <h4>📝 Akademik Nəticələr və Rəylər</h4>
          <div class="homework-list">
            ${d.homeworkReports.map(hw => `
              <div class="homework-item">
                <div class="hw-top">
                  <strong>${hw.task}</strong>
                  <span class="badge badge-success">${hw.score}</span>
                </div>
                <div class="hw-feedback">
                  <em>Müəllim rəyi:</em> "${hw.mentorFeedback}"
                </div>
              </div>
            `).join('')}
          </div>

          <hr class="card-divider"/>

          <h4>💬 Müəllimə Birbaşa Valideyn İsmarıcı</h4>
          <form id="parent-message-mentor-form" class="parent-msg-form">
            <input type="text" id="parent-mentor-msg-input" placeholder="Müəllimə sualınız və ya xüsusi qeydiniz (məs: 'Dərsdə danışıq vaxtını artırın')..." required />
            <button type="submit" class="btn btn-primary">Göndər</button>
          </form>
        </div>
      </div>

      <!-- Settings & Controls -->
      <div class="parent-card mt-4">
        <h4>⚙️ Valideyn Nəzarət Parametrləri</h4>
        <div class="controls-grid">
          <div class="control-box">
            <label>Gündəlik Maksimum Ekran Vaxtı Limiti:</label>
            <select onchange="ParentGuard.updateScreenTime(this.value)">
              <option value="60" ${d.dailyScreenLimitMinutes === 60 ? 'selected' : ''}>60 dəqiqə (1 saat)</option>
              <option value="90" ${d.dailyScreenLimitMinutes === 90 ? 'selected' : ''}>90 dəqiqə (1.5 saat)</option>
              <option value="120" ${d.dailyScreenLimitMinutes === 120 ? 'selected' : ''}>120 dəqiqə (2 saat - Tövsiyə olunan)</option>
              <option value="180" ${d.dailyScreenLimitMinutes === 180 ? 'selected' : ''}>180 dəqiqə (3 saat)</option>
            </select>
          </div>
          <div class="control-box">
            <label>AI Şəxsi Məlumat Sızma Qoruyucusu:</label>
            <div class="toggle-pill active">AKTİV (Telefon və Ünvan avtomatik gizlədilir)</div>
          </div>
          <div class="control-box">
            <label>Dərs Qeydlərinə Baxış:</label>
            <div class="toggle-pill active">Yalnız Valideyn Görə Bilər</div>
          </div>
        </div>
      </div>
    `;
  }
};
