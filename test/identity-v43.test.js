import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { humanMessage } from '../public/assets/dlorgia-feedback.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const file=p=>readFileSync(join(root,p),'utf8');
const app=file('public/index.html'), admin=file('public/admin.html');
const motion=file('public/assets/dlorgia-motion.css');
const sw=file('public/service-worker.js');
const tokens=JSON.parse(file('dlorgia.tokens.json'));
const shared=['dlorgia-tokens.css','dlorgia-typography.css','dlorgia-components.css','dlorgia-motion.css'];

test('ambas interfaces consumen el sistema de diseño compartido',()=>{
 for(const html of [app,admin]) for(const name of shared) assert.ok(html.includes(name), name);
 assert.match(app,/dlorgia-patient\.css/);
 assert.match(admin,/dlorgia-admin\.css/);
 assert.equal(tokens.color.forest.$value,'#183E35');
 assert.equal(tokens.color.cream.$value,'#F6F2E9');
});
test('animaciones ambientales conservan transparencia semántica',()=>{
 assert.match(motion,/animation-name:dlorgiaAmbientDrift/);
 assert.match(motion,/opacity:\.045!important/);
 assert.match(motion,/prefers-reduced-motion/);
 const keyframes=motion.match(/@keyframes dlorgiaAmbientDrift\{[\s\S]*?\n\}/)?.[0]||'';
 assert.ok(keyframes.length>100);
 assert.doesNotMatch(keyframes,/opacity\s*:/);
});
test('mensajes de errores técnicos no llegan crudos al usuario',()=>{
 assert.match(humanMessage(new Error('schema cache failure')),/No pudimos/);
 assert.match(humanMessage(Object.assign(new Error('JWT expired'),{status:401})),/sesión terminó/);
 assert.match(humanMessage(Object.assign(new Error('duplicate key'),{status:409}),'appointment'),/horario/);
 assert.match(humanMessage(new Error('Failed to fetch')),/conectarnos/);
 assert.match(humanMessage('Cita confirmada.'),/Cita confirmada/);
});
test('sin etiquetas técnicas de prototipo en páginas públicas',()=>{
 for(const html of [app,admin]) assert.doesNotMatch(html,/prototipo académico|modo demo|Supabase todavía no/i);
 assert.match(app,/dlorgia-signature\.svg/);
 assert.match(admin,/dlorgia-signature\.svg/);
});
test('service worker rota caché y precarga recursos de v4.3',()=>{
 assert.match(sw,/dlorgia-orienta-v500-enfoque/);
 for(const name of [...shared,'dlorgia-patient.css','dlorgia-admin.css','dlorgia-ambient.js','dlorgia-feedback.js']) assert.ok(sw.includes(name));
});
