// Biblioteca visual v5.1: fotografías aportadas por el equipo, referenciales.
// No equiparar fotografías genéricas con personal de la empresa ni con resultados clínicos.
const photos = Object.freeze({
  facial:'/assets/fotos-dlorgia/facial-cosmetologia.webp',
  corporal:'/assets/fotos-dlorgia/equipo-tecnologia-corporal.webp',
  capilar:'/assets/fotos-dlorgia/consulta-capilar.webp',
  cabello:'/assets/fotos-dlorgia/caida-cabello.webp',
  laser:'/assets/fotos-dlorgia/depilacion-pierna.webp',
  tatuajes:'/assets/fotos-dlorgia/eliminacion-tatuaje.webp',
  equipo:'/assets/fotos-dlorgia/huancayo-consultorio-01.webp'
});
export function officialTreatmentImage(item){
 const key=((item?.name||'')+' '+(item?.category||'')).toLowerCase();
 if(/tatuaje/.test(key)) return photos.tatuajes;
 if(/depil/.test(key)) return photos.laser;
 if(/capilar|cabello|alopecia|pelo/.test(key)) return photos.capilar;
 if(/corporal|abdomen|celulitis|reduc|flacidez|grasa|lipo/.test(key)) return photos.corporal;
 return photos.facial;
}
export function handleOfficialImageError(img){
 if(!img)return;
 img.removeAttribute('src');
 img.style.display='none';
 img.parentElement?.classList.add('official-image-unavailable');
}
