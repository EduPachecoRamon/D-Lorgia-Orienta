// Biblioteca contextual v5.2: cada ficha tiene un recurso propio y una descripción honesta.
// Fotos del material proporcionado por D’Lorgia; pueden ser de referencia, no del tratamiento exacto.
const root = '/assets/fotos-dlorgia/';
const visualById = Object.freeze({
  cleansing: { file:'facial-cosmetologia.webp', label:'Fotografía de referencia · cuidado facial' },
  rejuvenation: { file:'huancayo-consultorio-02.webp', label:'Ambiente de atención en D’Lorgia Huancayo' },
  acne: { file:'piel-marcas-acne.webp', label:'Imagen educativa · textura de la piel' },
  spots: { file:'facial-cosmetologia.webp', label:'Cuidado facial · imagen de referencia; no representa un resultado' },
  body: { file:'equipo-tecnologia-corporal.webp', label:'Equipo estético · imagen de referencia' },
  hair: { file:'consulta-capilar.webp', label:'Exploración capilar · imagen de referencia' },
  laser: { file:'depilacion-pierna.webp', label:'Depilación · imagen de referencia' },
  tattoo: { file:'eliminacion-tatuaje.webp', label:'Procedimiento sobre tatuaje · imagen de referencia' }
});
const otherByCategory = Object.freeze({
  Piel: {file:'facial-cosmetologia.webp', label:'Cuidado facial · imagen de referencia'},
  Corporal: {file:'equipo-tecnologia-corporal.webp',label:'Cuidado corporal · imagen de referencia'},
  Capilar: {file:'consulta-capilar.webp',label:'Cuidado capilar · imagen de referencia'},
  'Depilación': {file:'depilacion-pierna.webp',label:'Depilación · imagen de referencia'},
  Tatuajes: {file:'eliminacion-tatuaje.webp',label:'Tatuajes · imagen de referencia'}
});
export function treatmentPhotoInfo(item) {
  const photo=visualById[item?.id] || otherByCategory[item?.category] || null;
  return photo ? { src:root+photo.file, caption:photo.label } : null;
}
// Solo en el catálogo: comparación educativa de manchas. No usar en Inicio ni en el Orientador.
export function catalogTreatmentPhotoInfo(item) {
  if (item?.id === 'spots') return { src:root+'piel-manchas-comparativa.webp', caption:'Comparación ilustrativa · resultados individuales variables, no garantizados' };
  return treatmentPhotoInfo(item);
}
export function officialTreatmentImage(item) { return treatmentPhotoInfo(item)?.src || ''; }
export function handleOfficialImageError(img) {
  if(!img) return;
  img.removeAttribute('src');
  img.style.display='none';
  img.parentElement?.classList.add('official-image-unavailable');
}
