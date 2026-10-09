/* Vector-backed board: normalized coordinates survive resizing and route changes. */
const Whiteboard = {
  strokes: [], redoStack: [], current: null, tool: 'pen', color: '#7055df', width: 3,
  mount(canvas) {
    this.unmount();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas.parentElement);
    canvas.addEventListener('pointerdown', e => {
      if (this.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      this.pointer = e.pointerId;
      this.current = {tool:this.tool,color:this.color,width:this.width,points:[this.point(e)]};
      this.redoStack = [];
      this.paint();
    });
    canvas.addEventListener('pointermove', e => {
      if (!this.current || e.pointerId !== this.pointer) return;
      const events = e.getCoalescedEvents?.() || [e];
      for (const item of events.length ? events : [e]) this.current.points.push(this.point(item));
      this.paint();
    });
    const end = e => { if (e.pointerId === this.pointer) this.finish(); };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('lostpointercapture', end);
    this.resize();
  },
  unmount() { this.finish(); this.observer?.disconnect(); this.canvas=null; this.ctx=null; },
  finish() { if(this.current){this.strokes.push(this.current);this.current=null;this.syncControls();} },
  point(e) {const r=this.canvas.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};},
  resize() {
    if(!this.canvas) return;
    const r=this.canvas.parentElement.getBoundingClientRect();
    if(!r.width || !r.height) return;
    const dpr=Math.min(window.devicePixelRatio||1,3);
    this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);
    this.paint();
  },
  paint() {
    if(!this.ctx) return;
    const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height;
    ctx.clearRect(0,0,w,h);
    for(const stroke of [...this.strokes,...(this.current?[this.current]:[])]) {
      if(stroke.tool==='clear'){ctx.clearRect(0,0,w,h);continue;}
      ctx.globalCompositeOperation=stroke.tool==='eraser'?'destination-out':'source-over';
      ctx.strokeStyle=stroke.color;ctx.fillStyle=stroke.color;
      ctx.lineWidth=(stroke.tool==='eraser'?24:stroke.width)*w/800;
      ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
      const first=stroke.points[0];
      if(stroke.points.length===1){ctx.arc(first.x*w,first.y*h,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();}
      else {ctx.moveTo(first.x*w,first.y*h);for(const p of stroke.points.slice(1))ctx.lineTo(p.x*w,p.y*h);ctx.stroke();}
    }
    ctx.globalCompositeOperation='source-over';
  },
  setTool(tool) {this.tool=tool;this.syncControls();},
  setColor(color) {this.color=color;this.tool='pen';this.syncControls();},
  undo() {this.finish();if(this.strokes.length)this.redoStack.push(this.strokes.pop());this.paint();this.syncControls();},
  redo() {if(this.redoStack.length)this.strokes.push(this.redoStack.pop());this.paint();this.syncControls();},
  clear() {this.finish();if(this.strokes.length){this.strokes.push({tool:'clear'});this.redoStack=[];}this.paint();this.syncControls();},
  syncControls() {
    document.querySelectorAll('[data-tool]').forEach(b=>{const active=b.dataset.tool===this.tool;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
    document.querySelectorAll('[data-color]').forEach(b=>{const active=b.dataset.color===this.color;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
    const undo=document.querySelector('[data-action="board-undo"]'),redo=document.querySelector('[data-action="board-redo"]');
    if(undo)undo.disabled=!this.strokes.length;if(redo)redo.disabled=!this.redoStack.length;
  },
  download() {
    if(!this.canvas) return;
    const output=document.createElement('canvas');output.width=this.canvas.width;output.height=this.canvas.height;
    const ctx=output.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,output.width,output.height);ctx.drawImage(this.canvas,0,0);
    output.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='MindBridge-whiteboard.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  }
};
