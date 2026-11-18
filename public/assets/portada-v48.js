(() => {
 const content = {
   orientador:{ number:'01',heading:'Conoce tus opciones',copy:'Personaliza un recorrido por tus intereses y descubre información orientativa sobre tratamientos.' },
   asesor:{ number:'02',heading:'Pregunta con confianza',copy:'Consulta dudas generales sobre tratamientos y cuidados. El Asesor no diagnostica ni reemplaza al especialista.' },
   citas:{ number:'03',heading:'Prepara tu evaluación',copy:'Organiza tu siguiente paso, encuentra la sede y envía una solicitud para que el equipo pueda atenderte.' }
 };
 const cube=document.getElementById('feature-cube');
 const h=document.getElementById('feature-heading'),p=document.getElementById('feature-copy'),n=document.getElementById('feature-number');
 function select(id){if(!content[id])return;cube.dataset.active=id;h.textContent=content[id].heading;p.textContent=content[id].copy;n.textContent=content[id].number;document.querySelectorAll('.feature-tabs [data-feature]').forEach(b=>{const selected=b.dataset.feature===id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});}
 document.querySelectorAll('[data-feature]').forEach(button=>{button.addEventListener('click',()=>select(button.dataset.feature));button.addEventListener('mouseenter',()=>select(button.dataset.feature));button.addEventListener('focus',()=>select(button.dataset.feature));});
 select('orientador');
})();
