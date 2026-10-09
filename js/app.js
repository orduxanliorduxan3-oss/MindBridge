// MindBridge Main Application Controller
const App = {
  currentRoute: "home",
  currentRole: "teen", // 'adult', 'teen', 'parent', 'mentor'

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupRoleSwitcher();
    this.renderCourses("all");
    this.renderMentorsDirectory();
    this.checkServerStatus();

    // Initialize sub-modules
    if (typeof Auth !== "undefined") Auth.init();
    if (typeof AIMatchmaker !== "undefined") AIMatchmaker.init();
    if (typeof ParentGuard !== "undefined") ParentGuard.init();
    if (typeof Classroom !== "undefined") Classroom.init();
    if (typeof Assessments !== "undefined") Assessments.init();
    if (typeof CertificateEngine !== "undefined") CertificateEngine.init();

    // Default route check
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      this.navigateTo(hash);
    } else {
      this.navigateTo("home");
    }
  },

  setupNavigation() {
    document.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const target = el.getAttribute("data-nav");
        this.navigateTo(target);
      });
    });

    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) this.navigateTo(hash);
    });
  },

  navigateTo(pageId) {
    this.currentRoute = pageId;
    window.location.hash = pageId;

    // Toggle active nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-nav") === pageId);
    });

    // Toggle pages
    document.querySelectorAll(".page-view").forEach(view => {
      view.classList.toggle("active", view.id === `view-${pageId}`);
    });

    // Scroll top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Page specific triggers
    if (pageId === "classroom" && typeof Classroom !== "undefined") {
      setTimeout(() => Classroom.resizeCanvas(), 100);
    }
    if (pageId === "parent-panel" && typeof ParentGuard !== "undefined") {
      ParentGuard.renderDashboard();
    }
    if (pageId === "certificate" && typeof CertificateEngine !== "undefined") {
      CertificateEngine.renderCertificate();
    }
  },

  setupRoleSwitcher() {
    const roleSelector = document.getElementById("active-role-selector");
    if (!roleSelector) return;

    roleSelector.addEventListener("change", (e) => {
      this.switchRole(e.target.value);
    });
  },

  switchRole(role) {
    this.currentRole = role;
    const banner = document.getElementById("role-context-banner");

    if (role === "teen") {
      this.showToast("🛡️ Gənc Şagird (<18) rejimi aktivdir. Valideyn razılığı və qoruma qatı işləyir.", "info");
      if (banner) {
        banner.innerHTML = `<span>🛡️ <strong>Gənc Şagird Rejimi (18 yaş altı):</strong> Valideyn nəzarəti və AI təhlükəsizlik filtri aktivdir.</span>`;
        banner.className = "role-banner banner-teen";
      }
      // Prefill age in matchmaker
      const ageInput = document.getElementById("student-age");
      if (ageInput) {
        ageInput.value = 15;
        if (typeof AIMatchmaker !== "undefined") AIMatchmaker.checkAgeSafetyPreview(15);
      }
    } else if (role === "parent") {
      this.showToast("👨‍👩‍👧 Valideyn Paneli rejiminə keçid edildi.", "info");
      this.navigateTo("parent-panel");
      if (banner) {
        banner.innerHTML = `<span>👨‍👩‍👧 <strong>Valideyn İdarəetmə Rejimi:</strong> Övladınızın dərslərinə, təhlükəsizlik jurnalına və cədvəlinə nəzarət edirsiniz.</span>`;
        banner.className = "role-banner banner-parent";
      }
    } else if (role === "adult") {
      this.showToast("🎓 Böyüklər üçün Peşəkar Qrup Təhsili rejimi aktivdir.", "info");
      if (banner) {
        banner.innerHTML = `<span>🎓 <strong>Böyüklər üçün Peşəkar Rejim (18+):</strong> Sənaye yönümlü qrup dərsləri və birbaşa sertifikat proqramı.</span>`;
        banner.className = "role-banner banner-adult";
      }
      const ageInput = document.getElementById("student-age");
      if (ageInput) {
        ageInput.value = 24;
        if (typeof AIMatchmaker !== "undefined") AIMatchmaker.checkAgeSafetyPreview(24);
      }
    } else if (role === "mentor") {
      this.showToast("👨‍🏫 Yoxlanmış Ekspert / Müəllim rejiminə keçid edildi.", "info");
      if (banner) {
        banner.innerHTML = `<span>👨‍🏫 <strong>Yoxlanmış Ekspert Portalı:</strong> Canlı dərslərin idarəsi, qrup jurnalı və tələbə qiymətləndirməsi.</span>`;
        banner.className = "role-banner banner-mentor";
      }
      this.navigateTo("classroom");
    }
  },

  renderMentorsDirectory() {
    const list = document.getElementById("mentors-directory-grid");
    if (!list) return;

    list.innerHTML = MindBridgeData.mentors.map(m => `
      <div class="mentor-card animate-fade-in">
        <div class="mentor-card-top">
          <span class="mentor-badge">
            <span class="verified-icon">✓</span> ${m.badge}
          </span>
          <span class="mentor-rating">⭐ ${m.rating} (${m.reviewsCount})</span>
        </div>

        <div class="mentor-main">
          <div class="mentor-avatar-lg">${m.avatar}</div>
          <h3 class="mentor-name">${m.name}</h3>
          <p class="mentor-spec">${m.title}</p>
        </div>

        <p class="mentor-bio">${m.bio}</p>

        <div class="mentor-details-box">
          <div class="detail-row">
            <span class="detail-lbl">Yoxlanış:</span>
            <span class="detail-val text-success">🛡️ ${m.backgroundCheck}</span>
          </div>
          <div class="detail-row">
            <span class="detail-lbl">Təcrübə:</span>
            <span class="detail-val">${m.experience}</span>
          </div>
          <div class="detail-row">
            <span class="detail-lbl">Uyğun Yaş:</span>
            <span class="detail-val">${m.ageRange}</span>
          </div>
        </div>

        <div class="mentor-footer">
          <button class="btn btn-primary btn-block" onclick="App.chooseMentorForMatching('${m.id}')">
            🎯 Bu Ekspertlə AI Qrupu Yığ
          </button>
        </div>
      </div>
    `).join('');
  },

  chooseMentorForMatching(mentorId) {
    const mentor = MindBridgeData.mentors.find(m => m.id === mentorId);
    if (!mentor) return;

    this.navigateTo("matchmaker");
    this.showToast(`🎯 ${mentor.name} üçün AI qrup axtarışı başladılır...`, "info");

    const mentorSubjectMap = {
      m1: "ai-python",
      m_sarah: "ai-python",
      m2: "web-dev",
      m_maria: "web-dev",
      m3: "ielts-speaking",
      m4: "kids-scratch",
      m5: "math-logic",
      m6: "dim-buraxilis-11",
      m7: "dim-buraxilis-11"
    };

    const targetSub = mentorSubjectMap[mentorId];
    if (targetSub) {
      const subjectSelect = document.getElementById("student-subject");
      if (subjectSelect) subjectSelect.value = targetSub;
    }
  },

  startClassroomSession() {
    this.navigateTo("classroom");
    this.showToast("🎥 Canlı qrup otağına uğurla qoşuldunuz!", "success");
  },

  checkServerStatus() {
    const serverBadge = document.getElementById("server-status-pill");
    fetch("http://localhost:5000/api/status")
      .then(res => res.json())
      .then(data => {
        if (serverBadge) {
          serverBadge.className = "server-pill online";
          serverBadge.innerHTML = `<span class="dot"></span> Localhost Online (${data.port})`;
        }
      })
      .catch(() => {
        if (serverBadge) {
          serverBadge.className = "server-pill local-direct";
          serverBadge.innerHTML = `<span class="dot"></span> Localhost Engine`;
        }
      });
  },

  renderCourses(category = "all") {
    const grid = document.getElementById("courses-cards-grid");
    if (!grid || !MindBridgeData.courses) return;

    const filtered = category === "all" 
      ? MindBridgeData.courses 
      : MindBridgeData.courses.filter(c => c.categoryKey === category);

    grid.innerHTML = filtered.map(c => `
      <div class="course-card animate-fade-in" data-category="${c.categoryKey}">
        <div class="course-thumb-box">
          <img src="${c.image}" alt="${c.title}" class="course-thumb-img" onerror="this.src='assets/courses/course-1.jpg'" />
          <span class="course-yellow-badge">${c.specialBadge}</span>
        </div>
        <div class="course-meta-row">
          <span class="course-category-pill">${c.category}</span>
          <span class="course-cohort-badge">👥 ${c.cohortSize || '4 Nəfərlik Qrup'}</span>
        </div>
        <h3 class="course-title">${c.title}</h3>
        
        <div class="course-mentor-row">
          <div class="mentor-avatar-micro">👨‍🏫</div>
          <div class="mentor-micro-info">
            <span class="mentor-micro-name">${c.instructor}</span>
            <span class="mentor-micro-tag">✓ ${c.instructorBadge || 'Yoxlanmış Pedaqoq'}</span>
          </div>
        </div>

        <div class="course-schedule-tag">
          📅 ${c.schedule}
        </div>

        <div class="course-price-rating-row">
          <div class="course-price-box">
            <span class="price-label">Qrup Dərsi</span>
            <div>
              <span class="price-value">$${c.price}</span>
              <span class="price-off">(${c.discountBadge})</span>
            </div>
          </div>
          <div class="course-rating-box">
            <span class="stars">★★★★★</span>
            <span>${c.rating.toFixed(2)} (${c.reviewsCount})</span>
          </div>
        </div>
        <div>
          ${c.primaryButton ? `
            <button class="btn-enroll-solid" onclick="App.enrollInCourse('${c.id}')">⚡ Bu Qrupda Yerini Tut</button>
          ` : `
            <button class="btn-enroll-outline" onclick="App.enrollInCourse('${c.id}')">👥 Kohorta Bax & Qoşul</button>
          `}
        </div>
      </div>
    `).join('');
  },

  filterCourses(category) {
    document.querySelectorAll(".filter-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-category") === category);
    });
    this.renderCourses(category);
  },

  enrollInCourse(courseId) {
    const course = MindBridgeData.courses.find(c => c.id === courseId);
    if (!course) return;

    this.showToast(`✨ "${course.title}" qrupuna qoşulmaq üçün AI Matchmaker açılır...`, "info");
    this.navigateTo("matchmaker");

    // Preselect subject if matchmaker subject select exists
    const subjectSelect = document.getElementById("student-subject");
    if (subjectSelect && course.subjectId) {
      subjectSelect.value = course.subjectId;
    }

    const ageInput = document.getElementById("student-age");
    if (ageInput) {
      if (course.categoryKey === "kids") {
        ageInput.value = 11;
        if (typeof AIMatchmaker !== "undefined") AIMatchmaker.checkAgeSafetyPreview(11);
      } else if (course.categoryKey === "dim") {
        ageInput.value = 16;
        if (typeof AIMatchmaker !== "undefined") AIMatchmaker.checkAgeSafetyPreview(16);
      }
    }
  },

  loadMoreCourses() {
    this.showToast("📚 Bütün mövcud 20,000+ kurs kataloqu yükləndi!", "success");
    // Duplicate courses with unique keys for showcase
    if (MindBridgeData.courses && MindBridgeData.courses.length <= 6) {
      const more = MindBridgeData.courses.map(c => ({
        ...c,
        id: c.id + "_more",
        title: "Advanced: " + c.title,
        price: c.price + 20
      }));
      MindBridgeData.courses.push(...more);
      this.renderCourses("all");
    }
  },

  setupTheme() {
    const savedTheme = localStorage.getItem("mindbridge_theme");
    if (savedTheme === "dark") {
      document.body.classList.add("theme-dark");
    }
  },

  toggleTheme() {
    const isDark = document.body.classList.toggle("theme-dark");
    localStorage.setItem("mindbridge_theme", isDark ? "dark" : "light");
    this.showToast(isDark ? "Qaranlıq rejim aktivləşdirildi" : "İşıqlı və rahat MindBridge rejimi aktivləşdirildi", "info");
  },

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Auto start when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
