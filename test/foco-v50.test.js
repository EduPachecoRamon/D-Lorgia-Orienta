import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import http from 'node:http';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(join(root,path),'utf8');

test('v5.0 abre la app como inicio y conserva Google y registro',()=>{
 const server=read('src/server.js'), html=read('public/index.html');
 assert.match(server,/pathname === '\/' \? '\/index.html'/);
 assert.match(server,/pathname === '\/portada.html' \? '\/index.html'/);
 assert.match(html,/id="login-form"/);
 assert.match(html,/id="register-form"/);
 assert.match(html,/id="google-sign-in"/);
 assert.match(html,/id="v50-home-primary"/);
 assert.doesNotMatch(html,/id="guest-entry"/);
});

test('v5.0 bienvenida guiada de 3 pasos se muestra una vez por cuenta y se repite desde ajustes',()=>{
 const html=read('public/index.html'),js=read('public/assets/app-v400.js');
 for(const id of ['v50-tour-dialog','v50-tour-next','v50-tour-prev','v50-tour-skip','settings','v50-settings-replay','v50-profile-tour']){
   assert.match(html,new RegExp(`id="${id}"`));
 }
 assert.match(js,/store\.get\('dlorgia:tourSeen:v50'/);
 assert.match(js,/store\.set\('dlorgia:tourSeen:v50'/);
 assert.match(js,/tourScenes\.length/);
 for(const name of ['guide','advisor','evaluation']) assert.match(html,new RegExp(`data-v50-cube="${name}"`));
 assert.match(js,/face.addEventListener\('mouseenter'/);
 assert.match(js,/face.addEventListener\('focus'/);
 assert.match(js,/face.addEventListener\('click'/);
 assert.match(js,/function openSettingsScreen\(\)/);
 assert.match(html,/id="v50-phone-frame"/);
 assert.match(js,/prefers-reduced-motion|renderFramePreference/);
});

test('v5.0 la barra no invade inicio y solo se presenta tras el orientador',()=>{
 const html=read('public/index.html'),js=read('public/assets/app-v400.js'),css=read('public/assets/foco-v50.css');
 assert.match(html,/id="v50-progress-dialog"/);
 assert.match(html,/id="home-plan"/);
 const main=html.slice(html.indexOf('<section class="screen" id="home"'),html.indexOf('<section class="screen" id="guide"'));
 assert.doesNotMatch(main,/id="home-plan"|id="home-continuity"/);
 assert.match(js,/showProgressDialog\(\);/);
 assert.match(js,/if \(!getPersonalGuide\(\)\) return;/);
 assert.match(js,/NO AVANCE CLÍNICO/);
 assert.match(js,/aria-valuenow/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});

test('v5.0 las páginas indexables son informativas, no el inicio privado',()=>{
 const seo=read('src/services/seo.js');
 assert.doesNotMatch(seo,/\s'\/':\s*\{/);
 assert.match(seo,/\/guia/);
 const sw=read('public/service-worker.js');
 assert.match(sw,/dlorgia-orienta-v540-recorrido/);
 assert.match(sw,/\/assets\/foco-v50.css/);
});

test('HTTP v5.0 / abre la app; /guia sigue disponible y /health funciona',{timeout:16000},async()=>{
 const srv=http.createServer();await new Promise(ok=>srv.listen(0,'127.0.0.1',ok));const port=srv.address().port;await new Promise(ok=>srv.close(ok));
 const base=`http://127.0.0.1:${port}`;
 const child=spawn(process.execPath,['src/server.js'],{cwd:root,stdio:'ignore',env:{...process.env,PORT:String(port),SUPABASE_URL:'',SUPABASE_PUBLISHABLE_KEY:'',SUPABASE_SECRET_KEY:'',APP_PUBLIC_URL:base}});
 try{
  let healthy=false;
  for(let i=0;i<90;i++){try{healthy=(await fetch(base+'/health')).ok;if(healthy)break}catch{}await new Promise(ok=>setTimeout(ok,75));}
  assert.ok(healthy);
  const home=await (await fetch(base+'/')).text();
  assert.match(home,/id="login-form"/);assert.match(home,/id="v50-tour-dialog"/);
  const first=await (await fetch(base+'/app')).text();assert.match(first,/id="v50-home-primary"/);
  const old=await (await fetch(base+'/portada.html')).text();assert.match(old,/id="login-form"/);
  const guide=await fetch(base+'/guia');assert.equal(guide.status,200);
  const css=await fetch(base+'/assets/foco-v50.css');assert.equal(css.status,200);
  const sitemap=await(await fetch(base+'/sitemap.xml')).text();assert.doesNotMatch(sitemap,/<loc>[^<]+:\/\/[^<]+\/<\/loc>/);
 }finally{child.kill('SIGTERM')}
});
