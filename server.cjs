'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const MIME = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
const MAX_BODY = 16 * 1024;
const MAX_MESSAGE = 800;

function reply(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(body);
}

async function readJson(req) {
  let text = '';
  for await (const part of req) {
    text += part.toString('utf8');
    if (Buffer.byteLength(text) > MAX_BODY) throw Object.assign(new Error('Request is too large.'), {status:413});
  }
  try { return JSON.parse(text); }
  catch { throw Object.assign(new Error('Invalid JSON.'), {status:400}); }
}

function validateChat(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw Object.assign(new Error('Invalid chat request.'), {status:400});
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > MAX_MESSAGE) throw Object.assign(new Error('Please send a question under 800 characters.'), {status:400});
  const language = body.language === 'az' ? 'az' : 'en';
  const role = body.role === 'teacher' ? 'teacher' : 'student';
  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 100) : '';
  const history = Array.isArray(body.history) ? body.history.slice(-8).filter(item => item && ['user','assistant'].includes(item.role) && typeof item.content === 'string' && item.content.length <= MAX_MESSAGE).map(item => ({role:item.role,content:item.content})) : [];
  return {message, language, role, subject, history};
}

function instructions({language, role, subject}) {
  return [
    'You are MindBridge AI Study Coach, a warm, concise educational tutor for a small-group learning prototype.',
    `Reply in ${language === 'az' ? 'Azerbaijani' : 'English'}.`,
    `The user is a ${role}. Current subject: ${subject || 'general learning'}.`,
    'Help the learner understand concepts with one clear explanation, a small example, and a useful next question when appropriate.',
    'For homework or assessment questions, guide the reasoning and give hints before providing a complete solution.',
    'Do not claim to see the whiteboard, camera, lesson progress, account, or live mentor messages. You only know this chat and the supplied subject.',
    'Do not ask for names, contact details, passwords, payment details, or other private information.',
    'If the question requires professional medical, legal, or financial advice, encourage a qualified professional.',
    'Keep most answers under 180 words. Plain text only.'
  ].join('\n');
}

function outputText(data) {
  return (Array.isArray(data?.candidates) ? data.candidates : [])
    .flatMap(candidate => Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [])
    .filter(part => typeof part.text === 'string')
    .map(part => part.text).join('\n').trim();
}

async function askModel(chat, {apiKey, model, fetchImpl}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method:'POST',
      headers:{'x-goog-api-key':apiKey,'Content-Type':'application/json'},
      body:JSON.stringify({
        systemInstruction:{parts:[{text:instructions(chat)}]},
        contents:[...chat.history.map(item=>({role:item.role==='assistant'?'model':'user',parts:[{text:item.content}]})),{role:'user',parts:[{text:chat.message}]}],
        generationConfig:{maxOutputTokens:700,temperature:0.6}
      }),
      signal:controller.signal
    });
    if (!response.ok) throw Object.assign(new Error(response.status === 429 ? 'AI is busy. Please try again shortly.' : response.status === 401 ? 'Gemini rejected the server key.' : response.status === 403 ? 'This Gemini project cannot generate answers. Ask the project owner to restore access or use another key.' : 'AI service is temporarily unavailable.'), {status:503});
    const data = await response.json();
    const answer = outputText(data);
    if (!answer) throw Object.assign(new Error('The AI returned no answer. Please try again.'), {status:502});
    return answer;
  } finally { clearTimeout(timeout); }
}

function safeStaticPath(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  if (decoded === '/') decoded = '/index.html';
  if (!/^\/(?:index\.html|(?:css|js|assets)\/[A-Za-z0-9_./-]+)$/.test(decoded) || decoded.includes('..')) return null;
  const target = path.resolve(ROOT, '.' + decoded);
  return target.startsWith(ROOT + path.sep) ? target : null;
}

function createMindBridgeServer({apiKey=process.env.GEMINI_API_KEY || 'AQ.Ab8RN6IVmCPZs0mFqbCrP56L5MclZrVn1rD-GA87d0QnR4BGiA',model=MODEL,fetchImpl=fetch,rateLimit=12}={}) {
  const attempts = new Map();
  return http.createServer(async (req,res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/api/status' && req.method === 'GET') return reply(res,200,{status:'online',service:'MindBridge'});
    if (pathname === '/api/ai-status' && req.method === 'GET') return reply(res,200,{configured:!!apiKey,model:apiKey?model:null});
    if (pathname === '/api/chat') {
      if (req.method !== 'POST') return reply(res,405,{error:'Method not allowed.'});
      if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) return reply(res,403,{error:'Chat requests must come from this MindBridge page.'});
      if (!apiKey) return reply(res,503,{error:'AI is not connected on this server.'});
      const now = Date.now(),address=req.socket.remoteAddress || 'local';
      const recent = (attempts.get(address)||[]).filter(time => now-time<60000);
      if (recent.length >= rateLimit) return reply(res,429,{error:'Please wait a moment before asking again.'});
      recent.push(now);attempts.set(address,recent);
      try {
        const chat = validateChat(await readJson(req));
        const answer = await askModel(chat,{apiKey,model,fetchImpl});
        return reply(res,200,{answer,model});
      } catch (error) {
        return reply(res,error.status||502,{error:error.status?error.message:'AI could not answer right now. Please try again.'});
      }
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return reply(res,405,{error:'Method not allowed.'});
    const file = safeStaticPath(pathname);
    if (!file) return reply(res,404,{error:'Not found.'});
    try {
      const data = await fs.promises.readFile(file);
      res.writeHead(200,{'Content-Type':MIME[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':data.length,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { reply(res,404,{error:'Not found.'}); }
  });
}

if (require.main === module) {
  const port = Number(process.argv[2] || process.env.MINDBRIDGE_PORT || 5050);
  if (!Number.isInteger(port) || port < 1 || port > 65535) { console.error('Choose a valid port.'); process.exitCode=1; }
  else {
    const server = createMindBridgeServer();
    server.on('error',error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Stop the older MindBridge server or choose another port.` : error.message); process.exitCode=1; });
    server.listen(port,'127.0.0.1',() => console.log(`MindBridge ready at http://127.0.0.1:${port}/ · AI ${process.env.GEMINI_API_KEY?'configured':'needs GEMINI_API_KEY'}`));
  }
}

module.exports={createMindBridgeServer,validateChat,instructions,outputText,safeStaticPath};
