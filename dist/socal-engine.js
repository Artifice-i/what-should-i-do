import {defaults,rank as rankV1} from './engine.js';
import {localActivities} from './socal-activities.js';
const outdoor=new Set(['walk','park','explore','social-walk','sport','hike','picnic']);
export function travelMinutes(a,area){return a.place==='home'?0:!a.area?20:area==='any'?120:a.area===area?30:90;}
export function rankSocal(input={},rejected=new Set()){
 const p={...defaults,area:'any',day:new Date().getDay(),weather:'unknown',...input};
 // Reuse V1 eligibility and explanations for originals, without modifying the V1 engine.
 const originals=rankV1(p,rejected).map(a=>({...a,setting:a.place==='home'?'indoor':outdoor.has(a.id)?'outdoor':a.id==='drive'?'mixed':'indoor'}));
 const locals=localActivities.filter(a=>!rejected.has(a.id)&&p.health==='well'&&p.place!=='home'&&(p.social==='any'||p.social===a.social)&&a.energy<=Number(p.energy)+2&&(!a.days||a.days.includes(Number(p.day)))).map(a=>{
 let score=50-Math.abs(a.energy-p.energy)*4;
 if(p.mental)score-=Math.abs(a.mental-p.mental)*12;
 if(p.physical)score-=Math.abs(a.physical-p.physical)*12;
 if(a.moods.includes(p.mood))score+=15;
 if(p.interests.includes(a.category))score+=22;
 score+=Math.min(a.minutes/p.time,1)*6;
 return {...a,score,reasons:'Fits your energy limit'+(p.interests.includes(a.category)?'; matches your interest in '+a.category.toLowerCase():'')+(a.moods.includes(p.mood)?'; suits a '+p.mood+' mood':'')+'.'};
 });
 return [...originals,...locals].map(a=>{
 const travel=travelMinutes(a,p.area),travelCost=a.area?10:0,totalMinutes=a.minutes+travel,totalCost=a.cost+travelCost;
 let score=a.score,reasons=a.reasons;
 if(a.area){score+=6;if(a.area===p.area){score+=14;reasons+=' In your selected starting area.';}}
 if(a.weekly){score+=10;reasons+=' Matches the usual Wednesday/Saturday morning pattern; confirm the date and hours.';}
 if(p.weather==='sunny'||p.weather==='cloudy'){if(a.setting==='outdoor'){score+=8;reasons+=' Outdoor time suits your selected weather.';}}
 if(p.weather==='rain'||p.weather==='hot'){if(a.setting==='indoor'){score+=10;reasons+=' Indoor time suits your selected weather.';}}
 if(p.weather==='unknown')reasons+=' Weather is unconfirmed.';
 if(travel)reasons+=' '+a.minutes+' min activity + '+travel+' min rough round-trip allowance = '+totalMinutes+' min; no live routing.';
 if(a.area)reasons+=' Estimated $'+totalCost+' total includes a $10 low-cost transport reserve; parking or rideshares may exceed this; check actual costs.';
 return {...a,score,reasons,travel,totalMinutes,totalCost};
 }).filter(a=>a.totalMinutes<=p.time&&a.totalCost<=p.budget&&!(['rain','hot'].includes(p.weather)&&a.setting!=='indoor')).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
export function recommendSocal(input,rejected=new Set()){
 const pool=rankSocal(input,rejected),picked=[];
 while(pool.length&&picked.length<3){pool.sort((a,b)=>(b.score-picked.filter(x=>x.category===b.category).length*9)-(a.score-picked.filter(x=>x.category===a.category).length*9)||a.id.localeCompare(b.id));picked.push(pool.shift());}
 return picked;
}
