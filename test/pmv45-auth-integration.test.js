import test from 'node:test';
import assert from 'node:assert/strict';

// Simulación del contrato HTTP de GoTrue/PostgREST, sin usar claves ni cuentas reales.
test('Supabase exige correo sin sesión y entra automáticamente solo cuando devuelve sesión', async () => {
  const originalFetch = globalThis.fetch;
  const original = {
    url:process.env.SUPABASE_URL,
    publishable:process.env.SUPABASE_PUBLISHABLE_KEY,
    secret:process.env.SUPABASE_SECRET_KEY
  };
  process.env.SUPABASE_URL='https://mock.supabase.invalid';
  process.env.SUPABASE_PUBLISHABLE_KEY='public-test-value';
  process.env.SUPABASE_SECRET_KEY='secret-test-value';
  let calls=0,profileCreated=0;
  globalThis.fetch=async (url,options={}) => {
    const parsed=new URL(url);calls++;
    if(parsed.pathname==='/rest/v1/profiles' && options.method!=='POST'){
      return new Response('[]',{status:200,headers:{'Content-Type':'application/json'}});
    }
    if(parsed.pathname==='/auth/v1/signup'){
      const body=JSON.parse(options.body);
      assert.ok(body.email.endsWith('@example.com'));
      const withoutSession=body.email.startsWith('waiting');
      const data=withoutSession
        ? {user:{id:'pending-user',email:body.email,user_metadata:body.data}}
        : {user:{id:'confirmed-user',email:body.email,user_metadata:body.data},access_token:'access-test',refresh_token:'refresh-test',expires_in:3600};
      return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
    }
    if(parsed.pathname==='/rest/v1/profiles' && options.method==='POST'){
      profileCreated++;
      return new Response(JSON.stringify([JSON.parse(options.body)]),{status:201,headers:{'Content-Type':'application/json'}});
    }
    throw new Error(`Unmocked ${options.method||'GET'} ${parsed.pathname}`);
  };
  try{
    const { registerRemote }=await import('../src/services/accounts.js');
    const pending=await registerRemote({name:'Paciente Test',email:'waiting@example.com',username:'waiting-test',password:'test-pass123'});
    assert.equal(pending.needsEmailConfirmation,true);
    assert.equal(pending.session,null);
    assert.equal(pending.profile,null);
    assert.equal(profileCreated,0,'No crear perfil persistente antes de verificar el email');
    const ready=await registerRemote({name:'Paciente Test',email:'ready@example.com',username:'ready-test',password:'test-pass123'});
    assert.equal(ready.needsEmailConfirmation,false);
    assert.equal(ready.session.access_token,'access-test');
    assert.equal(ready.profile.id,'confirmed-user');
    assert.equal(profileCreated,1);
    assert.ok(calls>=5);
  }finally{
    globalThis.fetch=originalFetch;
    for(const [k,v] of Object.entries({SUPABASE_URL:original.url,SUPABASE_PUBLISHABLE_KEY:original.publishable,SUPABASE_SECRET_KEY:original.secret})){
      if(v===undefined)delete process.env[k];else process.env[k]=v;
    }
  }
});
