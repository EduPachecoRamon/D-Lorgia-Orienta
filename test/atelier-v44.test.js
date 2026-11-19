import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const patientHtml=read('public/index.html'), adminHtml=read('public/admin.html');
const patientCSS=read('public/assets/dlorgia-ateliers-v44.css');
const adminCSS=read('public/assets/dlorgia-admin-v44.css');
const sw=read('public/service-worker.js');
const app=read('public/assets/app-v400.js');

test('app paciente separa contenido desplazable y barra inferior anclada al marco',()=>{
  assert.match(patientCSS,/\.app-shell main\{[^}]*overflow-y:auto/);
  assert.match(patientCSS,/\.app-shell \.bottom-nav\{[^}]*position:relative!important/);
  assert.match(app,/viewport\.scrollTo/);
});
test('Mi espacio conserva todos los puntos de integración y organiza su jerarquía',()=>{
  for (const id of ['portal-stats','portal-guide-summary','saved-list','history-list','portal-reminders','profile-form','profile-name','profile-branch','profile-communication','profile-support','portal-download','install-app','install-status','account-summary','logout-app']) assert.ok(patientHtml.includes(`id="${id}"`),id);
  assert.match(patientHtml,/portal-cover/);
  assert.match(patientHtml,/portal-shortcut-grid/);
  assert.match(patientHtml,/portal-more/);
});
test('admin no deja hueco de intro y muestra banner original con imagen',()=>{
  assert.match(adminCSS,/\.intro-curtain\.done\{display:none!important/);
  assert.match(adminCSS,/dlorgia-atmosphere\.webp/);
  assert.match(adminCSS,/\.kpi-card\.reveal\{opacity:1!important/);
  assert.match(adminHtml,/atelier-hero/);
  assert.match(adminHtml,/id="welcome-title"/);
});
test('accesibilidad disponible en paciente y admin',()=>{
  assert.match(patientHtml,/a11y-large-text/);
  assert.match(adminHtml,/admin-a11y-panel/);
  assert.match(adminHtml,/admin-a11y-trigger/);
  assert.match(adminCSS,/prefers-reduced-motion/);
});
test('caché v4.4 incluye recursos nuevos',()=>{
  assert.match(sw,/dlorgia-orienta-v530-nubes/);
  for(const p of ['dlorgia-ateliers-v44.css','dlorgia-admin-v44.css','dlorgia-atmosphere.webp','dlorgia-admin-a11y.js']) assert.ok(sw.includes(p),p);
});

test('servidor reconoce la ilustración optimizada como imagen webp',()=>{
  const server=read('src/server.js');
  assert.match(server,/\.webp': 'image\/webp'/);
});
