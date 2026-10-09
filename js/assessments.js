// MindBridge Assessment System: Quiz, Practical Task, Final Exam
const Assessments = {
  currentAssessmentTab: "quiz",
  quizAnswers: {},
  examAnswers: {},
  scores: {
    quiz: null,
    practical: null,
    exam: null
  },

  init() {
    this.renderQuiz();
    this.renderPracticalTask();
    this.renderExam();
    this.attachEvents();
  },

  attachEvents() {
    // Tab switching
    document.querySelectorAll(".assessment-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
  },

  switchTab(tab) {
    this.currentAssessmentTab = tab;
    document.querySelectorAll(".assessment-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    document.querySelectorAll(".assessment-section").forEach(sec => {
      sec.style.display = sec.id === `section-${tab}` ? "block" : "none";
    });
  },

  // 1. QUIZ LOGIC
  renderQuiz() {
    const container = document.getElementById("quiz-container");
    if (!container) return;

    const questions = MindBridgeData.assessments["ai-python"].quiz;

    container.innerHTML = `
      <div class="assessment-intro">
        <h3>⚡ Dərsdən Sonra Bilik Yoxlama Quiz-i</h3>
        <p>Hər sualı cavablandırın. AI və Mentor dərhal cavabınızı təhlil edib izahat təqdim edəcəkdir.</p>
      </div>

      <div class="questions-list">
        ${questions.map((q, idx) => `
          <div class="question-card" id="quiz-card-${idx}">
            <div class="q-header">
              <span class="q-num">Sual ${idx + 1} / ${questions.length}</span>
            </div>
            <p class="q-text">${q.question}</p>
            <div class="options-list">
              ${q.options.map((opt, optIdx) => `
                <button class="option-btn" onclick="Assessments.selectQuizOption(${idx}, ${optIdx})">
                  <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
                  <span class="opt-label">${opt}</span>
                </button>
              `).join('')}
            </div>
            <div class="explanation-box" id="quiz-exp-${idx}" style="display: none;"></div>
          </div>
        `).join('')}
      </div>

      <div class="quiz-footer-action">
        <button class="btn btn-primary btn-lg" onclick="Assessments.finishQuiz()">
          📊 Quiz Nəticəsini Hesabla & Praktik Tapşırığa Keç
        </button>
      </div>
    `;
  },

  selectQuizOption(qIdx, optIdx) {
    const questions = MindBridgeData.assessments["ai-python"].quiz;
    const q = questions[qIdx];
    this.quizAnswers[qIdx] = optIdx;

    const card = document.getElementById(`quiz-card-${qIdx}`);
    const btns = card.querySelectorAll(".option-btn");
    const expBox = document.getElementById(`quiz-exp-${qIdx}`);

    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) {
        btn.classList.add("correct");
      } else if (i === optIdx) {
        btn.classList.add("incorrect");
      }
    });

    expBox.style.display = "block";
    if (optIdx === q.correct) {
      expBox.className = "explanation-box success";
      expBox.innerHTML = `<strong>✅ Doğru cavab!</strong> ${q.explanation}`;
    } else {
      expBox.className = "explanation-box danger";
      expBox.innerHTML = `<strong>❌ Yanlış cavab.</strong> ${q.explanation}`;
    }
  },

  finishQuiz() {
    const questions = MindBridgeData.assessments["ai-python"].quiz;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (this.quizAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    this.scores.quiz = scorePct;

    App.showToast(`Quiz Nəticəniz: ${scorePct}% (${correctCount}/${questions.length} doğru)`, "success");
    this.updateAssessmentSummary();
    this.switchTab("practical");
  },

  // 2. PRACTICAL TASK LOGIC
  renderPracticalTask() {
    const container = document.getElementById("practical-container");
    if (!container) return;

    const task = MindBridgeData.assessments["ai-python"].practicalTask;

    container.innerHTML = `
      <div class="practical-card">
        <div class="card-header-flex">
          <div>
            <span class="badge badge-warning">💻 Canlı Layihə Tapşırığı</span>
            <h3 class="mt-1">${task.title}</h3>
          </div>
          <span class="badge badge-outline">Müddət: 25 dəq</span>
        </div>
        <p class="task-desc">${task.description}</p>

        <div class="code-editor-header">
          <span>📁 solution.js / python</span>
          <span class="text-muted">Canlı Sintaksis Yoxlanışı</span>
        </div>
        <textarea id="practical-code-input" class="code-editor-box" rows="12">${task.initialCode}</textarea>

        <div class="practical-actions">
          <button class="btn btn-primary" onclick="Assessments.submitPracticalTask()">
            🚀 AI & Mentor Rəyinə Göndər
          </button>
          <button class="btn btn-outline" onclick="Assessments.resetCode()">
            ↺ Kodu Sıfırla
          </button>
        </div>

        <div id="practical-feedback-box" style="display: none;" class="feedback-card mt-3 animate-fade-in"></div>
      </div>
    `;
  },

  resetCode() {
    const input = document.getElementById("practical-code-input");
    if (input) {
      input.value = MindBridgeData.assessments["ai-python"].practicalTask.initialCode;
    }
  },

  submitPracticalTask() {
    const input = document.getElementById("practical-code-input");
    const code = input ? input.value : "";
    const feedbackBox = document.getElementById("practical-feedback-box");
    if (!feedbackBox) return;

    // Simulate AI & Mentor review
    feedbackBox.style.display = "block";
    feedbackBox.innerHTML = `
      <div class="eval-loading">
        <span class="spinner"></span>
        <p>AI və Dr. Rəşad Əliyev kod strukturunu, arqumentləri və təhlükəsizlik qaydalarını yoxlayır...</p>
      </div>
    `;

    setTimeout(() => {
      this.scores.practical = 95;
      this.updateAssessmentSummary();

      feedbackBox.innerHTML = `
        <div class="mentor-eval-header">
          <div class="eval-score-circle">95%</div>
          <div>
            <h4>Təbriklər! Praktik Tapşırıq Uğurla Qəbul Edildi</h4>
            <div class="eval-by">Yoxlayan: <strong>Dr. Rəşad Əliyev (Yoxlanmış Ekspert)</strong> və MindBridge AI Engine</div>
          </div>
        </div>
        <div class="eval-body">
          <div class="eval-item">
            <span class="eval-check">✅</span> <strong>Funksional Məntiq:</strong> Yaşa əsaslanan qruplaşdırma və kohort təyini qüsursuz işləyir.
          </div>
          <div class="eval-item">
            <span class="eval-check">✅</span> <strong>18 Yaş Altı Qoruma Qatı:</strong> <code>parentConsentRequired: true</code> şərti dəqiq inteqrasiya edilib.
          </div>
          <div class="eval-item">
            <span class="eval-check">💬</span> <strong>Mentorun Fərdi Rəyi:</strong> "Kod çox təmiz və oxunaqlıdır. Qrup layihəsində komanda yoldaşlarına da bu məntiqi izah etməyin təqdirəlayiqdir."
          </div>
        </div>
        <div class="eval-footer mt-2">
          <button class="btn btn-primary" onclick="Assessments.switchTab('exam')">
            🎯 Yekun İmtahana Keç (Final Mərhələ)
          </button>
        </div>
      `;
      App.showToast("Praktik tapşırıq yüksək balla (95%) təsdiqləndi!", "success");
    }, 1500);
  },

  // 3. FINAL EXAM LOGIC
  renderExam() {
    const container = document.getElementById("exam-container");
    if (!container) return;

    const examQuestions = MindBridgeData.assessments["ai-python"].finalExam;

    container.innerHTML = `
      <div class="exam-header-banner">
        <div>
          <h3>🎓 MindBridge Rəsmi Yekun Sertifikasiya İmtahanı</h3>
          <p>Kursu uğurla başa vurmaq və Rəsmi Təsdiqlənmiş Sertifikat qazanmaq üçün minimum 70% bal tələb olunur.</p>
        </div>
        <div class="exam-timer">
          <span class="timer-icon">⏳</span>
          <div>
            <small>Qalan Vaxt</small>
            <strong>24:50</strong>
          </div>
        </div>
      </div>

      <div class="exam-questions-list">
        ${examQuestions.map((q, idx) => `
          <div class="exam-card" id="exam-card-${idx}">
            <div class="exam-q-num">Sual ${idx + 1} / ${examQuestions.length}</div>
            <p class="exam-q-title">${q.question}</p>
            <div class="exam-options">
              ${q.options.map((opt, optIdx) => `
                <label class="exam-opt-item">
                  <input type="radio" name="exam_q_${idx}" value="${optIdx}" onchange="Assessments.selectExamAnswer(${idx}, ${optIdx})" />
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="exam-footer-submit">
        <button class="btn btn-success btn-xl" onclick="Assessments.submitFinalExam()">
          🏆 İmtahanı Tamamla və Rəsmi Sertifikatı Al
        </button>
      </div>
    `;
  },

  selectExamAnswer(qIdx, optIdx) {
    this.examAnswers[qIdx] = optIdx;
  },

  submitFinalExam() {
    const examQuestions = MindBridgeData.assessments["ai-python"].finalExam;
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (this.examAnswers[idx] === q.correct) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / examQuestions.length) * 100);
    this.scores.exam = scorePct;

    if (scorePct >= 70) {
      App.showToast(`🎉 Təbriklər! İmtahandan uğurla keçdiniz (${scorePct}%). Rəsmi Sertifikatınız hazırdır!`, "success");
      
      // Generate certificate for current student
      const cohort = JSON.parse(localStorage.getItem("mindbridge_active_cohort") || "{}");
      const studentName = (cohort.student && cohort.student.name) || "Orxan Quliyev";
      const courseName = (cohort.subject && cohort.subject.title) || "Süni İntellekt və Python (Canlı Qrup Dərsi)";
      const mentorName = (cohort.mentor && cohort.mentor.name) || "Dr. Rəşad Əliyev";

      CertificateEngine.generateCertificate({
        studentName,
        courseName,
        mentorName,
        grade: scorePct >= 90 ? "Fərqlənmə (Distinction)" : "Uğurlu (Passed)",
        finalScore: scorePct
      });

      this.updateAssessmentSummary();
      App.navigateTo("certificate");
    } else {
      App.showToast(`Nəticəniz: ${scorePct}%. Keçid balı 70%-dir. Zəhmət olmasa təkrar cəhd edin.`, "warning");
    }
  },

  updateAssessmentSummary() {
    const summaryCard = document.getElementById("overall-assessment-summary");
    if (!summaryCard) return;

    const quizScore = this.scores.quiz !== null ? `${this.scores.quiz}%` : "Gözləmədə";
    const practicalScore = this.scores.practical !== null ? `${this.scores.practical}%` : "Gözləmədə";
    const examScore = this.scores.exam !== null ? `${this.scores.exam}%` : "Gözləmədə";

    summaryCard.innerHTML = `
      <div class="summary-metric">
        <span class="sub">1. Quiz</span>
        <strong>${quizScore}</strong>
      </div>
      <div class="summary-metric">
        <span class="sub">2. Praktik Layihə</span>
        <strong>${practicalScore}</strong>
      </div>
      <div class="summary-metric">
        <span class="sub">3. Final İmtahanı</span>
        <strong>${examScore}</strong>
      </div>
      <div class="summary-status">
        <span class="badge ${this.scores.exam >= 70 ? 'badge-success' : 'badge-warning'}">
          ${this.scores.exam >= 70 ? 'Sertifikat Təsdiqləndi 🏅' : 'Tədris Davam Edir 📚'}
        </span>
      </div>
    `;
  }
};
