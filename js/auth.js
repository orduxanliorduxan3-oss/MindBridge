// MindBridge Authentication & User Management Engine
const Auth = {
  currentUser: null,
  users: [],

  defaultAccounts: [
    {
      id: "usr_teen_1",
      name: "Orxan Quliyev",
      email: "orxan@mindbridge.az",
      password: "123",
      age: 16,
      role: "teen",
      isMinor: true,
      parentName: "Sevda Quliyeva",
      parentEmail: "sevda@mail.com",
      parentPhone: "+994 50 234 56 78",
      activeCourse: "Süni İntellekt və Python",
      avatar: "👦"
    },
    {
      id: "usr_parent_1",
      name: "Sevda Quliyeva",
      email: "sevda@mindbridge.az",
      password: "123",
      age: 42,
      role: "parent",
      isMinor: false,
      childName: "Orxan Quliyev",
      childAge: 16,
      phone: "+994 50 234 56 78",
      avatar: "👩"
    },
    {
      id: "usr_adult_1",
      name: "Kamran Nəcəfov",
      email: "kamran@mindbridge.az",
      password: "123",
      age: 24,
      role: "adult",
      isMinor: false,
      activeCourse: "React & Fullstack Veb",
      avatar: "👨"
    },
    {
      id: "usr_mentor_1",
      name: "Dr. Rəşad Əliyev",
      email: "mentor@mindbridge.az",
      password: "123",
      age: 38,
      role: "mentor",
      isMinor: false,
      title: "Süni İntellekt üzrə Baş Mütəxəssis (Yoxlanmış Pedaqoq)",
      avatar: "👨‍🏫"
    }
  ],

  init() {
    this.loadUsers();
    this.checkSession();
    this.attachEvents();
    this.updateHeaderUI();
  },

  loadUsers() {
    const saved = localStorage.getItem("mindbridge_users");
    if (saved) {
      try {
        this.users = JSON.parse(saved);
      } catch (e) {
        this.users = [...this.defaultAccounts];
      }
    } else {
      this.users = [...this.defaultAccounts];
      this.saveUsers();
    }
  },

  saveUsers() {
    localStorage.setItem("mindbridge_users", JSON.stringify(this.users));
  },

  checkSession() {
    const session = localStorage.getItem("mindbridge_session_user");
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      // Default to Orxan for instant demo flow
      this.currentUser = this.users[0];
      localStorage.setItem("mindbridge_session_user", JSON.stringify(this.currentUser));
    }
  },

  attachEvents() {
    // Login form
    const loginForm = document.getElementById("auth-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const pass = document.getElementById("login-password").value;
        this.login(email, pass);
      });
    }

    // Register form
    const regForm = document.getElementById("auth-register-form");
    if (regForm) {
      regForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }

    // Age change listener in registration
    const regAgeInput = document.getElementById("reg-age");
    if (regAgeInput) {
      regAgeInput.addEventListener("input", (e) => {
        this.handleAgeChange(parseInt(e.target.value) || 0);
      });
    }
  },

  handleAgeChange(age) {
    const parentFields = document.getElementById("reg-parent-fields");
    const minorNotice = document.getElementById("reg-minor-notice");

    if (age > 0 && age < 18) {
      if (parentFields) parentFields.style.display = "block";
      if (minorNotice) minorNotice.style.display = "flex";
      // Auto select teen role if student
      const roleSelect = document.getElementById("reg-role");
      if (roleSelect && roleSelect.value === "student") {
        // Keep student
      }
    } else {
      if (parentFields) parentFields.style.display = "none";
      if (minorNotice) minorNotice.style.display = "none";
    }
  },

  openAuthModal(tab = "login") {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.add("active");
      this.switchAuthTab(tab);
    }
  },

  closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  },

  switchAuthTab(tab) {
    const loginSection = document.getElementById("auth-login-section");
    const regSection = document.getElementById("auth-register-section");
    const loginTabBtn = document.getElementById("tab-btn-login");
    const regTabBtn = document.getElementById("tab-btn-register");

    if (tab === "login") {
      if (loginSection) loginSection.style.display = "block";
      if (regSection) regSection.style.display = "none";
      if (loginTabBtn) loginTabBtn.classList.add("active");
      if (regTabBtn) regTabBtn.classList.remove("active");
    } else {
      if (loginSection) loginSection.style.display = "none";
      if (regSection) regSection.style.display = "block";
      if (loginTabBtn) loginTabBtn.classList.remove("active");
      if (regTabBtn) regTabBtn.classList.add("active");
    }
  },

  login(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      App.showToast("Bu e-poçtla qeydiyyatdan keçmiş istifadəçi tapılmadı.", "warning");
      return;
    }

    if (user.password !== password && password !== "123") {
      App.showToast("Şifrə yanlışdır. Demo üçün '123' istifadə edə bilərsiniz.", "danger");
      return;
    }

    this.setCurrentUser(user);
    this.closeAuthModal();
    App.showToast(`Xoş gəldiniz, ${user.name}! Giriş uğurla tamamlandı.`, "success");
  },

  handleRegister() {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value;
    const age = parseInt(document.getElementById("reg-age").value) || 18;
    const chosenRole = document.getElementById("reg-role").value;

    // Check duplicate email
    if (this.users.some(u => u.email.toLowerCase() === email)) {
      App.showToast("Bu e-poçt ünvanı artıq qeydiyyatdan keçib.", "warning");
      return;
    }

    const isMinor = age < 18;
    let actualRole = "adult";

    if (chosenRole === "parent") {
      actualRole = "parent";
    } else if (chosenRole === "mentor") {
      actualRole = "mentor";
    } else {
      actualRole = isMinor ? "teen" : "adult";
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name,
      email,
      password,
      age,
      role: actualRole,
      isMinor,
      avatar: actualRole === "teen" ? "🧒" : (actualRole === "parent" ? "👩" : (actualRole === "mentor" ? "👨‍🏫" : "🎓")),
      createdAt: new Date().toISOString()
    };

    if (isMinor) {
      newUser.parentName = document.getElementById("reg-parent-name")?.value.trim() || "Valideyn";
      newUser.parentEmail = document.getElementById("reg-parent-email")?.value.trim() || "";
      newUser.parentPhone = document.getElementById("reg-parent-phone")?.value.trim() || "";

      // Also auto-sync to ParentGuard module
      if (typeof ParentGuard !== "undefined" && ParentGuard.data) {
        ParentGuard.data.studentName = name;
        ParentGuard.data.studentAge = age;
        ParentGuard.data.parentName = newUser.parentName;
        ParentGuard.data.parentEmail = newUser.parentEmail;
        ParentGuard.data.parentPhone = newUser.parentPhone;
        ParentGuard.saveState();
      }
    }

    this.users.unshift(newUser);
    this.saveUsers();
    this.setCurrentUser(newUser);
    this.closeAuthModal();

    if (isMinor) {
      App.showToast(`Qeydiyyat tamamlandı! 18 yaş altı qoruma rejimi aktivləşdirildi.`, "success");
      // Trigger consent modal
      setTimeout(() => {
        if (typeof ParentGuard !== "undefined") ParentGuard.openConsentModal();
      }, 800);
    } else {
      App.showToast(`Təbriklər ${name}! Hesabınız uğurla yaradıldı.`, "success");
    }
  },

  setCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem("mindbridge_session_user", JSON.stringify(user));
    
    // Sync active role in main App
    const roleSelector = document.getElementById("active-role-selector");
    if (roleSelector) {
      roleSelector.value = user.role;
    }
    App.switchRole(user.role);
    this.updateHeaderUI();

    // Fill student name in matchmaker if exists
    const matchName = document.getElementById("student-name");
    const matchAge = document.getElementById("student-age");
    if (matchName) matchName.value = user.name;
    if (matchAge) {
      matchAge.value = user.age || 18;
      if (typeof AIMatchmaker !== "undefined") AIMatchmaker.checkAgeSafetyPreview(user.age || 18);
    }
  },

  quickLogin(roleKey) {
    const found = this.users.find(u => u.role === roleKey) || this.defaultAccounts.find(u => u.role === roleKey);
    if (found) {
      this.setCurrentUser(found);
      this.closeAuthModal();
      App.showToast(`Sürətli giriş: ${found.name} (${found.role.toUpperCase()}) olaraq daxil olundu.`, "info");
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem("mindbridge_session_user");
    this.updateHeaderUI();
    App.showToast("Hesabdan çıxış edildi.", "info");
  },

  updateHeaderUI() {
    const authWrapper = document.getElementById("header-auth-controls");
    if (!authWrapper) return;

    if (this.currentUser) {
      const u = this.currentUser;
      const roleTitles = {
        teen: "Gənc Şagird (<18)",
        adult: "Böyük Tələbə (18+)",
        parent: "Valideyn",
        mentor: "Yoxlanmış Ekspert"
      };

      authWrapper.innerHTML = `
        <div class="user-profile-badge" onclick="Auth.toggleUserDropdown()">
          <span class="user-avatar-pill">${u.avatar || '👤'}</span>
          <div class="user-name-box">
            <span class="u-name">${u.name}</span>
            <span class="u-role">${roleTitles[u.role] || u.role}</span>
          </div>
          <span class="dropdown-chevron">▾</span>
        </div>

        <div id="user-profile-dropdown" class="user-dropdown-menu" style="display: none;">
          <div class="dropdown-header">
            <strong>${u.name}</strong>
            <small>${u.email}</small>
          </div>
          <div class="dropdown-items">
            ${u.role === 'parent' ? `
              <a class="dd-item" onclick="App.navigateTo('parent-panel'); Auth.toggleUserDropdown();">
                🛡️ Valideyn Paneli
              </a>
            ` : `
              <a class="dd-item" onclick="App.navigateTo('classroom'); Auth.toggleUserDropdown();">
                🎥 Canlı Dərs Otağım
              </a>
              <a class="dd-item" onclick="App.navigateTo('assessments'); Auth.toggleUserDropdown();">
                📊 Nəticələrim & Quiz
              </a>
            `}
            <a class="dd-item" onclick="App.navigateTo('certificate'); Auth.toggleUserDropdown();">
              🎓 Sertifikatlarım
            </a>
            <hr class="dd-divider" />
            <a class="dd-item text-danger" onclick="Auth.logout(); Auth.toggleUserDropdown();">
              🚪 Çıxış Et
            </a>
          </div>
        </div>
      `;
    } else {
      authWrapper.innerHTML = `
        <div class="header-auth-pill" onclick="Auth.openAuthModal('login')">
          <button class="btn-header-login">Daxil Ol</button>
          <button class="btn-header-arrow">↗</button>
        </div>
      `;
    }
  },

  toggleUserDropdown() {
    const dd = document.getElementById("user-profile-dropdown");
    if (!dd) return;
    dd.style.display = dd.style.display === "block" ? "none" : "block";
  }
};

// Close dropdown on outside click
document.addEventListener("click", (e) => {
  const profileBadge = document.querySelector(".user-profile-badge");
  const dropdown = document.getElementById("user-profile-dropdown");
  if (dropdown && dropdown.style.display === "block") {
    if (!profileBadge || (!profileBadge.contains(e.target) && !dropdown.contains(e.target))) {
      dropdown.style.display = "none";
    }
  }
});
