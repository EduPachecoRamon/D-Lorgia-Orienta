import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { googleOAuthEnabled, oauthPublicOrigin } from '../src/services/google-oauth.js';
import { sitemapXml, robotsTxt, seoHeadFor } from '../src/services/seo.js';
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = f => fs.readFileSync(path.join(base, f), 'utf8');

// OAuth URL validation is covered independently from deployment credentials.
test('Google OAuth valida una URL pública HTTPS y no depende de roles en el navegador', () => {
  const oauth = file('src/services/google-oauth.js');
  assert.match(oauth, /code_challenge_method/);
  assert.match(oauth, /HttpOnly; SameSite=Lax/);
  assert.match(oauth, /timingSafeEqual/);
  assert.match(oauth, /Cache-Control': 'no-store/);
  assert.match(oauth, /ensureProfile/);
  assert.doesNotMatch(oauth, /user_metadata\.role|new URL\(req\.headers\.host/);
});
test('El acceso visual se muestra solo al estar configurado y el correo sigue disponible', () => {
  const html = file('public/index.html'), app = file('public/assets/app-v400.js');
  assert.match(html, /id="google-sign-in"/);
  assert.match(html, /id="login-form"/);
  assert.match(html, /id="register-form"/);
  assert.match(app, /\/api\/auth\/google\/status/);
  assert.match(app, /\/api\/auth\/google\/start/);
});
test('Búsqueda gratuita por tratamientos y galería, sin servicios externos nuevos', () => {
  assert.match(file('public/assets/app-v400.js'), /normalizedSearch/);
  assert.match(file('public/index.html'), /id="catalog-search"/);
  assert.match(file('public/experiencias.html'), /id="gallery-search"/);
  assert.match(file('public/assets/dlorgia-gallery46.js'), /filterGallery/);
});
test('SEO incluye solo rutas públicas y bloquea login y admin', () => {
  const xml=sitemapXml('https://example.org');
  assert.match(xml, /https:\/\/example.org\/conoce/);
  assert.match(xml, /https:\/\/example.org\/experiencias/);
  assert.doesNotMatch(xml, /\/admin|\/app/);
  assert.match(robotsTxt('https://example.org'), /Disallow: \/admin/);
  assert.match(seoHeadFor('/conoce','https://example.org'), /rel="canonical"/);
  assert.equal(seoHeadFor('/admin','https://example.org'), '');
});
test('Admin puede compartir las páginas públicas sin crear bases de datos', () => {
  const html=file('public/admin.html'), js=file('public/assets/admin-v420.js');
  assert.match(html, /data-panel="marketing"/);
  assert.match(html, /data-campaign-copy/);
  assert.match(js, /marketing:'Difusión'/);
  assert.match(file('public/assets/dlorgia-campaigns47.js'), /navigator\.clipboard/);
});

async function freePort() {const s=http.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
const wait = ms => new Promise(r=>setTimeout(r,ms));
async function eventually(url, count=60) { for(let i=0;i<count;i++){try{const r=await fetch(url);if(r.ok)return;}catch{} await wait(60);}throw new Error('Servidor no inició');}

test('HTTP OAuth PKCE: callback exige state correcto y crea una sesión paciente verificada', {timeout:20000}, async () => {
  const port=await freePort(), upstreamPort=await freePort();
  const mock=http.createServer(async (req,res)=>{
    const url=new URL(req.url,`http://127.0.0.1:${upstreamPort}`);
    res.setHeader('Content-Type','application/json');
    if(url.pathname==='/auth/v1/token' && url.searchParams.get('grant_type')==='pkce'){
      let body='';for await(const chunk of req)body+=chunk;
      const data=JSON.parse(body);
      if(!data.auth_code || !data.code_verifier){res.writeHead(400);res.end('{}');return;}
      res.end(JSON.stringify({access_token:'mock-google-token',refresh_token:'mock-google-refresh',expires_in:3600,token_type:'bearer',user:{id:'google-patient-1',email:'someone@example.com',user_metadata:{full_name:'Paciente Google'}}}));return;
    }
    if(url.pathname==='/rest/v1/profiles') {
      if(req.method==='POST') {let body='';for await(const c of req)body+=c;const profile=JSON.parse(body);res.end(JSON.stringify([{...profile,id:'google-patient-1'}]));return;}
      res.end('[]');return;
    }
    res.writeHead(404);res.end('{}');
  });
  await new Promise(r=>mock.listen(upstreamPort,'127.0.0.1',r));
  const server=spawn(process.execPath,['src/server.js'],{cwd:base,env:{...process.env,PORT:String(port),SUPABASE_URL:`http://127.0.0.1:${upstreamPort}`,SUPABASE_PUBLISHABLE_KEY:'pub-test',SUPABASE_SECRET_KEY:'secret-test',APP_PUBLIC_URL:`http://127.0.0.1:${port}`,GOOGLE_OAUTH_ENABLED:'true',DLORGIA_ADMIN_EMAILS:'admin@example.com'},stdio:'ignore'});
  try {
    const origin=`http://127.0.0.1:${port}`;
    await eventually(origin+'/health');
    const status=await (await fetch(origin+'/api/auth/google/status')).json();assert.equal(status.available,true);
    const start=await fetch(origin+'/api/auth/google/start',{redirect:'manual'});
    assert.equal(start.status,302);
    const location=new URL(start.headers.get('location'));assert.equal(location.searchParams.get('provider'),'google');
    assert.equal(location.searchParams.get('code_challenge_method'),'s256');
    const callback=new URL(location.searchParams.get('redirect_to'));
    const cookie=start.headers.get('set-cookie').split(';')[0];
    const invalid=await fetch(origin+'/api/auth/google/callback?state=incorrect&code=xyz',{headers:{cookie}});
    assert.equal(invalid.status,400);
    const success=new URL(callback);
    success.searchParams.set('code','one-time-code');
    const result=await fetch(success,{headers:{cookie}});
    assert.equal(result.status,200);
    const text=await result.text();
    assert.match(text,/Acceso verificado/);
    assert.match(text,/dlorgia:remote:session:v1/);
    assert.match(text,/google-patient-1|mock-google-token/);
    assert.doesNotMatch(text,/admin@example.com/);
    assert.match(result.headers.get('cache-control'),/no-store/);
    // Aunque el login se inició en Admin, un paciente jamás entra al panel.
    const adminStart=await fetch(origin+'/api/auth/google/start?return_to=admin',{redirect:'manual'});
    const adminUrl=new URL(new URL(adminStart.headers.get('location')).searchParams.get('redirect_to'));
    adminUrl.searchParams.set('code','another-one-time-code');
    const adminCookie=adminStart.headers.get('set-cookie').split(';')[0];
    const blocked=await (await fetch(adminUrl,{headers:{cookie:adminCookie}})).text();
    assert.match(blocked,/\/app\?google=connected/);
    assert.doesNotMatch(blocked,/\/admin\?google=connected/);
    const sitemap=await fetch(origin+'/sitemap.xml');assert.equal(sitemap.status,200);
    const sitemapText=await sitemap.text();assert.match(sitemapText,/\/conoce/);
    const publicHtml=await (await fetch(origin+'/conoce')).text();assert.match(publicHtml,/rel="canonical"/);
  } finally {
    server.kill('SIGTERM');
    await new Promise(r=>mock.close(r));
  }
});
