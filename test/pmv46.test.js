import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');

test('una cuenta pública no puede elegir rol admin',()=>{
  const accounts=read('src/services/accounts.js');
  const schema=read('supabase/schema.sql');
  const server=read('src/server.js');
  assert.match(accounts,/const role = config\.adminEmails\.includes\(email\) \? 'admin' : \(existing\?\.role \|\| 'patient'\)/);
  assert.doesNotMatch(accounts,/metadata\.role|user\.user_metadata\?\.role/);
  assert.match(schema,/role text not null default 'patient'/);
  assert.match(schema,/grant update \(name, branch, response_style, guidance_style\)/);
  assert.match(server,/await requireAdmin\(req\)/);
  assert.match(server,/userRoleMatch/);
});

test('nuevo módulo de equipo incluye paginación, confirmación y auditoría',()=>{
  const admin=read('public/admin.html');
  const js=read('public/assets/admin-v420.js');
  const server=read('src/server.js');
  for(const id of ['team-table','team-total','team-prev','team-next','team-role-dialog'])assert.match(admin,new RegExp('id="'+id+'"'));
  assert.match(js,/loadTeam/);
  assert.match(js,/applyTeamRoleChange/);
  assert.match(server,/\/api\/admin\/team/);
  assert.match(server,/limit=\$\{pageSize\}&offset=\$\{\(page-1\)\*pageSize\}/);
  assert.match(server,/user_role_changed/);
  assert.match(server,/targetId === adminAuth\.user\.id/);
});

test('galería oficial, sedes y catálogo con imágenes de respaldo',()=>{
  const gallery=read('public/experiencias.html');
  const site=read('public/sedes.html');
  const fallback=read('public/assets/dlorgia-gallery46.js');
  const imagery=read('public/assets/dlorgia-imagery46.js');
  const html=read('public/index.html');
  assert.ok((gallery.match(/data-official-photo/g)||[]).length>=12);
  assert.match(gallery,/www\.dlorgia\.com/);
  assert.match(site,/Huancayo/);
  assert.match(site,/Piura/);
  assert.match(site,/Pucallpa/);
  assert.match(fallback,/official-image-unavailable/);
  assert.match(imagery,/officialTreatmentImage/);
  assert.match(html,/dlorgia-imagery46\.css/);
  for(const name of ['experiencias.html','sedes.html','dlorgia-gallery46.css','dlorgia-gallery46.js'])assert.ok(existsSync(path.join(root,'public',name.includes('.')&&name.endsWith('.html')?'': 'assets',name)));
});

test('PWA incluye las pantallas sin agregar un servicio de pago',()=>{
  const sw=read('public/service-worker.js');
  assert.match(sw,/dlorgia-orienta-v500-enfoque/);
  assert.match(sw,/'\/experiencias'/);
  assert.match(sw,/'\/sedes'/);
  assert.match(sw,/dlorgia-admin-pmv46\.css/);
});
