import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import http from 'node:http';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>readFileSync(join(root,file),'utf8');

test('v5.3: Configuración tiene pantalla propia, cinco secciones funcionales y salida',()=>{
 const html=read('public/index.html'),js=read('public/assets/app-v400.js');
 assert.match(html,/id="settings"/);
 assert.doesNotMatch(html,/id="v50-settings-dialog"/);
 for(const section of ['experience','appearance','accessibility','help','privacy']){
  assert.match(html,new RegExp(`data-v53-settings-pane="${section}"`));
  assert.match(html,new RegExp(`data-v53-settings-tab="${section}"`));
 }
 assert.match(js,/function openSettingsScreen\(\)/);
 assert.match(js,/show\('settings'\)/);
 assert.match(js,/settingsReturnScreen/);
 assert.match(js,/button\.addEventListener\('click', \(\) => setSettingsTab/);
});

test('v5.3: las nubes son opcionales, persistentes y cumplen accesibilidad',()=>{
 const html=read('public/index.html'),css=read('public/assets/config-retro-v53.css'),js=read('public/assets/app-v400.js');
 for(const id of ['v53-clouds','v53-background-motion','v53-large-text','v53-high-contrast','v53-reduce-motion']) assert.match(html,new RegExp(`id="${id}"`));
 assert.match(css,/@keyframes v53-cloud-travel/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/body\.dlorgia-motion-paused/);
 assert.match(css,/@media\(max-width:780px\)/);
 assert.match(js,/V53_CLOUD_KEY/);
 assert.match(js,/rawStore\.set\(V53_MOTION_KEY/);
 assert.match(js,/applyA11yPrefs\(next\)/);
});

test('v5.3: el recorte de manchas no tiene flyer ni promesas de resultados',()=>{
 const image=read('public/assets/dlorgia-imagery46.js');
 assert.match(image,/spots: \{ file:'manchas-piel-referencia\.webp'/);
 assert.doesNotMatch(image,/spots: \{ file:'ficha-melasma\.webp'/);
 const photo=readFileSync(join(root,'public/assets/fotos-dlorgia/manchas-piel-referencia.webp'));
 assert.equal(photo.subarray(0,4).toString(),'RIFF');
 assert.ok(photo.byteLength>3000);
 assert.match(image,/Imagen educativa/);
});

test('v5.3: la sede se ofrece después de los siguientes pasos y no interrumpe la orientación',()=>{
 const html=read('public/index.html');
 const home=html.slice(html.indexOf('<section class="screen" id="home"'),html.indexOf('<section class="screen" id="guide"'));
 assert.ok(home.indexOf('v50-home-next')<home.indexOf('v52-branch-postcard'));
 assert.equal((html.match(/class="auth-brand-v48"/g)||[]).length,1);
});

test('v5.3: reinicio de datos elimina también perfil local y evaluación, no las credenciales',()=>{
 const js=read('public/assets/app-v400.js');
 const index=js.slice(js.indexOf('const USER_SCOPED_KEYS'),js.indexOf('let activeIdentity'));
 for(const key of ['dlorgia:profile','dlorgia:lastEvaluation','dlorgia:personalGuide:v1','dlorgia:reminders:v3']) assert.ok(index.includes(key),key);
 assert.match(js,/const V53_LOCAL_PROGRESS = \[\.\.\.USER_SCOPED_KEYS\]/);
 assert.match(js,/await api\('\/api\/me\/progress', \{ method:'DELETE'/);
 const wipe=js.slice(js.indexOf('function wipeLocalJourney'),js.indexOf('const v51ResetInput'));
 assert.doesNotMatch(wipe,/AUTH_ACCOUNTS_KEY|AUTH_PERSIST_KEY|AUTH_SESSION_KEY|REMOTE_SESSION_KEY|clearRemoteSession/);
 assert.match(js,/if \(!authBackend\.databaseConfigured \|\| !navigator\.onLine\)/);
});

test('v5.3: servidor aplica autorización a usuario propio y no borra citas ni cuenta',()=>{
 const code=read('src/server.js');
 const reset=code.slice(code.indexOf('v5.3: delete only'),code.indexOf("if (req.method === 'PATCH' && url.pathname === '/api/profile')"));
 assert.match(reset,/const auth = await currentUser\(req\)/);
 assert.match(reset,/eq\('user_id', auth\.user\.id\)/);
 assert.match(reset,/dbDelete\('personal_guides'/);
 assert.match(reset,/dbDelete\('journey_events'/);
 assert.match(reset,/event_type=in\.\(guide_completed,treatment_viewed,treatment_saved\)/);
 assert.doesNotMatch(reset,/dbDelete\('appointments'|dbDelete\('profiles'|deleteUser/);
 assert.match(reset,/accountPreserved: true, appointmentsPreserved: true/);
});

test('v5.3: PWA incluye configuración, foto y versión de caché coherente',()=>{
 const sw=read('public/service-worker.js');
 assert.match(sw,/dlorgia-orienta-v540-recorrido/);
 assert.match(sw,/\/assets\/config-retro-v53\.css/);
 assert.match(sw,/\/assets\/fotos-dlorgia\/manchas-piel-referencia\.webp/);
 assert.ok(existsSync(join(root,'public/assets/config-retro-v53.css')));
});

test('v5.3: no permite borrar recorrido remoto sin un token válido', {timeout:18000},async()=>{
 const socket=http.createServer();await new Promise(ok=>socket.listen(0,'127.0.0.1',ok));const port=socket.address().port;await new Promise(ok=>socket.close(ok));
 const base=`http://127.0.0.1:${port}`;
 const child=spawn(process.execPath,['src/server.js'],{cwd:root,stdio:'ignore',env:{...process.env,PORT:String(port),SUPABASE_URL:'',SUPABASE_PUBLISHABLE_KEY:'',SUPABASE_SECRET_KEY:'',APP_PUBLIC_URL:base}});
 try{
  let ok=false;for(let i=0;i<120;i++){try{ok=(await fetch(base+'/health')).ok;if(ok)break}catch{}await new Promise(r=>setTimeout(r,75));}assert.ok(ok);
  const reset=await fetch(base+'/api/me/progress',{method:'DELETE'});
  assert.equal(reset.status,401);
  const data=await reset.json();assert.match(data.error,/inicia sesión|Inicia sesión/i);
  const config=await fetch(base+'/assets/config-retro-v53.css');assert.equal(config.status,200);
  const image=await fetch(base+'/assets/fotos-dlorgia/manchas-piel-referencia.webp');assert.equal(image.status,200);
 }finally{child.kill('SIGTERM');}
});
