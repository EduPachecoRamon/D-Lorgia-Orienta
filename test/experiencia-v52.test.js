import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import http from 'node:http';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root,p),'utf8');

test('v5.2 Inicio permite seleccionar tema y mantiene una sola acción prioritaria', () => {
 const html=read('public/index.html'),js=read('public/assets/app-v400.js');
 assert.match(html,/id="v52-topic-pick"/);
 assert.match(html,/href="\/assets\/experiencia-v52\.css"/);
 for(const area of ['Piel','Corporal','Capilar','Todas']) assert.match(html,new RegExp(`data-v52-topic="${area}"`));
 assert.match(js,/guideDraft\.area = selectedHomeArea/);
 assert.match(js,/guideStep = 1/);
 assert.match(html,/id="v50-home-primary"/);
 assert.match(js,/getPersonalGuide\(\)\) \{ guideStep = 'result'/);
 assert.doesNotMatch(html,/v51-branch-strip/);
});

test('v5.2 bienvenida usa fotos distintas y conserva el cubo, navegación y accesibilidad', () => {
 const html=read('public/index.html'),js=read('public/assets/app-v400.js'),css=read('public/assets/experiencia-v52.css');
 for(const file of ['huancayo-sala-01.webp','facial-cosmetologia.webp','huancayo-consultorio-01.webp']) {
   assert.match(js,new RegExp(file.replace('.','\\.')));
   assert.ok(existsSync(join(root,'public/assets/fotos-dlorgia',file)));
 }
 assert.match(html,/id="v52-tour-photo-label"/);
 assert.match(html,/data-v50-cube="guide"/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(js,/scenePhoto\.src =/);
 assert.match(html,/id="v50-tour-skip"/);
});

test('v5.2 Orientador destaca un primer camino sin prometer diagnóstico',()=>{
 const js=read('public/assets/app-v400.js'),css=read('public/assets/experiencia-v52.css');
 assert.match(js,/v52-featured-match/);
 assert.match(js,/v52-secondary-match/);
 assert.match(js,/<details class="v51-match-more">/);
 assert.match(js,/Las demás siguen aquí/);
 assert.match(js,/no recomendaciones clínicas/);
 assert.match(js,/La solicitud de evaluación no equivale a una cita confirmada/);
 assert.match(css,/v52-result-matches/);
});

test('v5.2 catálogo usa fotos locales distintas y etiquetas honestas',()=>{
 const image=read('public/assets/dlorgia-imagery46.js'),app=read('public/assets/app-v400.js'),html=read('public/index.html');
 const fileNames=['facial-cosmetologia','huancayo-consultorio-02','piel-marcas-acne','manchas-piel-referencia','equipo-tecnologia-corporal','consulta-capilar','depilacion-pierna','eliminacion-tatuaje'];
 for(const file of fileNames){assert.match(image,new RegExp(file));assert.ok(existsSync(join(root,'public/assets/fotos-dlorgia',file+'.webp')));}
 assert.match(image,/export function treatmentPhotoInfo/);
 assert.match(app,/const visual = treatmentPhotoInfo\(x\)/);
 assert.match(app,/v52-photo-caption/);
 assert.match(html,/v52-catalog-intro/);
 assert.doesNotMatch(app,/const usedCatalogPhotos = new Set\(\)/);
});

test('v5.2 actualiza la PWA con imágenes y hojas que realmente existen',()=>{
 const sw=read('public/service-worker.js');
 assert.match(sw,/dlorgia-orienta-v540-recorrido/);
 assert.match(sw,/\/assets\/experiencia-v52\.css/);
 const core=sw.match(/const CORE = \[([\s\S]*?)\];/);
 assert.ok(core);
 for(const m of core[1].matchAll(/'([^']+)'/g)){
  const path=m[1]; if(path.startsWith('/assets/') || path==='/manifest.webmanifest') assert.ok(existsSync(join(root,'public',path.slice(1))),path);
 }
});

test('v5.2 HTTP publica /app y CSS, y mantiene /health', {timeout:20000}, async()=>{
 const sock=http.createServer();await new Promise(ok=>sock.listen(0,'127.0.0.1',ok));const port=sock.address().port;await new Promise(ok=>sock.close(ok));
 const base=`http://127.0.0.1:${port}`;
 const child=spawn(process.execPath,['src/server.js'],{cwd:root,stdio:'ignore',env:{...process.env,PORT:String(port),SUPABASE_URL:'',SUPABASE_PUBLISHABLE_KEY:'',SUPABASE_SECRET_KEY:'',APP_PUBLIC_URL:base}});
 try{
  let up=false;for(let i=0;i<120;i++){try{up=(await fetch(base+'/health')).ok;if(up)break}catch{}await new Promise(ok=>setTimeout(ok,75));}assert.ok(up);
  const res=await fetch(base+'/app');assert.equal(res.status,200);
  assert.match(await res.text(),/v52-topic-pick/);
  const css=await fetch(base+'/assets/experiencia-v52.css');assert.equal(css.status,200);
  const image=await fetch(base+'/assets/fotos-dlorgia/manchas-piel-referencia.webp');assert.equal(image.status,200);
  assert.ok((await image.arrayBuffer()).byteLength>2000);
 }finally{child.kill('SIGTERM');}
});
