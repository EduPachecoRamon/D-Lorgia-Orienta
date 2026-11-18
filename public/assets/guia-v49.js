(() => {
 const steps=[
  {title:'Crea una cuenta para guardar tu recorrido.',description:'Puedes entrar con Google o con correo. Si todavía no tienes cuenta, selecciona «Crear cuenta». Es posible que tengas que verificar tu dirección de correo antes de acceder.',link:'/app?mode=register',action:'Crear cuenta ↗'},
  {title:'Explora los servicios y aclara tus dudas.',description:'El Orientador organiza información según tus preferencias. El Asesor responde preguntas generales y te ayuda a preparar las dudas que quieras conversar con D’Lorgia. Ninguno sustituye un diagnóstico profesional.',link:'/app',action:'Abrir Orientador y Asesor ↗'},
  {title:'Solicita una evaluación y continúa tu recorrido.',description:'Consulta las sedes y envía una solicitud. Comprueba con el equipo la confirmación del horario; hasta entonces no es una cita reservada. Puedes guardar tus orientaciones en «Mi espacio».',link:'/app',action:'Ir a D’Lorgia Orienta ↗'}
 ];
 let active=0;
 const title=document.getElementById('guide-title'),desc=document.getElementById('guide-description'),count=document.getElementById('guide-count'),action=document.getElementById('guide-action');
 const tabs=[...document.querySelectorAll('[data-step]')],prev=document.getElementById('guide-prev'),next=document.getElementById('guide-next');
 function render(index){active=Math.max(0,Math.min(steps.length-1,index));const s=steps[active];title.textContent=s.title;desc.textContent=s.description;count.textContent=`PASO ${active+1} DE ${steps.length}`;action.replaceChildren();const link=document.createElement('a');link.href=s.link;link.className='btn btn-main';link.textContent=s.action;action.append(link);prev.disabled=active===0;next.disabled=active===steps.length-1;tabs.forEach((tab,i)=>{if(i===active)tab.setAttribute('aria-current','step');else tab.removeAttribute('aria-current')})}
 tabs.forEach((t,i)=>t.addEventListener('click',()=>render(i)));
 prev.addEventListener('click',()=>render(active-1));next.addEventListener('click',()=>render(active+1));
 render(0);
})();
