import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';

const rows=[
  {id:'admin-id',email:'gerencia@example.com',username:'gerencia',name:'Gerencia',role:'admin',branch:'huancayo',created_at:'2026-11-01T09:00:00Z'},
  {id:'patient-id',email:'persona@example.com',username:'persona',name:'Persona',role:'patient',branch:'huancayo',created_at:'2026-11-03T12:00:00Z'}
];
const logs=[];
const json=(res,code,value,extra={})=>{res.writeHead(code,{'Content-Type':'application/json',...extra});res.end(JSON.stringify(value))};
function mockSupabase(){return http.createServer(async(req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1');
  const chunks=[];for await(const c of req)chunks.push(c);
  let payload={};try{payload=JSON.parse(Buffer.concat(chunks).toString()||'{}')}catch{}
  const token=String(req.headers.authorization||'').replace('Bearer ','');
  if(u.pathname==='/auth/v1/user'){
    const key=token==='tok-admin'?'admin-id':token==='tok-patient'?'patient-id':null;
    if(!key)return json(res,401,{error:'invalid token'});
    const r=rows.find(x=>x.id===key);
    return json(res,200,{id:r.id,email:r.email,user_metadata:{name:r.name,username:r.username}});
  }
  if(u.pathname==='/rest/v1/profiles'){
    if(req.method==='POST'){
      const r=rows.find(x=>x.id===payload.id);if(r)Object.assign(r,payload);else rows.push(payload);
      return json(res,201,[r||payload]);
    }
    let matched=rows.slice();
    const id=u.searchParams.get('id');if(id?.startsWith('eq.'))matched=matched.filter(x=>x.id===id.slice(3));
    const role=u.searchParams.get('role');if(role?.startsWith('eq.'))matched=matched.filter(x=>x.role===role.slice(3));
    if(req.method==='PATCH'){
      matched.forEach(x=>Object.assign(x,payload));return json(res,200,matched);
    }
    if(u.searchParams.has('order'))matched.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
    const total=matched.length;
    if(u.searchParams.has('offset'))matched=matched.slice(Number(u.searchParams.get('offset')));
    if(u.searchParams.has('limit'))matched=matched.slice(0,Number(u.searchParams.get('limit')));
    return json(res,200,matched,req.headers.prefer?.includes('count=exact')?{'Content-Range':`0-${Math.max(0,matched.length-1)}/${total}`}:{})
  }
  if(u.pathname==='/rest/v1/journey_events'){
    if(req.method==='POST')logs.push(payload);
    return json(res,req.method==='POST'?201:200,req.method==='POST'?[payload]:logs);
  }
  return json(res,404,{message:'Not found mock'});
})}

async function listen(server){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return server.address().port}
async function waitUntilHealthy(base){for(let i=0;i<100;i++){
  try{const r=await fetch(base+'/health');if(r.ok)return;}catch{}
  await delay(80)
}throw new Error('Local app did not start')}

test('rutas y control real de permisos vía HTTP y Supabase simulado',async t=>{
  const mock=mockSupabase(),mockPort=await listen(mock);
  t.after(()=>new Promise(resolve=>mock.close(resolve)));
  const probe=http.createServer((_req,res)=>res.end());const appPort=await listen(probe);await new Promise(resolve=>probe.close(resolve));
  const app=spawn(process.execPath,['src/server.js'],{
    cwd:new URL('..',import.meta.url).pathname,
    env:{...process.env,PORT:String(appPort),SUPABASE_URL:`http://127.0.0.1:${mockPort}`,SUPABASE_PUBLISHABLE_KEY:'public-test',SUPABASE_SECRET_KEY:'secret-test',DLORGIA_ADMIN_EMAILS:'gerencia@example.com'},
    stdio:['ignore','pipe','pipe']
  });
  let stderr='';app.stderr.on('data',c=>stderr+=c.toString());
  t.after(()=>{app.kill('SIGTERM')});
  const base=`http://127.0.0.1:${appPort}`;
  try{await waitUntilHealthy(base)}catch(e){throw new Error(e.message+' '+stderr)}
  const route=async(path,token,method='GET',body)=>{
    const r=await fetch(base+path,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
    return {status:r.status,data:await r.json()};
  };
  for(const p of ['/conoce','/experiencias','/sedes','/ayuda']){
    const r=await fetch(base+p);assert.equal(r.status,200,p)
  }
  assert.equal((await route('/api/admin/team?page=1','tok-patient')).status,403,'paciente no accede al directorio');
  const team=await route('/api/admin/team?page=1','tok-admin');
  assert.equal(team.status,200);assert.equal(team.data.total,2);assert.equal(team.data.items.length,2);
  const invalid=await route('/api/admin/users/patient-id/role','tok-admin','PATCH',{role:'admin-superuser'});
  assert.equal(invalid.status,400);
  const denied=await route('/api/admin/users/patient-id/role','tok-patient','PATCH',{role:'admin'});
  assert.equal(denied.status,403);
  const changed=await route('/api/admin/users/patient-id/role','tok-admin','PATCH',{role:'admin'});
  assert.equal(changed.status,200);assert.equal(changed.data.item.role,'admin');
  assert.equal(rows.find(r=>r.id==='patient-id').role,'admin');
  assert.equal(logs.at(-1).event_type,'user_role_changed');
  // El usuario promovido obtiene acceso al panel solo después de validación en backend.
  assert.equal((await route('/api/admin/team','tok-patient')).status,200);
  // Nunca se permite degradar la propia cuenta ni un correo principal de gerencia.
  assert.equal((await route('/api/admin/users/admin-id/role','tok-admin','PATCH',{role:'patient'})).status,409);
});
