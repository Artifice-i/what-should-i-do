import {categories} from './activities.js';
import {recommend} from './engine.js';
const form=document.querySelector('form'),result=document.querySelector('#result');
const rejected=new Set(),accepted=new Set();let current=[],lastInput;
document.querySelector('#interests').innerHTML=categories.map(c=>'<label class="chip"><input type="checkbox" name="interests" value="'+c+'"><span>'+c+'</span></label>').join('');
form.energy.addEventListener('input',()=>document.querySelector('#energy-value').textContent=form.energy.value+' / 10');
function inputs(){const data=new FormData(form);const p=Object.fromEntries(data);p.interests=data.getAll('interests');for(const k of ['energy','time','budget','mental','physical'])p[k]=Number(p[k]);return p;}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function card(a,primary){return '<article class="'+(primary?'primary':'alternative')+'">'+(primary?'<div class="eyebrow">YOUR BEST FIT</div>':'')+'<'+(primary?'h2':'h3')+'>'+escape(a.title)+'</'+(primary?'h2':'h3')+'><div class="meta"><span>'+a.minutes+' min</span><span>'+(a.cost?'~$'+a.cost:'Free*')+'</span><span>'+escape(a.category)+'</span></div><p class="description">'+escape(a.step)+'</p><div class="why"><strong>Why this fits</strong>'+escape(a.reasons)+'</div><div class="feedback"><button data-action="accept" data-id="'+a.id+'">'+(accepted.has(a.id)?'✓ Enjoy your time':'Sounds good')+'</button><button data-action="reject" data-id="'+a.id+'">Not feeling it</button></div></article>';}
function render(message=''){
 result.classList.remove('reveal');
 result.innerHTML=current.length?card(current[0],true)+(current.length>1?'<p class="alternative-title">Two other directions</p><div class="alternatives">'+current.slice(1).map(a=>card(a,false)).join('')+'</div>':''):'<div class="empty"><div class="eyebrow">A LITTLE MORE ROOM?</div><h2>No good match right now.</h2><p>'+(lastInput.health!=='well'&&lastInput.place==='out'?'Rest mode keeps suggestions at home. Choose “Stay home” or “Either is fine” to see restful options.':'Try allowing more time, a different setting, or different company. Your limits are never silently ignored.')+'</p></div>';
 if(current.length&&current.length<3)message+=(message?' ':'')+'Only '+current.length+' compatible '+(current.length===1?'activity remains':'activities remain')+'. Try widening a limit for more options.';
 result.insertAdjacentHTML('beforeend','<p class="notice">'+escape(message||'Start small. You can always do more if it feels right.')+'</p>'+(current.length?'<p class="footnote">*Free assumes you already have the materials or access. Prices are estimates.</p>':'')+(rejected.size?'<button class="reset" data-action="reset">Clear '+rejected.size+' session rejection'+(rejected.size===1?'':'s')+'</button>':''));
 requestAnimationFrame(()=>result.classList.add('reveal'));
}
function run(){lastInput=inputs();current=recommend(lastInput,rejected);render();return current.map(({id,title,reasons})=>({id,title,reasons}));}
form.addEventListener('submit',e=>{e.preventDefault();run();if(innerWidth<651)document.querySelector('.results').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
result.addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 if(button.dataset.action==='reset'){rejected.clear();run();return;}
 const id=button.dataset.id;
 if(button.dataset.action==='accept'){accepted.add(id);render('Good choice. Your next step is right there in the card.');return;}
 rejected.add(id);accepted.delete(id);
 const replacements=recommend(lastInput,new Set([...rejected,...current.filter(a=>a.id!==id).map(a=>a.id)]));
 current=current.flatMap(a=>a.id===id?(replacements[0]?[replacements[0]]:[]):[a]);
 render('Set aside for this session. The other suggestions stay put.');
});
result.innerHTML='<div class="empty"><div class="eyebrow">LESS BROWSING. MORE DOING.</div><h2>A good next thing<br>is closer than you think.</h2><p>Use the starting settings, or change a few details to match your moment.</p><p>You’ll get one top pick and two different directions to try.</p></div>';
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'recommend_from_checkin',description:'Generate activity recommendations using the current visible check-in settings.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||Object.keys(input).length)throw Error('Expected an empty object');return run();}})).catch(()=>{});}catch{}}
