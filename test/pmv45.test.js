import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(path.join(root, p), 'utf8');
const appHtml = read('public/index.html');
const adminHtml = read('public/admin.html');
const app = read('public/assets/app-v400.js');
const admin = read('public/assets/admin-v420.js');
const server = read('src/server.js');
const accounts = read('src/services/accounts.js');
const sw = read('public/service-worker.js');

test('registro confirmado entra con sesión y registro sin sesión espera correo', () => {
  assert.match(accounts, /const hasSession = Boolean\(signup\.access_token\)/);
  assert.match(accounts, /needsEmailConfirmation/);
  assert.match(app, /acceptSupabaseEmailCallback/);
  assert.match(app, /data\.needsEmailConfirmation/);
  for (const id of ['register-form','verify-panel','verify-email','verify-go-login']) assert.match(appHtml,new RegExp(`id="${id}"`));
});
test('primera entrada muestra guía y su recorrido', () => {
  for (const id of ['welcome','welcome-continue','welcome-explore','onboarding']) assert.match(appHtml,new RegExp(`id="${id}"`));
  assert.match(app, /welcomeSeen:v1/);
  assert.match(appHtml, /Personalizar mi recorrido/);
});
test('páginas independientes para difusión y ayuda', () => {
  for (const route of ['/conoce','/ayuda','/admin/ayuda']) assert.ok(server.includes(`'${route}'`));
  for (const name of ['conoce.html','ayuda.html','admin-ayuda.html']) assert.match(read('public/'+name), /<main/);
  assert.match(sw,/dlorgia-orienta-v510-fotos/);
});
test('centro admin de atención con acciones útiles y enlace de difusión', () => {
  for(const id of ['attention-metrics','attention-appointments','attention-guides','copy-campaign-link']) assert.match(adminHtml,new RegExp(`id="${id}"`));
  assert.match(admin,/function renderAttention/);
  assert.match(admin,/openAppointmentDrawer/);
});
test('no se afirma cita persistida si base de datos no está disponible', () => {
  assert.match(server,/Las reservas están temporalmente indisponibles/);
  assert.match(server,/const auth = await currentUser\(req\);/);
  assert.match(server,/error\.status \|\| 400/);
});
test('oculta avisos de navegación que tapaban la lectura', () => {
  assert.match(app,/if \(!title && !detail\)/);
  assert.match(app,/networkStateInitialized/);
});
