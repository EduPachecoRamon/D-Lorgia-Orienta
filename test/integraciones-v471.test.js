import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchConsoleVerificationTag } from '../src/services/seo.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('Search Console acepta solamente códigos de verificación públicos con formato seguro', () => {
  assert.equal(searchConsoleVerificationTag('AbCd_123456'), '<meta name="google-site-verification" content="AbCd_123456">');
  for (const bad of ['<script>x</script>', 'a" onload="x', ' short ', '%%%', '']) {
    assert.equal(searchConsoleVerificationTag(bad), '');
  }
});

async function randomPort() {
  const server = http.createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}
async function waitHealthy(origin) {
  for (let i=0;i<65;i++) {
    try { const r=await fetch(origin+'/health'); if (r.ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 75));
  }
  throw Error('No se inició el backend de prueba');
}

test('La etiqueta de Google llega al HTML raíz y público, sin habilitar OAuth por accidente', { timeout: 14000 }, async () => {
  const port=await randomPort(), origin=`http://127.0.0.1:${port}`;
  const service=spawn(process.execPath, ['src/server.js'], { cwd:root, stdio:'ignore', env:{
    ...process.env,
    PORT:String(port),
    APP_PUBLIC_URL:origin,
    GOOGLE_OAUTH_ENABLED:'false',
    GOOGLE_SITE_VERIFICATION:'AbCd_123456',
    SUPABASE_URL:'', SUPABASE_PUBLISHABLE_KEY:'', SUPABASE_SECRET_KEY:'',
    SUPABASE_ANON_KEY:'', SUPABASE_SERVICE_ROLE_KEY:''
  }});
  try {
    await waitHealthy(origin);
    const homepage=await (await fetch(origin+'/')).text();
    const publicPage=await (await fetch(origin+'/conoce')).text();
    assert.match(homepage, /google-site-verification" content="AbCd_123456"/);
    assert.match(homepage, /rel="canonical"/);
    assert.match(homepage, /id="feature-cube"/);
    assert.match(publicPage, /google-site-verification" content="AbCd_123456"/);
    assert.match(publicPage, /rel="canonical"/);
    const sitemap=await fetch(origin+'/sitemap.xml');
    assert.equal(sitemap.status,200);
    const xml=await sitemap.text();
    assert.match(xml,/\/conoce/);
    assert.doesNotMatch(xml,/\/admin|\/app/);
    const status=await (await fetch(origin+'/api/auth/google/status')).json();
    assert.equal(status.available,false);
  } finally {
    service.kill('SIGTERM');
  }
});
