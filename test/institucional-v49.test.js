import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import http from 'node:http';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>readFileSync(join(root,file),'utf8');

test('v4.9: portada usa referencias fotográficas oficiales distintas, no ilustraciones de IA',()=>{
  const h=read('public/portada.html');
  const sources=[...h.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(sources.length,6);
  assert.equal(new Set(sources).size,sources.length);
  assert.ok(sources.every(src=>src.startsWith('https://www.dlorgia.com/')));
  assert.doesNotMatch(h,/src="[^"]+\.svg"/);
  assert.match(h,/Fotografías referenciadas directamente/);
  assert.match(h,/imagen institucional pendiente/i);
});
test('v4.9: cubo de aristas y caras que se iluminan al pasar cursor o tocar',()=>{
  const h=read('public/portada.html'),css=read('public/assets/portada-v49.css'),js=read('public/assets/portada-v49.js');
  assert.match(h,/id="feature-cube"/);
  for(const type of ['orientador','asesor','citas']) assert.match(h,new RegExp(`class="cube-face[^\"]*" data-feature="${type}"`));
  assert.match(css,/background:rgba\(255,255,255,\.015\)/);
  assert.match(css,/\.cube-face\.is-active\{/);
  assert.match(js,/addEventListener\('mouseenter'/);
  assert.match(js,/addEventListener\('focus'/);
  assert.match(js,/addEventListener\('click'/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
test('v4.9: acceso no ofrece invitado y conserva Google y correo',()=>{
  const h=read('public/index.html');
  assert.doesNotMatch(h,/id="guest-entry"/);
  assert.match(h,/id="google-sign-in"/);
  assert.match(h,/id="register-form"/);
  assert.match(h,/href="\/guia"/);
  assert.match(h,/acceso-v49.css/);
});
test('v4.9: guía accesible, sitemap, cache y fotografías integrables',()=>{
  const h=read('public/guia.html'),js=read('public/assets/guia-v49.js'),seo=read('src/services/seo.js'),sw=read('public/service-worker.js');
  assert.match(h,/id="guide-title"/);
  assert.match(h,/href="\/app\?mode=register"/);
  assert.match(js,/aria-current/);
  assert.match(js,/render\(active\+1\)/);
  assert.match(seo,/\/guia/);
  assert.match(sw,/dlorgia-orienta-v490-institucional/);
  for(const asset of ['portada-v49.js','portada-v49.css','guia-v49.js','guia-v49.css','acceso-v49.css']){
    assert.ok(existsSync(join(root,'public/assets',asset)),asset);
    assert.ok(sw.includes(`/assets/${asset}`));
  }
  const importer=read('scripts/instalar-fotos-autorizadas.mjs');
  assert.match(importer,/public\/portada\.html/);
  assert.match(importer,/foto-colormax-manchas/);
});
test('HTTP: portada, guía y acceso independientes', {timeout:18000}, async()=>{
  const s=http.createServer();await new Promise(ok=>s.listen(0,'127.0.0.1',ok));const port=s.address().port;await new Promise(ok=>s.close(ok));
  const host=`http://127.0.0.1:${port}`;
  const child=spawn(process.execPath,['src/server.js'],{cwd:root,stdio:'ignore',env:{...process.env,PORT:String(port),APP_PUBLIC_URL:host,SUPABASE_URL:'',SUPABASE_PUBLISHABLE_KEY:'',SUPABASE_SECRET_KEY:''}});
  try {
    let ready=false;for(let i=0;i<120;i++){try{ready=(await fetch(host+'/health')).ok;if(ready)break}catch{}await new Promise(ok=>setTimeout(ok,50))}assert.ok(ready,'servidor no inició');
    const [landing,guide,app,sitemap]=await Promise.all(['/','/guia','/app','/sitemap.xml'].map(async p=>{const r=await fetch(host+p);assert.equal(r.status,200,p);return r.text()}));
    assert.match(landing,/id="feature-cube"/);
    assert.doesNotMatch(landing,/id="login-form"/);
    assert.match(guide,/id="guide-title"/);
    assert.doesNotMatch(guide,/id="feature-cube"/);
    assert.match(app,/id="login-form"/);
    assert.doesNotMatch(app,/id="guest-entry"/);
    assert.match(sitemap,/<loc>http:\/\/127\.0\.0\.1:\d+\/guia<\/loc>/);
  } finally{child.kill('SIGTERM')}
});
