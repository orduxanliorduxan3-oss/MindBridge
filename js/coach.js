'use strict';

const MindBridgeCoach={
 status:'checking',model:null,messages:[],draft:'',pending:'',busy:false,error:'',answered:false,
 init(){
  document.addEventListener('submit',event=>{if(event.target.id==='coach-form'){event.preventDefault();this.send();}});
  document.addEventListener('input',event=>{if(event.target.id==='coach-input')this.draft=event.target.value;});
  document.addEventListener('click',event=>{const button=event.target.closest('[data-coach-prompt]');if(button){this.draft=button.dataset.coachPrompt;this.send();}});
  this.check();
 },
 async check(){
  try {const response=await fetch('/api/ai-status',{cache:'no-store'});const data=await response.json();this.status=response.ok&&data.configured?'ready':'offline';this.model=data.model||null;}
  catch {this.status='offline';this.model=null;}
  if(State.route==='coach')App.render();
 },
 async send(){
  const question=this.draft.trim();
  if(!question||this.busy||this.status!=='ready')return;
  const history=this.messages.slice(-8).map(({role,content})=>({role,content}));
  this.pending=question;this.busy=true;this.error='';App.render();this.scroll();
  try {
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question,history,language:State.lang,subject:courseTitle(activeCourse().id),role:State.registration?.accountType==='teacher'?'teacher':'student'})});
   const data=await response.json();
   if(!response.ok||typeof data.answer!=='string'||!data.answer.trim())throw new Error(data.error||t('AI could not answer right now.','AI hazırda cavab verə bilmir.'));
   this.messages.push({role:'user',content:question},{role:'assistant',content:data.answer.trim()});
   this.draft='';this.model=data.model||this.model;this.answered=true;
  } catch(error){this.error=error.message||t('Connection failed. Please try again.','Bağlantı alınmadı. Yenidən cəhd et.');}
  finally {this.pending='';this.busy=false;App.render();this.scroll();document.getElementById('coach-input')?.focus();}
 },
 scroll(){const list=document.getElementById('coach-messages');if(list)list.scrollTop=list.scrollHeight;},
 render(){
  const connected=this.status==='ready';
  const suggestions=State.lang==='az'?['Python-da dəyişən nədir?','React komponentini sadə dildə izah et','Bugünkü dərs üçün 20 dəqiqəlik plan qur']:['What is a variable in Python?','Explain a React component simply','Make a 20-minute study plan'];
  const messageHtml=this.messages.map(message=>`<div class="coach-message ${message.role}"><span class="coach-avatar">${message.role==='assistant'?icon('spark'):icon('users')}</span><div><small>${message.role==='assistant'?t('AI study coach','AI dərs köməkçisi'):t('You','Sən')}</small><p>${esc(message.content)}</p></div></div>`).join('');
  return `${heading(t('REAL AI · LEARNING SUPPORT','REAL AI · TƏHSİL DƏSTƏYİ'),t('A study coach you can ask.','Sual verə biləcəyin dərs köməkçisi.'),t('Get a clear explanation, a hint, or a small study plan in your language.','Öz dilində aydın izah, ipucu və ya kiçik dərs planı al.'))}
   <div class="coach-layout"><section class="panel coach-main"><div class="coach-header"><div><span class="coach-symbol">${icon('spark')}</span><div><h2>${t('MindBridge AI Coach','MindBridge AI Köməkçisi')}</h2><p>${t('A real model response, tailored to your current subject.','Cari fənninə uyğun real model cavabı.')}</p></div></div><span class="coach-live ${connected?'connected':''}">${connected?(this.answered?t('AI answered live','AI canlı cavab verdi'):t('AI ready to try','AI sınağa hazırdır')):this.status==='checking'?t('Checking connection…','Bağlantı yoxlanılır…'):t('AI not connected','AI qoşulmayıb')}</span></div>
   <div class="coach-messages" id="coach-messages" role="log" aria-live="polite">${messageHtml||`<div class="coach-empty">${icon('spark')}<h3>${t('Start with a question.','Bir sualla başla.')}</h3><p>${t('Ask for an explanation, a hint, or a way to practise. The coach will answer here.','İzah, ipucu və ya məşq yolu soruş. Köməkçi burada cavab verəcək.')}</p></div>`}${this.pending?`<div class="coach-message user"><span class="coach-avatar">${icon('users')}</span><div><small>${t('You','Sən')}</small><p>${esc(this.pending)}</p></div></div><div class="coach-thinking"><i></i><i></i><i></i>${t('Thinking through your question…','Sualın üzərində düşünür…')}</div>`:''}</div>
   ${this.error?`<div class="notice error coach-error" role="alert">${icon('close')}<span>${esc(this.error)}</span></div>`:''}
   <form id="coach-form" class="coach-form"><label class="sr-only" for="coach-input">${t('Ask the AI study coach','AI dərs köməkçisinə sual ver')}</label><textarea id="coach-input" maxlength="800" rows="2" placeholder="${t('Ask about a concept or request a hint…','Mövzu barədə soruş və ya ipucu istə…')}" ${connected?'':'disabled'} required>${esc(this.draft)}</textarea><button class="btn primary" type="submit" ${connected&&!this.busy?'':'disabled'}>${icon('send')}${this.busy?t('Thinking…','Düşünür…'):t('Ask AI','AI-dən soruş')}</button></form></section>
   <aside class="coach-aside"><section class="panel"><span class="tiny-tag">${t('TRY A QUESTION','SUAL SINA')}</span><h3>${t('Where should we start?','Haradan başlayaq?')}</h3><div class="coach-prompts">${suggestions.map(prompt=>`<button type="button" data-coach-prompt="${esc(prompt)}" ${connected&&!this.busy?'':'disabled'}>${icon('arrow')}${esc(prompt)}</button>`).join('')}</div></section><section class="panel coach-trust"><span class="tiny-tag">${t('CLEAR ABOUT THE AI','AI HAQQINDA AÇIQ')}</span><p>${connected?t('Questions are sent to Gemini when you ask. Live answers are available when the service accepts this key.','Suallar soruşduğun zaman Gemini-yə göndərilir. Xidmət bu açarı qəbul etdikdə canlı cavablar mümkündür.'):t('The AI service needs to be enabled by the project team before live answers are available.','Real cavablar üçün layihə komandası AI xidmətini aktivləşdirməlidir.')}</p><p>${t('Your question, recent chat, subject, role, and language are sent to Google Gemini. Your saved name and email are not included.','Sualın, son söhbət, fənn, rol və dil Google Gemini-yə göndərilir. Saxlanmış adın və e-poçtun daxil edilmir.')}</p><p>${t('The coach cannot see the whiteboard or live classroom. Check important answers with your mentor.','Köməkçi lövhəni və canlı sinfi görə bilmir. Vacib cavabları müəlliminlə yoxla.')}</p>${this.model?`<small>${esc(this.model)}</small>`:''}</section></aside></div>`;
 }
};

document.addEventListener('DOMContentLoaded',()=>MindBridgeCoach.init());
