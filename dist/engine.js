import {activities} from './activities.js';
export const defaults={energy:5,time:60,budget:0,health:'well',place:'any',mood:'undecided',social:'any',mental:0,physical:0,interests:[]};
// Hard limits never relax silently. Preferences rank eligible activities.
export function rank(input, rejected=new Set()){
 const p={...defaults,...input};
 return activities.filter(a=>!rejected.has(a.id)&&a.minutes<=p.time&&a.cost<=p.budget
  &&(p.place==='any'||a.place===p.place)
  &&(p.social==='any'||a.social===p.social)
  &&(p.health==='well'||(a.rest&&a.place==='home'&&a.physical===1&&a.energy<=(p.health==='sick'?4:5)))
  &&a.energy<=Number(p.energy)+2).map(a=>{
   let score=50-Math.abs(a.energy-p.energy)*4;
   if(p.mental)score-=Math.abs(a.mental-p.mental)*12;
   if(p.physical)score-=Math.abs(a.physical-p.physical)*12;
   if(a.moods.includes(p.mood))score+=15;
   if(p.interests.includes(a.category))score+=22;
   score+=Math.min(a.minutes/p.time,1)*6;
   return {...a,score,reasons:explain(a,p)};
  }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
function explain(a,p){
 const reasons=[];
 if(p.health!=='well') reasons.push('A restful option at home with no physical exertion');
 else reasons.push(a.energy<=3?'Keeps the effort low':Math.abs(a.energy-p.energy)<=2?'Matches your current energy':'Fits within your energy limit');
 if(p.mental&&a.mental===Number(p.mental))reasons.push(['','lets your mind switch off','offers a little mental engagement','gives your mind a challenge'][a.mental]);
 if(p.physical&&a.physical===Number(p.physical))reasons.push(['','needs very little movement','adds gentle movement','gives you an active outlet'][a.physical]);
 if(a.moods.includes(p.mood))reasons.push('suits a '+p.mood+' mood');
 if(p.interests.includes(a.category))reasons.push('fits your interest in '+a.category.toLowerCase());
 if(p.social!=='any')reasons.push(a.social==='social'?'makes room for connection':'gives you solo time');
 reasons.push(a.minutes+' minutes'+(a.cost===0?' with no planned spend':' at about $'+a.cost));
 return reasons.join('; ')+'.';
}
export function recommend(input,rejected=new Set()){
 const pool=rank(input,rejected),picked=[];
 while(pool.length&&picked.length<3){
 // Modest diversity bonus: favor different experiences without overriding a strong fit.
 pool.sort((a,b)=>(b.score-picked.filter(x=>x.category===b.category).length*9)-(a.score-picked.filter(x=>x.category===a.category).length*9)||a.id.localeCompare(b.id));
 picked.push(pool.shift());
 }
 return picked;
}
