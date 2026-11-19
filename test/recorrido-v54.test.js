import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import http from 'node:http';
import {spawn} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');

test('v5.4 crea mapa accesible de cinco paradas navegables',()=>{
  const js=read('public/assets/app-v400.js'),css=read('public/assets/recorrido-v54.css');
  assert.match(js,/function renderFollowUp\(\)/);
  for(const stage of ['Orientador Personal','Tratamiento y expectativas','Conectar con D’Lorgia','Organizar recordatorios','Resolver dudas y continuar']) assert.ok(js.includes(stage),stage);
  assert.match(js,/data-v54-step=/);
  assert.match(js,/aria-label="Paso \$\{index\+1\}/);
  assert.match(js,/v54-journey-path/);
  assert.match(js,/scrollIntoView/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(js,/Este es un recorrido informativo, no un estado clínico/);
});

test('v5.4 recordatorios validan futuro y tienen alarma SVG accesible',()=>{
  const html=read('public/index.html'),js=read('public/assets/app-v400.js'),css=read('public/assets/recorrido-v54.css');
  assert.match(html,/id="v54-reminder-builder"/);
  assert.match(html,/class="v54-alarm-art" aria-hidden="true"/);
  assert.match(css,/v54ClockTick/);
  assert.match(js,/reminderDate\.getTime\(\) <= Date\.now\(\)/);
  assert.match(js,/getFullYear\(\)/);
  assert.match(html,/solo pueden aparecer si la app está abierta/);
});

test('v5.4 conecta tratamiento, resumen y seguimiento con sedes verificadas del servidor',()=>{
  const html=read('public/index.html'),js=read('public/assets/app-v400.js');
  for(const id of ['v54-summary-contact','v54-evaluation-contact','v54-followup-contact']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(js,/api\('\/api\/branches'\)/);
  assert.match(js,/^\s*function renderContactBridge/m);
  assert.match(js,/https:\/\/wa\.me\/\$\{item\.phone\}/);
  assert.match(js,/Abrirlo no solicita ni confirma una cita/);
  assert.match(js,/href="\/sedes"/);
  assert.match(js,/V53_LOCAL_PROGRESS\.push\('dlorgia:contactBranch:v54'\)/);
  assert.doesNotMatch(js,/whatsapp\.send\(/);
});

test('v5.4 tratamientos tienen objetivos, expectativas, guardados y acceso al equipo',()=>{
  const js=read('public/assets/app-v400.js');
  assert.match(js,/class="v54-detail-facts"/);
  assert.match(js,/escapeHtml\(treatment\.description/);
  assert.match(js,/escapeHtml\(treatment\.recovery/);
  assert.match(js,/v54-treatment-questions/);
  for(const id of ['detail-calc','detail-assistant','detail-followup','detail-save','v54-detail-contact']) assert.ok(js.includes(id),id);
  assert.match(js,/renderContactBridge\('#v54-guide-contact'/);
});

test('v5.4 PWA versiona sus recursos sin alterar las rutas de la app',()=>{
 const html=read('public/index.html'),sw=read('public/service-worker.js'),js=read('public/assets/app-v400.js');
 assert.match(html,/href="\/assets\/recorrido-v54\.css"/);
 assert.match(sw,/dlorgia-orienta-v540-recorrido/);
 assert.match(sw,/\/assets\/recorrido-v54\.css/);
 assert.match(js,/service-worker\.js\?v=540/);
 assert.ok(existsSync(join(root,'public/assets/recorrido-v54.css')));
});

test('v5.4 el servidor entrega directorio de sedes y la hoja nueva',{timeout:20000},async()=>{
 const socket=http.createServer(); await new Promise(ok=>socket.listen(0,'127.0.0.1',ok));
 const port=socket.address().port; await new Promise(ok=>socket.close(ok));
 const base=`http://127.0.0.1:${port}`;
 const child=spawn(process.execPath,['src/server.js'],{cwd:root,stdio:'ignore',env:{...process.env,PORT:String(port),SUPABASE_URL:'',SUPABASE_PUBLISHABLE_KEY:'',SUPABASE_SECRET_KEY:'',APP_PUBLIC_URL:base}});
 try {
  let online=false;for(let i=0;i<110;i++){try{online=(await fetch(base+'/health')).ok;if(online)break;}catch{}await new Promise(ok=>setTimeout(ok,65));}
  assert.ok(online,'El servidor debe iniciar');
  const css=await fetch(base+'/assets/recorrido-v54.css');assert.equal(css.status,200);
  const directory=await fetch(base+'/api/branches');assert.equal(directory.status,200);
  const branches=(await directory.json()).branches;
  for(const key of ['huancayo','piura','pucallpa']){ assert.ok(branches[key].name);assert.match(branches[key].phone,/^\d{9,15}$/); }
  const app=await fetch(base+'/app');assert.equal(app.status,200);assert.match(await app.text(),/id="followup"/);
 } finally {child.kill('SIGTERM');}
});
