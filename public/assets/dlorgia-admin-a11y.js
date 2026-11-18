/* D’Lorgia shared visual preferences — no server data or private information collected. */
const KEY='dlorgia:a11y:v1';
const panel=document.querySelector('#admin-a11y-panel');
const buttons=[document.querySelector('#admin-a11y-trigger'),document.querySelector('#admin-login-a11y')].filter(Boolean);
const close=document.querySelector('#admin-a11y-close');
const controls={largeText:document.querySelector('#admin-large-text'),highContrast:document.querySelector('#admin-high-contrast'),reduceMotion:document.querySelector('#admin-reduce-motion')};
const defaults={largeText:false,highContrast:false,reduceMotion:false};
function read(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}
function update(state){
 document.body.classList.toggle('a11y-large-text',Boolean(state.largeText));
 document.body.classList.toggle('a11y-high-contrast',Boolean(state.highContrast));
 document.body.classList.toggle('dlorgia-motion-paused',Boolean(state.reduceMotion));
 for(const [key,input] of Object.entries(controls)){if(input)input.checked=Boolean(state[key]);}
}
function toggle(force){if(!panel)return;const open=typeof force==='boolean'?force:panel.classList.contains('hidden');panel.classList.toggle('hidden',!open);for(const b of buttons)b.setAttribute('aria-expanded',String(open));if(open)controls.largeText?.focus();}
buttons.forEach(b=>b.addEventListener('click',()=>toggle()));
close?.addEventListener('click',()=>{toggle(false);buttons.find(b=>b.offsetParent!==null)?.focus()});
for(const [key,input] of Object.entries(controls)) input?.addEventListener('change',()=>{
 const next={...read(),[key]:input.checked};
 try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}
 update(next);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel?.classList.contains('hidden'))toggle(false)});
document.addEventListener('click',e=>{if(panel?.classList.contains('hidden'))return;if(panel.contains(e.target)||buttons.some(b=>b.contains(e.target)))return;toggle(false)});
update(read());
