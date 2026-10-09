import {guideAnswer} from './local-knowledge.js';

const MODEL='onnx-community/SmolLM2-135M-Instruct-ONNX';
let generatorPromise;

function loadModel(){
 if(!generatorPromise){
  generatorPromise=(async()=>{
   const {pipeline}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm');
   return pipeline('text-generation',MODEL,{
    device:'wasm',dtype:'q4',
    progress_callback:event=>{
     if(event.status==='progress'&&typeof event.progress==='number'&&String(event.file||'').endsWith('model_q4.onnx'))postMessage({type:'progress',percent:event.progress});
    }
   });
  })();
 }
 return generatorPromise;
}

onmessage=async event=>{
 const request=event.data;
 if(request?.type!=='ask')return;
 try{
  const guide=guideAnswer(request.question,request.language);
  if(guide){postMessage({type:'answer',answer:guide,source:'guide'});return;}
  const generator=await loadModel();
  postMessage({type:'ready'});
  const language=request.language==='az'?'Azerbaijani':'English';
  const system=`You are a concise, friendly study coach. Answer in ${language}. The subject is ${String(request.subject||'general learning').slice(0,80)}. Explain the idea with a simple example or hint. If unsure, say so. Never claim to see the user's account, whiteboard, or classroom. Keep the answer under 100 words.`;
  const history=Array.isArray(request.history)?request.history.slice(-4).filter(item=>['user','assistant'].includes(item.role)&&typeof item.content==='string').map(item=>({role:item.role,content:item.content.slice(0,500)})):[];
  const messages=[{role:'system',content:system},...history,{role:'user',content:String(request.question||'').slice(0,800)}];
  const result=await generator(messages,{max_new_tokens:100,do_sample:false,repetition_penalty:1.2,no_repeat_ngram_size:4});
  const generated=result?.[0]?.generated_text;
  const answer=Array.isArray(generated)?generated.at(-1)?.content:typeof generated==='string'?generated:'';
  if(typeof answer!=='string'||!answer.trim())throw new Error('Empty local model answer');
  postMessage({type:'answer',answer:answer.trim(),source:'model'});
 }catch(error){postMessage({type:'error',message:String(error?.message||error).slice(0,180)});}
};
