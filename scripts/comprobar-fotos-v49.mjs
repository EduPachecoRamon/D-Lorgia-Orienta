/** Comprueba enlaces referenciados de fotos públicas; NO guarda ni descarga archivos. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=await fs.readFile(path.join(root,'public/portada.html'),'utf8');
const urls=[...new Set([...html.matchAll(/<img\b[^>]*\bsrc="(https:\/\/www\.dlorgia\.com\/[^"]+)"/g)].map(m=>m[1]))];
if(!urls.length){console.error('No encontré fotografías enlazadas en la portada.');process.exitCode=1;}
for(const url of urls){
 try {
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),9000);
  const response=await fetch(url,{method:'HEAD',signal:controller.signal}).catch(async()=>fetch(url,{method:'GET',signal:controller.signal}));
  clearTimeout(timeout);
  const type=response.headers.get('content-type')||'desconocido';
  const ok=response.ok&&type.startsWith('image/');
  console.log((ok?'OK  ':'AVISO'),response.status,type,url);
  if(!ok)process.exitCode=1;
 } catch(e){console.warn('AVISO: sin respuesta',url,String(e.message||e));process.exitCode=1;}
}
