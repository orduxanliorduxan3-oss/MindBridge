'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createMindBridgeServer,safeStaticPath}=require('../server.cjs');

async function withServer(run){
 const server=createMindBridgeServer();
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 try{return await run(`http://127.0.0.1:${server.address().port}`);}
 finally{await new Promise(resolve=>server.close(resolve));}
}

test('server reports keyless on-device AI mode',async()=>withServer(async base=>{
 const status=await (await fetch(`${base}/api/ai-status`)).json();
 assert.equal(status.mode,'on-device');
 assert.equal(status.apiKeyRequired,false);
}));

test('local AI worker and guide files are served as JavaScript',async()=>withServer(async base=>{
 for(const name of ['js/local-ai-worker.js','js/local-knowledge.js']){
  const response=await fetch(`${base}/${name}`);
  assert.equal(response.status,200);
  assert.match(response.headers.get('content-type'),/javascript/);
 }
}));

test('private files and cloud chat endpoint are unavailable',async()=>withServer(async base=>{
 assert.equal(safeStaticPath('/.env'),null);
 assert.equal((await fetch(`${base}/.env`)).status,404);
 assert.equal((await fetch(`${base}/api/chat`,{method:'POST'})).status,405);
 assert.equal((await fetch(`${base}/data/state.json`)).status,404);
}));
