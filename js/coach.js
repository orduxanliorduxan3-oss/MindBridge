'use strict';

const MindBridgeCoach={
 status:'idle',model:'SmolLM2 135M · on-device',messages:[],draft:'',pending:'',busy:false,error:'',answered:false,progress:'',worker:null,
 init(){
  document.addEventListener('submit',event=>{if(event.target.id==='coach-form'){event.preventDefault();this.send();}});
  document.addEventListener('input',event=>{if(event.target.id==='coach-input')this.draft=event.target.value;});
  document.addEventListener('click',event=>{const button=event.target.closest('[data-coach-prompt]');if(button){this.draft=button.dataset.coachPrompt;this.send();}});
 },
 ensureWorker(){
  if(this.worker)return this.worker;
  const worker=new Worker('js/local-ai-worker.js',{type:'module'});
  worker.onmessage=event=>this.onWorkerMessage(event.data);
  worker.onerror=()=>this.fail(t('The local model could not start on this device. Try a current browser with enough free memory.','Lokal model bu cihazda başlaya bilmədi. Kifayət qədər boş yaddaşı olan yeni brauzerdə yoxla.'));
  this.worker=worker;
  return worker;
 },
 send(){
  const question=this.draft.trim();
  if(!question||this.busy)return;
  this.pending=question;this.busy=true;this.error='';this.status=this.answered?'ready':'loading';
  this.progress=t('Loading the local model on first use…','İlk istifadədə lokal model yüklənir…');
  App.render();this.scroll();
  try {this.ensureWorker().postMessage({type:'ask',question,history:this.messages.slice(-6),language:State.lang,subject:courseTitle(activeCourse().id),role:State.registration?.accountType==='teacher'?'teacher':'student'});}
  catch {this.fail(t('Local AI is unavailable in this browser.','Lokal AI bu brauzerdə mövcud deyil.'));}
 },
 onWorkerMessage(data){
  if(data?.type==='progress'){
   const progress=typeof data.percent==='number'?` ${Math.round(data.percent)}%`:'';
   const label=t('Loading the local model','Lokal model yüklənir')+progress+'…';
   if(label!==this.progress){this.progress=label;this.status='loading';if(State.route==='coach')App.render();}
   return;
  }
  if(data?.type==='ready'){this.status='ready';this.progress=t('Answering on your device…','Cihazında cavab hazırlanır…');if(State.route==='coach')App.render();return;}
  if(data?.type==='answer'){
   const answer=typeof data.answer==='string'?data.answer.trim():'';
   if(!answer){this.fail(t('The local model returned no answer. Please try again.','Lokal model cavab vermədi. Yenidən cəhd et.'));return;}
   this.messages.push({role:'user',content:this.pending},{role:'assistant',content:answer,source:data.source==='guide'?'guide':'model'});
   this.draft='';this.pending='';this.busy=false;this.error='';this.status='ready';this.answered=true;this.progress='';
   App.render();this.scroll();document.getElementById('coach-input')?.focus();
   return;
  }
  if(data?.type==='error')this.fail(t('The local model could not answer. Check the first-download connection and device memory, then try again.','Lokal model cavab verə bilmədi. İlk yükləmə bağlantısını və cihaz yaddaşını yoxlayıb yenidən cəhd et.'));
 },
 fail(message){
  this.error=message;this.pending='';this.busy=false;this.status='error';this.progress='';
  this.worker?.terminate();this.worker=null;
  if(State.route==='coach'){App.render();document.getElementById('coach-input')?.focus();}
 },
 scroll(){const list=document.getElementById('coach-messages');if(list)list.scrollTop=list.scrollHeight;},
 render(){
  const suggestions=State.lang==='az'?['Python-da dəyişən nədir?','React komponentini sadə dildə izah et','Bugünkü dərs üçün 20 dəqiqəlik plan qur']:['What is a variable in Python?','Explain a React component simply','Make a 20-minute study plan'];
  const messageHtml=this.messages.map(message=>`<div class="coach-message ${message.role}"><span class="coach-avatar">${message.role==='assistant'?icon('spark'):icon('users')}</span><div><small>${message.role==='assistant'?(message.source==='guide'?t('Course guide · checked example','Dərs bələdçisi · yoxlanmış nümunə'):t('On-device AI answer','Cihazda AI cavabı')):t('You','Sən')}</small><p>${esc(message.content)}</p></div></div>`).join('');
  const stateLabel=this.busy?this.progress||t('Thinking on your device…','Cihazında cavab hazırlanır…'):this.status==='error'?t('Local AI needs a retry','Lokal AI yenidən cəhd tələb edir'):this.answered?t('Answered locally','Lokal cavab verildi'):t('Local AI · ready to load','Lokal AI · yükləməyə hazır');
  return `${heading(t('ON-DEVICE AI · LEARNING SUPPORT','CİHAZDA AI · TƏHSİL DƏSTƏYİ'),t('A study coach you can ask.','Sual verə biləcəyin dərs köməkçisi.'),t('Get a clear explanation, a hint, or a small study plan in your language.','Öz dilində aydın izah, ipucu və ya kiçik dərs planı al.'))}
   <div class="coach-layout"><section class="panel coach-main"><div class="coach-header"><div><span class="coach-symbol">${icon('spark')}</span><div><h2>${t('MindBridge Local AI Coach','MindBridge Lokal AI Köməkçisi')}</h2><p>${t('A small language model runs in your browser.','Kiçik dil modeli brauzerində işləyir.')}</p></div></div><span class="coach-live ${this.answered?'connected':''}">${esc(stateLabel)}</span></div>
   <div class="coach-messages" id="coach-messages" role="log" aria-live="polite">${messageHtml||`<div class="coach-empty">${icon('spark')}<h3>${t('Start with a question.','Bir sualla başla.')}</h3><p>${t('Ask for an explanation, a hint, or a way to practise. The coach will answer here.','İzah, ipucu və ya məşq yolu soruş. Köməkçi burada cavab verəcək.')}</p></div>`}${this.pending?`<div class="coach-message user"><span class="coach-avatar">${icon('users')}</span><div><small>${t('You','Sən')}</small><p>${esc(this.pending)}</p></div></div><div class="coach-thinking"><i></i><i></i><i></i>${esc(this.progress||t('Thinking on your device…','Cihazında cavab hazırlanır…'))}</div>`:''}</div>
   ${this.error?`<div class="notice error coach-error" role="alert">${icon('close')}<span>${esc(this.error)}</span></div>`:''}
   <form id="coach-form" class="coach-form"><label class="sr-only" for="coach-input">${t('Ask the local AI study coach','Lokal AI dərs köməkçisinə sual ver')}</label><textarea id="coach-input" maxlength="800" rows="2" placeholder="${t('Ask about a concept or request a hint…','Mövzu barədə soruş və ya ipucu istə…')}" required>${esc(this.draft)}</textarea><button class="btn primary" type="submit" ${this.busy?'disabled':''}>${icon('send')}${this.busy?t('Thinking…','Düşünür…'):t('Ask AI','AI-dən soruş')}</button></form></section>
   <aside class="coach-aside"><section class="panel"><span class="tiny-tag">${t('TRY A QUESTION','SUAL SINA')}</span><h3>${t('Where should we start?','Haradan başlayaq?')}</h3><div class="coach-prompts">${suggestions.map(prompt=>`<button type="button" data-coach-prompt="${esc(prompt)}" ${this.busy?'disabled':''}>${icon('arrow')}${esc(prompt)}</button>`).join('')}</div></section><section class="panel coach-trust"><span class="tiny-tag">${t('HOW LOCAL AI WORKS','LOKAL AI NECƏ İŞLƏYİR')}</span><p>${t('Checked course examples answer common basics instantly. For other questions, a small model downloads on first use and generates on this device. No API key is needed.','Yoxlanmış dərs nümunələri əsas sualları dərhal cavablandırır. Digər suallarda kiçik model ilk istifadədə yüklənir və cavabı bu cihazda yaradır. API açarı lazım deyil.')}</p><p>${t('Your question and recent chat stay in this browser. The model and runtime files are downloaded from Hugging Face and its CDN.','Sualın və son söhbət bu brauzerdə qalır. Model və işləmə faylları Hugging Face və onun CDN-indən yüklənir.')}</p><p>${t('Small local models can make mistakes, especially in Azerbaijani. Check important answers with your mentor.','Kiçik lokal modellər, xüsusən Azərbaycan dilində səhv edə bilər. Vacib cavabları müəlliminlə yoxla.')}</p><small>${esc(this.model)}</small></section></aside></div>`;
 }
};

document.addEventListener('DOMContentLoaded',()=>MindBridgeCoach.init());
