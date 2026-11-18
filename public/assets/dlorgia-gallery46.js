/* Fotos enlazadas al dominio oficial; respaldo local si la imagen falla. */
document.querySelectorAll('img[data-official-photo]').forEach(image => {
  image.addEventListener('error', () => { image.src = '/assets/dlorgia-atmosphere.webp'; image.classList.add('official-image-fallback'); }, {once:true});
});
// Filtros y búsqueda instantánea sin llamadas a API ni datos personales.
const filters = [...document.querySelectorAll('[data-gallery-filter]')];
const search = document.querySelector('#gallery-search');
let currentGroup = 'Todos';
const clean = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function filterGallery() {
  const terms = clean(search?.value).split(/\s+/).filter(Boolean);
  let visible = 0;
  document.querySelectorAll('.photo-card').forEach(card => {
    const category = currentGroup === 'Todos' || card.dataset.group === currentGroup;
    const text = clean(card.textContent);
    const match = category && terms.every(term => text.includes(term));
    card.hidden = !match;
    if (match) visible++;
  });
  const label = document.querySelector('#gallery-result-count');
  if (label) label.textContent = visible ? `${visible} ${visible === 1 ? 'servicio disponible' : 'servicios disponibles'}` : 'No encontramos resultados. Prueba otra búsqueda.';
}
filters.forEach(button => button.addEventListener('click', () => {
  currentGroup = button.dataset.galleryFilter;
  filters.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  filterGallery();
}));
search?.addEventListener('input', filterGallery);
filterGallery();
