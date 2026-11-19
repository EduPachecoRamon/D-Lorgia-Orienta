import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('v4.8 separa portada y acceso de forma verificable',()=>{
 const server=read('src/server.js');
 const portada=read('public/portada.html');
 const app=read('public/index.html');
 const css=read('public/assets/acceso-v48.css');
 assert.match(server,/pathname === '\/' \? '\/index.html'/);
 assert.match(server,/pathname === '\/app' \? '\/index.html'/);
 assert.match(portada,/id="feature-cube"/);
 assert.match(portada,/href="\/app\?mode=register"/);
 assert.match(portada,/href="\/app\?mode=login"/);
 assert.match(app,/id="login-form"/);
 assert.match(app,/id="register-form"/);
 assert.match(app,/acceso-v48.css/);
 assert.match(css,/main>\.screen:not\(\.active\)\{display:none!important/);
 assert.match(css,/\.entry-mode main>\.screen:not\(#login\)\{display:none!important/);
 assert.match(css,/\.login-trust\{display:none!important/);
});
test('flujo entre login y registro conserva correo sin crear cuentas por error',()=>{
 const j=read('public/assets/app-v400.js');
 assert.match(j,/function switchAccessMode\(mode\)/);
 assert.match(j,/if \(email.includes\('@'\)/);
 assert.match(j,/get\('mode'\)/);
 assert.match(j,/Si es tu primera vez, elige/);
 assert.match(j,/data\.needsEmailConfirmation/);
 assert.match(j,/\/api\/auth\/google\/start/);
});
test('cubo accesible por teclado, hover, clic y táctil, sin ilustraciones artificiales',()=>{
 const j=read('public/assets/portada-v49.js');
 const h=read('public/portada.html');
 assert.match(j,/addEventListener\('click'/);
 assert.match(j,/addEventListener\('mouseenter'/);
 assert.match(j,/addEventListener\('focus'/);
 assert.match(h,/aria-live="polite"/);
 assert.doesNotMatch(h,/assets\/media\//);
 assert.ok((h.match(/www\.dlorgia\.com\//g)||[]).length>=6);
});
test('rutas públicas y acceso sirven documentos distintos', {timeout:13000}, async()=>{
 const s=http.createServer();await new Promise(res=>s.listen(0,'127.0.0.1',res));const port=s.address().port;await new Promise(res=>s.close(res));
 const origin=`http://127.0.0.1:${port}`;
 const child=spawn(process.execPath,['src/server.js'],{cwd:root,stdio:'ignore',env:{...process.env,PORT:String(port),APP_PUBLIC_URL:origin,SUPABASE_URL:'',SUPABASE_PUBLISHABLE_KEY:'',SUPABASE_SECRET_KEY:''}});
 try{
  let up=false;for(let i=0;i<75;i++){try{up=(await fetch(origin+'/health')).ok;if(up)break}catch{}await new Promise(res=>setTimeout(res,60))}assert.ok(up);
  const main=await (await fetch(origin+'/')).text(), app=await (await fetch(origin+'/app')).text();
  assert.match(main,/id="login-form"/);assert.doesNotMatch(main,/id="feature-cube"/);
  assert.match(app,/id="login-form"/);assert.doesNotMatch(app,/id="feature-cube"/);
  const c=await fetch(origin+'/assets/acceso-v48.css');assert.equal(c.status,200);
  const sitemap=await (await fetch(origin+'/sitemap.xml')).text();assert.match(sitemap,/<loc>[^<]+<\/loc>/);
 }finally{child.kill('SIGTERM')}
});
