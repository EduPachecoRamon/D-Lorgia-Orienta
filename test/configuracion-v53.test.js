import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(join(root,path),'utf8');

test('v5.3 integra configuracion en la app paciente sin inventar una ruta separada',()=>{
 const html=read('public/index.html');
 const js=read('public/assets/app-v400.js');
 const css=read('public/assets/configuracion-v53.css');
 assert.match(html,/id="v50-settings-open"/);
 assert.match(html,/id="v50-settings-dialog"/);
 assert.match(html,/href="\/assets\/configuracion-v53\.css"/);
 for(const name of ['experience','appearance','accessibility','help','privacy']) {
   assert.match(html,new RegExp('id="v53-tab-'+name+'"'));
   assert.match(html,new RegExp('id="v53-panel-'+name+'"'));
 }
 assert.match(js,/selectV53SettingsTab/);
 assert.match(css,/v53-settings-dialog/);
 assert.match(css,/max-width:690px/);
});
test('v5.3 nubes opcionales y movimiento reducido',()=>{
 const html=read('public/index.html'),js=read('public/assets/app-v400.js'),css=read('public/assets/configuracion-v53.css');
 for(const id of ['v53-animated-bg','v53-soft-clouds','v53-reduce-motion','v53-large-text','v53-high-contrast']) assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(js,/getV53Appearance/);
 assert.match(js,/applyV53Appearance/);
 assert.match(js,/saveA11yPrefs\(next\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/v53CloudDrift/);
});
test('v5.3 reinicio local conserva claves de autenticacion',()=>{
 const js=read('public/assets/app-v400.js'),html=read('public/index.html');
 const localList=js.match(/const V51_LOCAL_PROGRESS = \[([\s\S]*?)\];/)?.[1]||'';
 for(const key of ['dlorgia:lastEvaluation','dlorgia:tourSeen:v50','dlorgia:reminders:v3','dlorgia:personalGuide:v1']) assert.ok(localList.includes(key));
 for(const sensitive of ['auth:accounts','auth:persisted','remote:session','auth:session']) assert.ok(!localList.includes(sensitive));
 assert.match(js,/for \(const key of V51_LOCAL_PROGRESS\) store\.remove\(key\)/);
 assert.match(html,/v51-reset-phrase/);
});
test('v5.3 no sobreescribe fotografia del recorrido ni presenta flyer de manchas en catalogo',()=>{
 const js=read('public/assets/app-v400.js'),img=read('public/assets/dlorgia-imagery46.js');
 assert.match(js,/scenePhoto\.src = `\/assets\/fotos-dlorgia\/\$\{scene\.photo\}`/);
 assert.doesNotMatch(js,/tourIndex === 2 \? '\/assets\/fotos-dlorgia\/huancayo-consultorio-02\.webp'/);
 assert.match(js,/const visual = catalogTreatmentPhotoInfo\(x\)/);
 assert.match(img,/piel-manchas-comparativa\.webp/);
 assert.ok(existsSync(join(root,'public/assets/fotos-dlorgia/piel-manchas-comparativa.webp')));
});
test('v5.3 cache incluye nuevos recursos',()=>{
 const sw=read('public/service-worker.js');
 assert.match(sw,/dlorgia-orienta-v530-retro-settings/);
 assert.match(sw,/\/assets\/configuracion-v53\.css/);
 assert.match(sw,/\/assets\/fotos-dlorgia\/piel-manchas-comparativa\.webp/);
});
