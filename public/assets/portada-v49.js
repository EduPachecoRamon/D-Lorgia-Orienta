(() => {
 'use strict';
 const content = {
  orientador: {number:'01 / 03', heading:'Orientador Personal',copy:'Completa tus preferencias y descubre información orientativa sobre los servicios que se relacionan con lo que te interesa. No es un diagnóstico.'},
  asesor: {number:'02 / 03',heading:'Asesor D’Lorgia',copy:'Haz preguntas generales sobre los tratamientos, entiende conceptos y organiza lo que quieres consultar. Las recomendaciones clínicas corresponden al profesional.'},
  citas: {number:'03 / 03',heading:'Solicitud de evaluación',copy:'Consulta las sedes, prepara tus preguntas y envía una solicitud para continuar con el equipo. El horario solo queda confirmado cuando D’Lorgia lo valida.'}
 };
 const cube=document.querySelector('#feature-cube');
 const heading=document.querySelector('#feature-heading'),copy=document.querySelector('#feature-copy'),number=document.querySelector('#feature-number');
 const buttons=[...document.querySelectorAll('[data-feature]')];
 function select(id) {
  if(!content[id]||!cube)return;
  cube.dataset.active=id;
  heading.textContent=content[id].heading;
  copy.textContent=content[id].copy;
  number.textContent=content[id].number;
  buttons.forEach(button=>{
   const active=button.dataset.feature===id;
   button.classList.toggle('is-active',active&&button.classList.contains('cube-face'));
   button.classList.toggle('selected',active&&button.closest('.feature-tabs'));
   button.setAttribute('aria-pressed',String(active));
  });
 }
 buttons.forEach(button=>{
  const activate=()=>select(button.dataset.feature);
  button.addEventListener('click',activate);
  button.addEventListener('mouseenter',activate);
  button.addEventListener('focus',activate);
 });
 // No se fuerza una cara sólida al cargar: el usuario descubre las funciones al explorar.
 document.querySelectorAll('.photo-frame img').forEach(img=>{
  const fallback=()=>img.closest('.photo-frame')?.classList.add('is-unavailable');
  img.addEventListener('error',fallback,{once:true});
  if(img.complete&&!img.naturalWidth)fallback();
 });
})();
