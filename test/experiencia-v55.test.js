import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');

test('v5.5 bienvenida tiene tres beneficios navegables, sin recorte y sin imagen duplicada',()=>{
 const html=read('public/index.html'),js=read('public/assets/app-v400.js'),css=read('public/assets/experiencia-v55.css');
 for(const label of ['Orientar','Aclarar','Conectar']) assert.ok(html.includes(label));
 for(const feature of ['guide','advisor','evaluation']) assert.match(html,new RegExp('data-v50-cube="'+feature+'"'));
 assert.match(html,/v55-feature-grid/);
 assert.match(js,/aria-pressed/);
 assert.doesNotMatch(js,/if \(tourPhoto\) tourPhoto\.src = tourIndex/);
 assert.match(css,/grid-template-columns:minmax\(0,1fr\)!important/);
 assert.match(css,/100dvw/);
 assert.match(css,/overflow-x:hidden/);
});

test('v5.5 reloj de dos campanas y ruta de seguimiento tienen movimiento accesible y continuo',()=>{
 const html=read('public/index.html'),js=read('public/assets/app-v400.js'),css=read('public/assets/experiencia-v55.css');
 for(const part of ['v55-alarm-bell-left','v55-alarm-bell-right','v55-clock-digits','v55-clock-second']) assert.ok(html.includes(part),part);
 assert.match(js,/v55-journey-flow/);
 assert.match(css,/v55JourneyFlow 14s linear infinite/);
 assert.match(css,/v55Seconds 60s steps\(60,end\) infinite/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/body\.dlorgia-motion-paused/);
});

test('v5.5 consulta aparece al final y el historial no se transmite sin acción explícita',()=>{
 const js=read('public/assets/app-v400.js');
 assert.match(js,/selector !== '#v54-followup-contact'/);
 assert.match(js,/hasOrientation && Boolean\(advisorQuestions\.length\)/);
 assert.match(js,/getAdvisorMemory\(\)\.filter/);
 assert.match(js,/Mi pregunta al Asesor fue:/);
 assert.match(js,/field\.addEventListener\('input', updateLink\)/);
 assert.match(js,/encodeURIComponent\(message\)/);
 assert.match(js,/tu resumen/i);
 assert.match(js,/No es un diagnóstico/);
 assert.match(js,/link\.getAttribute\('aria-disabled'\)/);
 assert.doesNotMatch(js,/whatsapp\.send\(/);
});

test('v5.5 PWA lista nueva CSS, conserva rutas y versiones congruentes',()=>{
 const html=read('public/index.html'),js=read('public/assets/app-v400.js'),sw=read('public/service-worker.js');
 assert.match(html,/href="\/assets\/experiencia-v55\.css"/);
 assert.match(sw,/dlorgia-orienta-v550-recorrido-claro/);
 assert.match(sw,/\/assets\/experiencia-v55\.css/);
 assert.match(js,/service-worker\.js\?v=550/);
 assert.ok(existsSync(join(root,'public/assets/experiencia-v55.css')));
});
