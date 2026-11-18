/**
 * Importa fotografías suministradas y autorizadas por D’Lorgia, SIN descargarlas de terceros.
 * Uso: node scripts/instalar-fotos-autorizadas.mjs /ruta/a/carpeta-fotos
 * Nombres aceptados: acne, laser, face, pigment, botox, hair, tattoo, body, rosacea
 * + otros nombres usados en la galería: colormax-acne, colormax-manchas, ...
 * Solo JPEG, PNG y WebP; recomienda optimización previa (<500 KB por foto).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=process.argv[2] && path.resolve(process.argv[2]);
if(!source){console.error('Uso: node scripts/instalar-fotos-autorizadas.mjs /carpeta/de/fotos-autorizadas');process.exit(1);}
const mapping={
 'colormax-acne':'https://www.dlorgia.com/media/fotos/colormax-acne.jpg',
 'foto-depilacion-laser-piernas':'https://www.dlorgia.com/_astro/foto-depilacion-laser-piernas.Xf3VGFbS_1Ae6Ra.webp',
 'alta-frecuencia-facial-2':'https://www.dlorgia.com/media/fotos/alta-frecuencia-facial-2.jpg',
 'colormax-manchas':'https://www.dlorgia.com/media/fotos/colormax-manchas.jpg',
 'botox':'https://www.dlorgia.com/media/fotos/botox.jpg',
 'prp':'https://www.dlorgia.com/media/capilar/prp.jpg',
 'eliminacion-tatuajes-colormax':'https://www.dlorgia.com/media/fotos/eliminacion-tatuajes-colormax.jpg',
 'criolipolisis':'https://www.dlorgia.com/media/cuerpo/reduccion/criolipolisis.jpg',
 'ipl-rosacea':'https://www.dlorgia.com/media/fotos/ipl-rosacea.jpg',
 'acido-hialuronico-menton':'https://www.dlorgia.com/media/fotos/acido-hialuronico-menton.jpg',
 'foto-colormax-manchas':'https://www.dlorgia.com/_astro/foto-colormax-manchas.GNwEMkdA_L0tYv.webp',
 'copas-suecas-gluteos':'https://www.dlorgia.com/media/fotos/copas-suecas-gluteos.jpg',
 'portada-piel':'/assets/media/piel-editorial.svg',
 'portada-cuidado':'/assets/media/cuidado-editorial.svg',
 'portada-orientacion':'/assets/media/orientacion.svg',
 'portada-consulta':'/assets/media/consulta.svg',
 'portada-evaluacion':'/assets/media/evaluacion.svg',
 'portada-empresa':'/assets/media/empresa-editorial.svg'
};
const allowed=new Set(['.jpg','.jpeg','.png','.webp']);
const dest=path.join(root,'public/assets/fotos-oficiales');
await fs.mkdir(dest,{recursive:true});
let done=0;
const replacements=new Map();
const files=await fs.readdir(source,{withFileTypes:true});
for(const dirent of files){
 if(!dirent.isFile())continue;
 const ext=path.extname(dirent.name).toLowerCase();
 const stem=path.basename(dirent.name,ext).toLowerCase();
 if(!mapping[stem] || !allowed.has(ext))continue;
 const file=path.join(source,dirent.name);
 const stat=await fs.stat(file);
 if(stat.size>8*1024*1024){console.warn('Foto omitida por tamaño (>8 MB):',dirent.name);continue;}
 const bytes=await fs.readFile(file);
 const jpg=bytes[0]===0xff&&bytes[1]===0xd8;
 const png=bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'));
 const webp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
 if(!((ext==='.jpg'||ext==='.jpeg')&&jpg || ext==='.png'&&png || ext==='.webp'&&webp)){
   console.warn('Foto omitida: su contenido no coincide con la extensión:',dirent.name);continue;
 }
 await fs.writeFile(path.join(dest,dirent.name),bytes);
 replacements.set(mapping[stem],'/assets/fotos-oficiales/'+dirent.name);
 done++;
}
if(done){
 for(const rel of ['public/portada.html','public/conoce.html','public/experiencias.html','public/sedes.html','public/assets/dlorgia-imagery46.js']){
   const target=path.join(root,rel);
   let html=await fs.readFile(target,'utf8');
   for(const [oldUrl,newUrl] of replacements)html=html.replaceAll(oldUrl,newUrl);
   await fs.writeFile(target,html);
 }
}
console.log(`${done} fotografías autorizadas importadas como archivos locales. Prueba /conoce, /experiencias, /sedes y /app.`);
