import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import http from 'node:http';
import { resolveAuthPublicOrigin } from '../src/services/auth-redirect.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('producción nunca envía credenciales ni confirmaciones a localhost', () => {
  assert.equal(resolveAuthPublicOrigin('http://localhost:3000', 'https://d-lorgia-app.onrender.com', true), 'https://d-lorgia-app.onrender.com');
  assert.equal(resolveAuthPublicOrigin('http://localhost:3000', '', true), null);
  assert.equal(resolveAuthPublicOrigin('http://127.0.0.1:3333', '', false), 'http://127.0.0.1:3333');
  assert.equal(resolveAuthPublicOrigin('https://user:pass@example.com', '', true), null);
  assert.equal(resolveAuthPublicOrigin('https://d-lorgia-app.onrender.com/app', '', true), null);
  assert.equal(resolveAuthPublicOrigin('http://invalid.example', '', true), null);
  assert.equal(resolveAuthPublicOrigin('https://d-lorgia-app.onrender.com', '', true), 'https://d-lorgia-app.onrender.com');
});

test('registro Supabase envía redirect_to a la aplicación publicada y no a localhost', () => {
  const script = `
    globalThis.fetch = async (url) => {
      const dest = new URL(url);
      if (dest.pathname !== '/auth/v1/signup') throw Error('Ruta inesperada');
      const redirectTo = dest.searchParams.get('redirect_to');
      if (redirectTo !== 'https://d-lorgia-app.onrender.com/app') throw Error('Redirección incorrecta: ' + redirectTo);
      return new Response(JSON.stringify({user:{id:'test-user',email:'test@example.com'}}),{status:200,headers:{'content-type':'application/json'}});
    };
    const {authSignup} = await import('./src/services/supabase.js');
    const result = await authSignup({email:'test@example.com',password:'examplePass1',name:'Test',username:'prueba'});
    if (!result?.user?.id) throw Error('Registro sin usuario');
  `;
  execFileSync(process.execPath, ['--input-type=module','-e',script], {cwd:root, env:{
    ...process.env, APP_PUBLIC_URL:'http://localhost:3000', RENDER:'true',
    RENDER_EXTERNAL_URL:'https://d-lorgia-app.onrender.com', NODE_ENV:'production',
    SUPABASE_URL:'https://mock.supabase.invalid', SUPABASE_PUBLISHABLE_KEY:'public-test',
    SUPABASE_SECRET_KEY:'private-test', SUPABASE_ANON_KEY:'', SUPABASE_SERVICE_ROLE_KEY:''
  }});
});

test('Google PKCE apunta al callback real aunque APP_PUBLIC_URL sea localhost en Render',{timeout:15000},async()=>{
  const probe = http.createServer();
  await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));
  const port=probe.address().port;
  await new Promise(resolve=>probe.close(resolve));
  const server=spawn(process.execPath,['src/server.js'],{cwd:root,stdio:'ignore',env:{
    ...process.env, PORT:String(port), APP_PUBLIC_URL:'http://localhost:3000', RENDER:'true',
    RENDER_EXTERNAL_URL:'https://d-lorgia-app.onrender.com', NODE_ENV:'production',
    GOOGLE_OAUTH_ENABLED:'true', SUPABASE_URL:'https://mock.supabase.invalid',
    SUPABASE_PUBLISHABLE_KEY:'public-test', SUPABASE_SECRET_KEY:'private-test',
    SUPABASE_ANON_KEY:'', SUPABASE_SERVICE_ROLE_KEY:''
  }});
  try {
    let healthy=false;
    for(let i=0;i<85;i++){
      try {healthy=(await fetch(`http://127.0.0.1:${port}/health`)).ok;if(healthy)break;}catch{}
      await new Promise(resolve=>setTimeout(resolve,65));
    }
    assert.equal(healthy,true);
    const start=await fetch(`http://127.0.0.1:${port}/api/auth/google/start`,{redirect:'manual'});
    assert.equal(start.status,302);
    const target=new URL(start.headers.get('location'));
    const callback=new URL(target.searchParams.get('redirect_to'));
    assert.equal(callback.origin,'https://d-lorgia-app.onrender.com');
    assert.equal(callback.pathname,'/api/auth/google/callback');
    assert.equal(callback.searchParams.has('state'),true);
  } finally {server.kill('SIGTERM');}
});
