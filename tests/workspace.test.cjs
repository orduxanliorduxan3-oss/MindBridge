const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
function app(){
 const storage=new Map(),elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',disabled:false,style:{},classList:{contains:()=>false},focus(){},scrollIntoView(){}});return elements.get(id);};
 const context=vm.createContext({console,Date,Intl,URL,Blob,crypto:require('node:crypto').webcrypto,setTimeout,clearTimeout,
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  document:{addEventListener(){},getElementById:element,querySelector:()=>null,querySelectorAll:()=>[],body:{classList:{contains:()=>false}}},
  window:{innerWidth:1440},location:{hash:'#home'},history:{pushState(){},replaceState(){}}
 });
 for(const file of ['data.js','whiteboard.js','workspace.js'])vm.runInContext(fs.readFileSync(path.join(root,'js',file),'utf8'),context,{filename:file});
 return {run:s=>vm.runInContext(s,context),elements,storage};
}
test('all screens render in both languages without runtime errors',()=>{
 const {run}=app();for(const lang of ['en','az'])for(const route of ['home','courses','matchmaker','classroom','assessments','certificate','checkout','register','parent-panel']){
  run(`State.lang='${lang}';State.route='${route}'`);const html=run('App.page()');assert.match(html,/<h1/);assert.doesNotMatch(html,/undefined|NaN/);
 }
});
test('Azerbaijani dates do not depend on browser locale support',()=>{const {run}=app();assert.equal(run("State.lang='az';formatDate('2026-10-08T12:00:00Z')"),'8 oktyabr 2026');});
test('course categories and search combine without duplicating courses',()=>{const {run}=app();assert.equal(run("State.category='web';App.filteredCourses().length"),1);assert.equal(run("State.search='Leyla';App.filteredCourses().length"),1);assert.equal(run("State.search='nonexistent';App.filteredCourses().length"),0);});
test('certificate verifier rejects look-alike IDs but accepts exact sample',()=>{
 const {run}=app();run("State.verifyQuery='MB-CERT-FAKE-8941';App.onSubmit({target:{id:'verify-form'},preventDefault(){}})");assert.equal(run('State.verifyStatus'),false);
 run("State.verifyQuery='  mb-cert-2026-8941 ';App.onSubmit({target:{id:'verify-form'},preventDefault(){}})");assert.equal(run('State.verifyStatus'),'sample');
});
test('earned certificate verification matches the stored full serial',()=>{const {run}=app();run("State.certificate={serial:'MB-CERT-2026-ABCDEF12',name:'Test',score:100};State.verifyQuery=State.certificate.serial;App.onSubmit({target:{id:'verify-form'},preventDefault(){}})");assert.equal(run('State.verifyStatus'),'earned');});
test('certificate recipient and chat content are escaped',()=>{const {run}=app();run(`State.certificate={serial:'TEST',name:'<img src=x onerror=alert(1)>',date:'2026-10-08',score:100};State.messages.push({me:true,text:'<script>alert(1)</script>',time:'12:00'})`);assert.match(run('App.certificate()'),/&lt;img/);assert.doesNotMatch(run('App.chatMessages()'),/<script>/);});
test('unfinished quiz cannot be submitted',()=>{const {run}=app();run('App.toast=()=>{};App.render=()=>{};App.submitAssessment()');assert.equal(run('State.scores.quiz'),null);assert.equal(run('State.submitted.quiz'),false);});
test('final pass alone cannot issue a certificate',()=>{const {run}=app();run("App.toast=()=>{};App.render=()=>{};State.tab='exam';State.answers.exam={0:0,1:0,2:1,3:0};App.submitAssessment()");assert.equal(run('State.scores.exam'),100);assert.equal(run('State.certificate'),null);});
test('completed pathway creates a persisted certificate and clears stale verification',()=>{const {run,storage}=app();run("App.toast=()=>{};App.render=()=>{};App.navigateTo=r=>State.route=r;State.tab='exam';State.answers.exam={0:0,1:0,2:1,3:0};State.scores.quiz=100;State.scores.practical=100;State.verifyStatus='sample';App.submitAssessment()");assert.equal(run('State.route'),'certificate');assert.equal(run('State.certificate.score'),100);assert.equal(run('State.verifyStatus'),null);assert.ok(storage.has('mb_certificate_v2'));});
test('whiteboard clear is undoable and redo restores it',()=>{const {run}=app();run("Whiteboard.strokes=[{tool:'pen',points:[{x:.2,y:.3}],width:3,color:'#7055df'}];Whiteboard.clear()");assert.equal(run('Whiteboard.strokes.length'),2);run('Whiteboard.undo()');assert.equal(run('Whiteboard.strokes.length'),1);run('Whiteboard.redo()');assert.equal(run('Whiteboard.strokes[1].tool'),'clear');});
test('whiteboard resizing preserves vector data',()=>{const {run}=app();run("Whiteboard.strokes=[{tool:'pen',points:[{x:.2,y:.3}],width:3,color:'#7055df'}];Whiteboard.canvas={parentElement:{getBoundingClientRect:()=>({width:900,height:400})}};Whiteboard.paint=()=>{};Whiteboard.resize()");assert.equal(run('Whiteboard.canvas.width'),900);assert.equal(run('Whiteboard.strokes[0].points[0].x'),.2);});
test('unmounting the board commits an in-flight stroke',()=>{const {run}=app();run("Whiteboard.current={tool:'pen',points:[{x:.1,y:.2}],width:3,color:'#7055df'};Whiteboard.unmount()");assert.equal(run('Whiteboard.strokes.length'),1);assert.equal(run('Whiteboard.current'),null);});
test('registration classifies a learner as student and persists the profile',()=>{const {run,storage}=app();run("App.toast=()=>{};App.navigateTo=route=>State.route=route;const form={id:'registration-form'};const data=new Map([['fullName','Aysel Məmmədova'],['email','aysel@example.com'],['accountType','student'],['subject','c1'],['experience','beginner']]);globalThis.FormData=class {get(key){return data.get(key)}};App.onSubmit({target:form,preventDefault(){}})");assert.equal(run('State.registration.accountType'),'student');assert.equal(run('State.role'),'adult');assert.equal(run('State.route'),'home');assert.ok(storage.has('mb_registration_v1'));});
test('registration classifies a teacher as mentor',()=>{const {run}=app();run("App.toast=()=>{};App.navigateTo=route=>State.route=route;const form={id:'registration-form'};const data=new Map([['fullName','Nigar Əliyeva'],['email','nigar@example.com'],['accountType','teacher'],['subject','c2'],['experience','advanced']]);globalThis.FormData=class {get(key){return data.get(key)}};App.onSubmit({target:form,preventDefault(){}})");assert.equal(run('State.registration.accountType'),'teacher');assert.equal(run('State.role'),'mentor');assert.equal(run('State.route'),'classroom');});
test('payment requires registration and persists a simulated receipt',()=>{const {run,storage}=app();run("App.toast=()=>{};App.render=()=>{};App.navigateTo=route=>State.route=route;const form={id:'payment-form'};const data=new Map([['plan','monthly'],['method','demo-card']]);globalThis.FormData=class {get(key){return data.get(key)}};State.registration={name:'Aysel',accountType:'student'};App.onSubmit({target:form,preventDefault(){}})");assert.equal(run('State.payment.amount'),39);assert.equal(run('State.payment.method'),'demo-card');assert.ok(storage.has('mb_payment_v1'));});
test('payment redirects unregistered users to registration',()=>{const {run}=app();run("App.toast=()=>{};App.navigateTo=route=>State.route=route;State.registration=null;App.onSubmit({target:{id:'payment-form'},preventDefault(){}})");assert.equal(run('State.route'),'register');});
test('unregistered deep links are redirected to the welcome gate',()=>{const {run}=app();run("State.registration=null;location.hash='#classroom';App.render=()=>{};App.routeFromHash()");assert.equal(run('State.route'),'welcome');});


