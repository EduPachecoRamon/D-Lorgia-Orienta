import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const photo = (p) => join(root, 'public/assets/fotos-dlorgia', p);

test('v5.1.1: 29 archivos autorizados presentes y material clínico separado de Inicio', () => {
  const data = JSON.parse(read('public/assets/fotos-dlorgia/biblioteca.json'));
  assert.equal(data.total, 29);
  assert.equal(data.photos.length, 29);
  assert.equal(data.public_ready + data.needs_review, 29);
  assert.equal(data.photos.filter(x=>x.group==='huancayo').length, 10);
  const publicPhotos = data.photos.filter(x=>x.privacy==='public');
  assert.equal(publicPhotos.length, 29);
  for (const item of publicPhotos) {
    assert.ok(existsSync(photo(`${item.name}.webp`)), item.name);
    assert.ok(readFileSync(photo(`${item.name}.webp`)).subarray(0,4).toString() === 'RIFF', item.name);
  }
  assert.ok(existsSync(photo('resultado-manchas-comparativa.webp')));
  assert.ok(existsSync(photo('testimonio-acne.webp')));
  assert.equal(data.displayed_immediately, data.photos.filter(x => x.show_in_ui === true).length);
  for (const item of data.photos.filter(x => x.use_category === 'clinical_education' || x.use_category === 'testimonials')) assert.equal(item.show_in_ui, false);
});

test('v5.1: inicio y sede Huancayo ofrecen fotos locales contextualizadas', () => {
  const home = read('public/index.html');
  const css = read('public/assets/foco-v51.css');
  const sede = read('public/sedes.html');
  assert.match(home, /v51-branch-strip/);
  assert.match(home, /huancayo-consultorio-02\.webp/);
  assert.match(home, /huancayo-fachada\.webp/);
  assert.match(css, /huancayo-productos-01\.webp/);
  assert.match(sede, /v51-sede-gallery/);
  assert.match(sede, /huancayo-fachada\.webp/);
  assert.match(sede, /huancayo-consultorio-01\.webp/);
});

test('v5.1: la bienvenida no dirige a resultado viejo al completar una sesión guardada', () => {
  const js = read('public/assets/app-v400.js');
  assert.match(js, /if \(getPersonalGuide\(\)\) show\('home'\)/);
  assert.match(js, /else \{ guideStep = 0; show\('guide'\); \}/);
  const finish = js.slice(js.indexOf('function finishTour('),js.indexOf('function renderFramePreference('));
  assert.doesNotMatch(finish, /guideStep = getPersonalGuide\(\) \? 'result' : 0/);
});

test('v5.1: el reinicio requiere REINICIAR y nunca elimina cuenta ni solicitudes remotas', () => {
  const html = read('public/index.html'), js = read('public/assets/app-v400.js');
  for (const id of ['v51-reset-start', 'v51-reset-dialog', 'v51-reset-phrase', 'v51-reset-confirm']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /no elimina mi cuenta ni solicitudes/);
  assert.match(js, /v51ResetInput\.value\.trim\(\)!=='REINICIAR'/);
  assert.match(js, /for \(const key of V51_LOCAL_PROGRESS\) store\.remove\(key\)/);
  const reset = js.slice(js.indexOf('const V51_LOCAL_PROGRESS'), js.indexOf("$('#v50-settings-open')"));
  for (const forbidden of ['dlorgia:lastEvaluation', 'dlorgia:profile', 'dlorgia:remote:session:v1', 'AUTH_ACCOUNTS_KEY']) assert.doesNotMatch(reset, new RegExp(`['"]${forbidden.replaceAll(':','\\:')}['"]`));
  assert.match(js, /closeAppDialog\('#v51-reset-dialog'\)/);
});

test('v5.1: resultados muestran acciones compactas y detalles opcionales', () => {
  const js = read('public/assets/app-v400.js');
  assert.match(js, /v51-result-head/);
  assert.match(js, /<details class="v51-match-more">/);
  assert.match(js, /v51-result-home/);
  assert.match(read('public/service-worker.js'), /dlorgia-orienta-v510-fotos/);
});
