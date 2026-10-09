'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createMindBridgeServer,validateChat,outputText,safeStaticPath,sameOrigin}=require('../server.cjs');

async function withServer(options,run){
 const server=createMindBridgeServer(options);
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 try{return await run(`http://127.0.0.1:${server.address().port}`);}
 finally{await new Promise(resolve=>server.close(resolve));}
}

test('AI status is honest when no key is configured',async()=>withServer({apiKey:''},async base=>{
 const status=await (await fetch(`${base}/api/ai-status`)).json();
 assert.equal(status.configured,false);
 const reply=await fetch(`${base}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Hello'})});
 assert.equal(reply.status,503);
}));

test('chat sends a bounded stateless request and returns the model answer',async()=>{
 let sent;
 const fetchImpl=async(url,options)=>{sent={url,options};return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:'A variable stores a value.'}]}}]})};};
 await withServer({apiKey:'test-key',model:'gemini-3.5-flash-lite',fetchImpl},async base=>{
  const response=await fetch(`${base}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'What is a variable?',language:'az',subject:'AI & Python',role:'student',history:[{role:'user',content:'Teach me Python.'}]})});
  assert.equal(response.status,200);
  assert.equal((await response.json()).answer,'A variable stores a value.');
 });
 assert.equal(sent.url,'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent');
 assert.equal(sent.options.headers['x-goog-api-key'],'test-key');
 const payload=JSON.parse(sent.options.body);
 assert.equal(payload.contents.length,2);
 assert.equal(payload.contents[0].role,'user');
 assert.match(payload.systemInstruction.parts[0].text,/Azerbaijani/);
 assert.doesNotMatch(sent.options.body,/test-key/);
});

test('invalid messages and private server files are rejected',async()=>{
 assert.throws(()=>validateChat({message:'x'.repeat(801)}),/under 800/);
 assert.equal(outputText({candidates:[{content:{parts:[{text:'Hello'}]}}]}),'Hello');
 assert.equal(safeStaticPath('/data/state.json'),null);
 await withServer({apiKey:'test-key',fetchImpl:async()=>{throw new Error('should not call model');}},async base=>{
  const bad=await fetch(`${base}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:''})});
  assert.equal(bad.status,400);
  const hidden=await fetch(`${base}/data/state.json`);
  assert.equal(hidden.status,404);
  const secret=await fetch(`${base}/.env`);
  assert.equal(secret.status,404);
 });
});

test('a denied Gemini project produces a clear chat error',async()=>{
 await withServer({apiKey:'test-key',fetchImpl:async()=>({ok:false,status:403})},async base=>{
  const response=await fetch(`${base}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Help me study.'})});
  assert.equal(response.status,503);
  assert.match((await response.json()).error,/project cannot generate answers/i);
 });
});

test('chat rejects requests from another webpage origin',async()=>{
 await withServer({apiKey:'test-key',fetchImpl:async()=>{throw new Error('wrong origin reached model');}},async base=>{
  const response=await fetch(`${base}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json','Origin':'https://another.example'},body:JSON.stringify({message:'Hi'})});
  assert.equal(response.status,403);
 });
});

test('hosted HTTPS pages can call their own AI backend',()=>{
 assert.equal(sameOrigin({headers:{host:'mindbridge.example',origin:'https://mindbridge.example'}}),true);
 assert.equal(sameOrigin({headers:{host:'mindbridge.example',origin:'https://other.example'}}),false);
 assert.equal(sameOrigin({headers:{host:'mindbridge.example',origin:'file://mindbridge.example'}}),false);
});
