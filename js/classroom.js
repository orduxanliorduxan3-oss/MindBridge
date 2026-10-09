// MindBridge Interactive Live Group Classroom
const Classroom = {
  canvas: null,
  ctx: null,
  isDrawing: false,
  tool: "pen",
  color: "#34d399",
  lineWidth: 2.5,
  handRaised: false,
  micMuted: false,
  cameraOff: false,

  chatMessages: [
    { sender: "Dr. Rəşad Əliyev", role: "mentor", text: "Salamlar hər kəsə! Bugünkü canlı qrup dərsimizə xoş gəldiniz. Bu gün AI və alqoritmik qərar mexanizmlərini tətbiq edəcəyik.", time: "18:02" },
    { sender: "Ayan M.", role: "peer", text: "Salam müəllim! Dərs materiallarını lövhədə görə bilirik.", time: "18:03" },
    { sender: "Orxan Q.", role: "peer", text: "Salam, mənim bir sualım var idi əvvəlki dərsdəki dövrlərlə bağlı.", time: "18:04" },
    { sender: "Dr. Rəşad Əliyev", role: "mentor", text: "Əla sualdır Orxan! Lövhəyə baxın, indi birlikdə sxemi çəkək.", time: "18:05" }
  ],

  init() {
    this.initCanvas();
    this.renderChat();
    this.attachEvents();
  },

  initCanvas() {
    this.canvas = document.getElementById("classroom-canvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");

    // Resize canvas to match display size
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Mouse & Touch events
    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    this.canvas.addEventListener("mouseup", () => this.stopDrawing());
    this.canvas.addEventListener("mouseleave", () => this.stopDrawing());

    // Draw initial diagram on whiteboard
    this.drawInitialDiagram();
  },

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width - 20;
    this.canvas.height = 380;
    this.drawInitialDiagram();
  },

  drawInitialDiagram() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Subtle grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }

    // Teacher's sample board notes
    ctx.fillStyle = "#34d399";
    ctx.font = "600 15px -apple-system, Inter, sans-serif";
    ctx.fillText("MindBridge Alqoritmik Sxemi: Canlı Kohort Bölüşdürücüsü", 30, 42);

    // Node 1: Student
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.beginPath();
    ctx.arc(80, 120, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#f0fdf4";
    ctx.font = "500 12px Inter";
    ctx.fillText("Tələbə", 62, 124);

    // Arrow to AI
    ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(112, 120);
    ctx.lineTo(205, 120);
    ctx.stroke();

    // Node 2: AI Core
    ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(210, 94, 130, 52, 8) : ctx.rect(210, 94, 130, 52);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#34d399";
    ctx.font = "600 12px Inter";
    ctx.fillText("AI Matchmaker", 226, 125);

    // Lines to cohorts
    ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
    ctx.beginPath();
    ctx.moveTo(340, 120);
    ctx.lineTo(415, 90);
    ctx.moveTo(340, 120);
    ctx.lineTo(415, 150);
    ctx.stroke();

    // Minor Cohort (<18)
    ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
    ctx.beginPath();
    ctx.arc(445, 88, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "500 11px Inter";
    ctx.fillText("<18 Qrup", 425, 92);

    // Adult Cohort (18+)
    ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
    ctx.beginPath();
    ctx.arc(445, 152, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#34d399";
    ctx.font = "500 11px Inter";
    ctx.fillText("18+ Qrup", 425, 156);

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.font = "400 12px Inter";
    ctx.fillText("✍️ Lövhədə sərbəst qeyd aparmaq və çəkmək üçün yuxarıdakı alətlərdən istifadə edin.", 30, 350);
  },

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  },

  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getMousePos(e);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  },

  draw(e) {
    if (!this.isDrawing) return;
    const pos = this.getMousePos(e);

    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = "round";

    if (this.tool === "eraser") {
      this.ctx.strokeStyle = document.body.classList.contains("theme-light") ? "#ffffff" : "#0b120e";
      this.ctx.lineWidth = 22;
    } else {
      this.ctx.strokeStyle = this.color;
    }

    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  },

  stopDrawing() {
    this.isDrawing = false;
  },

  setTool(tool) {
    this.tool = tool;
    document.querySelectorAll(".wb-tool-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tool === tool);
    });
  },

  setColor(color) {
    this.color = color;
    this.tool = "pen";
    document.querySelectorAll(".wb-tool-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tool === "pen");
    });
  },

  clearBoard() {
    if (confirm("Lövhəni tam təmizləmək istəyirsiniz?")) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawInitialDiagram();
    }
  },

  attachEvents() {
    const chatForm = document.getElementById("classroom-chat-form");
    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.sendChatMessage();
      });
    }
  },

  renderChat() {
    const chatContainer = document.getElementById("classroom-chat-list");
    if (!chatContainer) return;

    chatContainer.innerHTML = this.chatMessages.map(msg => `
      <div class="chat-bubble ${msg.role}">
        <div class="chat-meta">
          <span class="chat-sender">${msg.sender}</span>
          <span class="chat-time">${msg.time}</span>
        </div>
        <div class="chat-text">${msg.text}</div>
      </div>
    `).join('');

    chatContainer.scrollTop = chatContainer.scrollHeight;
  },

  sendChatMessage() {
    const input = document.getElementById("classroom-chat-input");
    if (!input || !input.value.trim()) return;

    const rawText = input.value.trim();
    input.value = "";

    // AI Safety Content Filter check
    // Detect sensitive data (phone numbers, malicious patterns)
    const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    const containsPhone = phoneRegex.test(rawText);
    const containsEmail = emailRegex.test(rawText);

    if (containsPhone || containsEmail) {
      App.showToast("🛡️ AI Təhlükəsizlik Filtrləndi: 18 yaş altı qoruma qaydalarına əsasən şəxsi telefon/email məlumatı göndərilə bilməz!", "warning");
      
      // Log to parent dashboard
      if (ParentGuard && ParentGuard.data) {
        ParentGuard.data.safetyLogs.unshift({
          time: "İndicə",
          type: "shield",
          message: `Şagird çatda əlaqə məlumatı göndərməyə cəhd etdi və AI tərəfindən bloklandı.`
        });
        ParentGuard.saveState();
      }
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.chatMessages.push({
      sender: "Siz (Tələbə)",
      role: "me",
      text: rawText,
      time: timeStr
    });

    this.renderChat();

    // Auto mentor answer simulation
    setTimeout(() => {
      const responses = [
        "Əla yanaşmadır! Qrup yoldaşların da bu fikri dəstəkləyir.",
        "Düzgün qeyd etdiniz. Kod blokunda məhz bu parametri tənzimləmək lazımdır.",
        "Bəli, tamamilə doğrudur. Növbəti quizdə bu tipli suallar olacaq.",
        "Çox yaxşı sualdır! Lövhədəki 2-ci qovşağa diqqət yetirin."
      ];
      const randomResp = responses[Math.floor(Math.random() * responses.length)];
      
      this.chatMessages.push({
        sender: "Dr. Rəşad Əliyev",
        role: "mentor",
        text: randomResp,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.renderChat();
    }, 1200);
  },

  toggleHand() {
    this.handRaised = !this.handRaised;
    const btn = document.getElementById("raise-hand-btn");
    if (btn) {
      btn.classList.toggle("active", this.handRaised);
      btn.innerHTML = this.handRaised ? "✋ Əl Qaldırılıb" : "✋ Əl Qaldır";
    }
    App.showToast(this.handRaised ? "Əl qaldırdınız. Müəllim növbəti sual üçün sizə söz verəcək." : "Əl endirildi.", "info");
  },

  toggleMic() {
    this.micMuted = !this.micMuted;
    const btn = document.getElementById("toggle-mic-btn");
    if (btn) {
      btn.classList.toggle("btn-danger", this.micMuted);
      btn.innerHTML = this.micMuted ? "🔇 Mikrofon Bağlı" : "🎤 Mikrofon Açıq";
    }
    App.showToast(this.micMuted ? "Mikrofon səssizləşdirildi" : "Mikrofon aktivdir", "info");
  },

  toggleCamera() {
    this.cameraOff = !this.cameraOff;
    const btn = document.getElementById("toggle-cam-btn");
    const myVideo = document.getElementById("my-video-tile");
    if (btn) {
      btn.classList.toggle("btn-danger", this.cameraOff);
      btn.innerHTML = this.cameraOff ? "📷 Kamera Bağlı" : "📹 Kamera Açıq";
    }
    if (myVideo) {
      myVideo.classList.toggle("cam-off", this.cameraOff);
    }
    App.showToast(this.cameraOff ? "Kamera bağlandı" : "Kamera yandırıldı", "info");
  }
};
