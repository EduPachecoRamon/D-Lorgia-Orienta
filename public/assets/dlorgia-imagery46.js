// Referencias a fotografías publicadas en el sitio oficial de DLorgia.
// El respaldo local evita tarjetas vacías si el sitio cambia su estructura.
const officialImages = {
  acne:'https://www.dlorgia.com/media/fotos/colormax-acne.jpg',
  laser:'https://www.dlorgia.com/_astro/foto-depilacion-laser-piernas.Xf3VGFbS_1Ae6Ra.webp',
  face:'https://www.dlorgia.com/media/fotos/alta-frecuencia-facial-2.jpg',
  pigment:'https://www.dlorgia.com/media/fotos/colormax-manchas.jpg',
  botox:'https://www.dlorgia.com/media/fotos/botox.jpg',
  hair:'https://www.dlorgia.com/media/capilar/prp.jpg',
  tattoo:'https://www.dlorgia.com/media/fotos/eliminacion-tatuajes-colormax.jpg',
  body:'https://www.dlorgia.com/media/cuerpo/reduccion/criolipolisis.jpg',
  rosacea:'https://www.dlorgia.com/media/fotos/ipl-rosacea.jpg'
};
export function officialTreatmentImage(item){
  const key=((item?.name||'')+' '+(item?.category||'')).toLowerCase();
  if(/acné|acne|secuela|cicatriz/.test(key))return officialImages.acne;
  if(/mancha|pigment|melasma/.test(key))return officialImages.pigment;
  if(/rosácea|rosacea|rojec/.test(key))return officialImages.rosacea;
  if(/depil/.test(key))return officialImages.laser;
  if(/capilar|cabello|alopecia/.test(key))return officialImages.hair;
  if(/tatuaje/.test(key))return officialImages.tattoo;
  if(/corporal|reducci|celulitis|glúteo|flacidez|abdomen/.test(key))return officialImages.body;
  if(/botox|bótox|arrugas|rejuven|hialur/.test(key))return officialImages.botox;
  return officialImages.face;
}
export function handleOfficialImageError(img){
  if(!img)return;
  img.src='/assets/dlorgia-atmosphere.webp';
  img.classList.add('official-image-fallback');
}
