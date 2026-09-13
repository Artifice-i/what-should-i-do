import {categories} from './activities.js';
import {recommend} from './engine.js';
const form=document.querySelector('form'),result=document.querySelector('#result');
const rejected=new Set(),accepted=new Set();let current=[],lastInput;
document.querySelector('#interests').innerHTML=categories.map(c=>'<label class="chip"><input type="checkbox" name="interests" value="'+c+'"><span>'+c+'</span></label>').join('');
form.energy.addEventListener('input',()=>document.querySelector('#energy-value').textContent=form.energy.value+' / 10');
const soundToggle=document.createElement('button');
soundToggle.type='button';
soundToggle.className='sound-toggle';
soundToggle.setAttribute('aria-pressed','true');
soundToggle.textContent='♪ Sound on';
document.querySelector('.results').insertBefore(soundToggle,result);
let soundEnabled=true,audioContext,activeVoices=[];
function stopFanfare(){
 for(const voice of activeVoices){try{voice.stop();}catch{}}
 activeVoices=[];
}
soundToggle.addEventListener('click',()=>{
 soundEnabled=!soundEnabled;
 soundToggle.setAttribute('aria-pressed',String(soundEnabled));
 soundToggle.textContent=soundEnabled?'♪ Sound on':'♪ Sound off';
 if(!soundEnabled)stopFanfare();
});
async function fanfare(){
 if(!soundEnabled)return;
 try{
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)return;
 audioContext??=new Audio();
 stopFanfare();
 await audioContext.resume();
 if(!soundEnabled)return;
 const now=audioContext.currentTime;
 // A soft rising C-major flourish, synthesized locally.
 [[523.25,0,.14],[659.25,.13,.14],[783.99,.26,.18],[1046.5,.43,.5]].forEach(([frequency,offset,duration])=>{
 const voice=audioContext.createOscillator(),gain=audioContext.createGain();
 voice.type='triangle';voice.frequency.value=frequency;
 gain.gain.setValueAtTime(0,now+offset);
 gain.gain.linearRampToValueAtTime(.07,now+offset+.018);
 gain.gain.exponentialRampToValueAtTime(.001,now+offset+duration);
 voice.connect(gain);gain.connect(audioContext.destination);
 activeVoices.push(voice);
 voice.onended=()=>{voice.disconnect();gain.disconnect();activeVoices=activeVoices.filter(v=>v!==voice);};
 voice.start(now+offset);voice.stop(now+offset+duration+.02);
 });
 }catch{/* Celebration must never interrupt accepting an activity. */}
}
function celebrate(button){
 void fanfare();
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.querySelector('.confetti-layer')?.remove();
 const rect=button.getBoundingClientRect(),layer=document.createElement('div');
 layer.className='confetti-layer';layer.setAttribute('aria-hidden','true');
 Object.assign(layer.style,{position:'fixed',inset:'0',pointerEvents:'none',overflow:'hidden',zIndex:'1000'});
 document.body.append(layer);
 const colors=['#284de5','#d7ef9a','#ffcc57','#ff829b','#83dbe8'];
 for(let i=0;i<48;i++){
 const piece=document.createElement('i');
 const dx=(Math.random()-.5)*360,up=60+Math.random()*130;
 Object.assign(piece.style,{position:'absolute',left:rect.left+rect.width/2+'px',top:rect.top+rect.height/2+'px',width:'7px',height:'11px',background:colors[i%colors.length],borderRadius:i%3===0?'50%':'2px'});
 layer.append(piece);
 piece.animate([
 {transform:'translate(-50%,-50%) rotate(0deg)',opacity:1},
 {transform:'translate('+dx*.55+'px,'+-up+'px) rotate(180deg)',opacity:1,offset:.4},
 {transform:'translate('+dx+'px,'+(80+Math.random()*100)+'px) rotate('+(360+Math.random()*360)+'deg)',opacity:0}
 ],{duration:950+Math.random()*350,easing:'cubic-bezier(.2,.6,.4,1)',fill:'forwards'});
 }
 setTimeout(()=>layer.remove(),1400);
}
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
 if(button.dataset.action==='accept'){celebrate(button);accepted.add(id);render('Good choice. Your next step is right there in the card.');result.querySelector('[data-action=accept][data-id='+id+']')?.focus({preventScroll:true});return;}
 rejected.add(id);accepted.delete(id);
 const replacements=recommend(lastInput,new Set([...rejected,...current.filter(a=>a.id!==id).map(a=>a.id)]));
 current=current.flatMap(a=>a.id===id?(replacements[0]?[replacements[0]]:[]):[a]);
 render('Set aside for this session. The other suggestions stay put.');
});
result.innerHTML='<div class="empty"><div class="eyebrow">LESS BROWSING. MORE DOING.</div><h2>A good next thing<br>is closer than you think.</h2><p>Use the starting settings, or change a few details to match your moment.</p><p>You’ll get one top pick and two different directions to try.</p></div>';
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'recommend_from_checkin',description:'Generate activity recommendations using the current visible check-in settings.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||Object.keys(input).length)throw Error('Expected an empty object');return run();}})).catch(()=>{});}catch{}}

