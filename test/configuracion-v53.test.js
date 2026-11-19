import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(join(root, file), 'utf8');

test('v5.3 mantiene configuración dentro de la app original', () => {
  const html = read('public/index.html');
  const js = read('public/assets/app-v400.js');
  assert.match(html, /id="settings"/);
  assert.match(html, /id="v50-settings-open"/);
  assert.match(html, /href="\/assets\/config-retro-v53\.css"/);
  for (const tab of ['experience','appearance','accessibility','help','privacy'])
    assert.match(html, new RegExp('data-v53-settings-tab="' + tab + '"'));
  assert.match(js, /data-v53-settings-tab/);
  assert.ok(existsSync(join(root, 'public/assets/config-retro-v53.css')));
});

test('v5.3 presenta nubes opcionales, accesibilidad y confirmación del reinicio', () => {
  const html = read('public/index.html');
  const css = read('public/assets/config-retro-v53.css');
  const sw = read('public/service-worker.js');
  for (const id of ['v53-background-motion','v53-clouds','v53-large-text','v53-high-contrast','v53-reduce-motion','v51-reset-start','v51-reset-phrase'])
    assert.match(html, new RegExp('id="' + id + '"'));
  assert.match(css, /prefers-reduced-motion/);
  assert.match(sw, /dlorgia-orienta-v540-recorrido/);
});
