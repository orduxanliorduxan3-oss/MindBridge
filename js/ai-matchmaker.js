// MindBridge AI Matchmaker & Cohort Builder
const AIMatchmaker = {
  currentMatch: null,

  init() {
    const form = document.getElementById("ai-matchmaker-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.runMatchmaking();
      });
    }

    // Age change listener to preview safety badge
    const ageInput = document.getElementById("student-age");
    if (ageInput) {
      ageInput.addEventListener("input", (e) => {
        this.checkAgeSafetyPreview(parseInt(e.target.value) || 0);
      });
    }
  },

  checkAgeSafetyPreview(age) {
    const banner = document.getElementById("age-safety-preview-banner");
    if (!banner) return;

    if (age > 0 && age < 18) {
      banner.style.display = "flex";
      banner.innerHTML = `
        <div class="safety-shield-icon">🛡️</div>
        <div>
          <strong>18 Yaşdan Aşağı Şagird Qorunma Qatı Aktivdir!</strong>
          <p>Valideyn razılığı mütləqdir. Dərslər təhlükəsiz mühitdə, yoxlanmış pedaqoq və AI məzmun filtri nəzarətində keçiriləcəkdir.</p>
        </div>
      `;
    } else if (age >= 18) {
      banner.style.display = "flex";
      banner.innerHTML = `
        <div class="safety-shield-icon">🎓</div>
        <div>
          <strong>Böyüklər üçün Canlı Peşəkar Kohort Rejimi</strong>
          <p>Karyera yönümlü praktiki qrup dərsləri, sənaye mütəxəssisləri və beynəlxalq sertifikasiya.</p>
        </div>
      `;
    } else {
      banner.style.display = "none";
    }
  },

  runMatchmaking() {
    const name = document.getElementById("student-name").value.trim() || "Tələbə";
    const age = parseInt(document.getElementById("student-age").value) || 16;
    const subjectId = document.getElementById("student-subject").value;
    const level = document.getElementById("student-level").value;
    const goal = document.getElementById("student-goal").value;
    const timePref = document.getElementById("student-time").value;

    const isMinor = age < 18;

    // Show processing visual overlay
    const stepsContainer = document.getElementById("matchmaking-steps");
    const resultsContainer = document.getElementById("matchmaking-results");
    const submitBtn = document.getElementById("match-submit-btn");

    if (submitBtn) submitBtn.disabled = true;
    if (resultsContainer) resultsContainer.style.display = "none";
    if (stepsContainer) {
      stepsContainer.style.display = "block";
      stepsContainer.innerHTML = "";
    }

    const steps = [
      { text: "🤖 MindBridge AI Tələbə Profilini Analiz Edir...", delay: 600, icon: "⚡" },
      { text: `🎯 Bilik səviyyəsi ('${level}') və hədəf üzrə qrup axtarılır...`, delay: 1400, icon: "🔍" },
      { 
        text: isMinor 
          ? "🛡️ Yaş tələbi (<18): Valideyn qoruma filtri və uşaq psixologiyası sertifikatlı mentor təyin edilir..." 
          : "💼 Yaş tələbi (18+): Peşəkar sənaye komandası formalaşdırılır...", 
        delay: 2200, 
        icon: isMinor ? "🛡️" : "👔" 
      },
      { text: "🤝 Optimal 4-5 nəfərlik canlı kohort yığıldı və cədvəl sinxronlaşdırıldı!", delay: 3000, icon: "✨" }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        const stepElem = document.createElement("div");
        stepElem.className = "ai-step-item animate-fade-in";
        stepElem.innerHTML = `<span class="step-icon">${step.icon}</span> <span class="step-text">${step.text}</span>`;
        stepsContainer.appendChild(stepElem);
      }, step.delay);
    });

    // After animation complete, build match
    setTimeout(() => {
      const subject = MindBridgeData.subjects.find(s => s.id === subjectId) || MindBridgeData.subjects[0];
      
      // Select appropriate mentor
      let matchedMentor = MindBridgeData.mentors.find(m => m.id === subject.defaultMentor);
      if (isMinor && age <= 14) {
        matchedMentor = MindBridgeData.mentors.find(m => m.id === "m4") || matchedMentor;
      }

      // Generate cohort peers
      const minorPeers = [
        { name: "Leyla M. (15 yaş)", score: "Başlanğıc", avatar: "👧" },
        { name: "Fuad K. (16 yaş)", score: "Həvəskar", avatar: "👦" },
        { name: "Nərmin R. (15 yaş)", score: "Təməl", avatar: "👧" }
      ];

      const adultPeers = [
        { name: "Samir Ə. (24 yaş)", score: "Orta", avatar: "👨" },
        { name: "Aynur H. (26 yaş)", score: "Başlanğıc", avatar: "👩" },
        { name: "Teymur M. (29 yaş)", score: "Orta", avatar: "👨" }
      ];

      const peers = isMinor ? minorPeers : adultPeers;

      this.currentMatch = {
        student: { name, age, isMinor, level, goal, timePref },
        subject,
        mentor: matchedMentor,
        cohortName: `${subject.title} [Kohort #${Math.floor(100 + Math.random() * 900)}]`,
        peers,
        schedule: timePref === "weekend" ? "Hər Şənbə və Bazar, 15:00 - 16:30" : "Hər Çərşənbə və Cümə, 19:30 - 20:45",
        status: isMinor ? "Valideyn Razılığı Gözlənilir" : "Qoşulmağa Hazırdır",
        safetyLayerActive: isMinor
      };

      // Save into global state
      localStorage.setItem("mindbridge_active_cohort", JSON.stringify(this.currentMatch));
      
      if (submitBtn) submitBtn.disabled = false;
      this.renderMatchResult(this.currentMatch);
    }, 3800);
  },

  renderMatchResult(match) {
    const resultsContainer = document.getElementById("matchmaking-results");
    if (!resultsContainer) return;

    resultsContainer.style.display = "block";
    resultsContainer.scrollIntoView({ behavior: "smooth" });

    const isMinor = match.student.isMinor;

    resultsContainer.innerHTML = `
      <div class="match-result-card animate-slide-up">
        <div class="match-header">
          <div class="match-badge">
            <span class="pulse-dot"></span> AI Dəqiq Uyğunluq: %98.4
          </div>
          <h3>${match.cohortName}</h3>
          <p class="match-sub">${match.subject.description}</p>
        </div>

        <div class="match-grid">
          <!-- Mentor Column -->
          <div class="match-mentor-card">
            <div class="mentor-badge-top">
              <span class="icon">✅</span> ${match.mentor.badge}
            </div>
            <div class="mentor-header">
              <div class="mentor-avatar">${match.mentor.avatar}</div>
              <div>
                <h4>${match.mentor.name}</h4>
                <div class="mentor-title">${match.mentor.title}</div>
                <div class="mentor-stars">⭐ ${match.mentor.rating} / 5.0 (${match.mentor.reviewsCount} rəy)</div>
              </div>
            </div>
            <div class="mentor-checks">
              <div class="check-item"><span class="icon">🛡️</span> ${match.mentor.backgroundCheck}</div>
              <div class="check-item"><span class="icon">💼</span> ${match.mentor.experience}</div>
              <div class="check-item"><span class="icon">👥</span> ${match.mentor.studentsCount}+ məzun tələbə</div>
            </div>
          </div>

          <!-- Cohort & Peers Column -->
          <div class="match-cohort-card">
            <h4>Canlı Qrup Yoldaşlarınız (Sizinlə Eyni Səviyyə)</h4>
            <div class="peers-list">
              <div class="peer-pill current-user">
                <span class="avatar">⭐</span>
                <div>
                  <strong>${match.student.name} (Siz)</strong>
                  <small>${match.student.age} yaş • ${match.student.level}</small>
                </div>
              </div>
              ${match.peers.map(p => `
                <div class="peer-pill">
                  <span class="avatar">${p.avatar}</span>
                  <div>
                    <strong>${p.name}</strong>
                    <small>Səviyyə: ${p.score}</small>
                  </div>
                </div>
              `).join('')}
              <div class="peer-pill placeholder">
                <span class="avatar">➕</span>
                <div>
                  <em>Qrup limiti: Cəmi 5 nəfər (Fərdi diqqət təminatı)</em>
                </div>
              </div>
            </div>

            <div class="schedule-box">
              <span class="icon">📅</span>
              <div>
                <strong>Dərs Cədvəli:</strong>
                <span>${match.schedule}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Under 18 Guard Section -->
        ${isMinor ? `
          <div class="minor-guard-alert">
            <div class="guard-icon">🛡️</div>
            <div class="guard-text">
              <h4>18 Yaşdan Aşağı Şagird Qoruma Qatı Tələb Olunur</h4>
              <p>Platforma qaydalarına əsasən, şagirdin dərsə başlaması üçün valideyn razılığı imzalanmalı və Valideyn Paneli aktivləşdirilməlidir.</p>
              <div class="guard-actions">
                <button class="btn btn-warning" onclick="ParentGuard.openConsentModal()">
                  ✍️ Valideyn Razılığını İmzala & Təsdiqlə
                </button>
                <button class="btn btn-secondary" onclick="App.navigateTo('parent-panel')">
                  👨‍👩‍👧 Valideyn Panelinə Bax
                </button>
              </div>
            </div>
          </div>
        ` : `
          <div class="adult-ready-banner">
            <div class="guard-icon">🚀</div>
            <div>
              <strong>Qrup Qeydiyyatı Tamamlandı!</strong>
              <p>Canlı qrup otağına daxil ola və dərhal tədris materialları ilə tanış ola bilərsiniz.</p>
            </div>
          </div>
        `}

        <div class="match-footer-actions">
          <button class="btn btn-primary btn-lg" onclick="App.startClassroomSession()">
            🎥 Canlı Dərs Otağına Daxil Ol
          </button>
          <button class="btn btn-outline" onclick="App.navigateTo('assessments')">
            📝 Quiz və İmtahan Moduluna Keç
          </button>
        </div>
      </div>
    `;
  }
};
