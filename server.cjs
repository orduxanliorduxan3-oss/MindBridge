'use strict';

const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');

const ROOT=__dirname;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};

function reply(res,status,value){
 const body=JSON.stringify(value);
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
 res.end(body);
}

function safeStaticPath(pathname){
 let decoded;
 try{decoded=decodeURIComponent(pathname);}catch{return null;}
 if(decoded==='/')decoded='/index.html';
 if(!/^\/(?:index\.html|(?:css|js|assets)\/[A-Za-z0-9_./-]+)$/.test(decoded)||decoded.includes('..'))return null;
 const target=path.resolve(ROOT,'.'+decoded);
 return target.startsWith(ROOT+path.sep)?target:null;
}

function createMindBridgeServer(){
 return http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/api/status'&&req.method==='GET')return reply(res,200,{status:'online',service:'MindBridge',ai:'on-device'});
  if(pathname==='/api/ai-status'&&req.method==='GET')return reply(res,200,{mode:'on-device',apiKeyRequired:false,model:'SmolLM2-135M-Instruct'});
  if(req.method!=='GET'&&req.method!=='HEAD')return reply(res,405,{error:'Method not allowed.'});
  const file=safeStaticPath(pathname);
  if(!file)return reply(res,404,{error:'Not found.'});
  try{
   const data=await fs.promises.readFile(file);
   res.writeHead(200,{'Content-Type':MIME[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':data.length,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
   res.end(req.method==='HEAD'?undefined:data);
  }catch{reply(res,404,{error:'Not found.'});}
 });
}

if(require.main===module){
 const port=Number(process.argv[2]||process.env.PORT||process.env.MINDBRIDGE_PORT||5050);
 const host=process.env.MINDBRIDGE_HOST||(process.env.PORT?'0.0.0.0':'127.0.0.1');
 if(!Number.isInteger(port)||port<1||port>65535){console.error('Choose a valid port.');process.exitCode=1;}
 else{
  const server=createMindBridgeServer();
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is in use. Stop the older MindBridge server or choose another port.`:error.message);process.exitCode=1;});
  server.listen(port,host,()=>console.log(`MindBridge ready on ${host}:${port} · local browser AI needs no API key`));
 }
}

module.exports={createMindBridgeServer,safeStaticPath};
