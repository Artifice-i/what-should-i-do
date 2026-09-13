import test from 'node:test';
import assert from 'node:assert/strict';
import {activities,categories} from '../dist/activities.js';
import {recommend,defaults} from '../dist/engine.js';
test('library has unique IDs and valid attributes',()=>{
 assert.equal(new Set(activities.map(a=>a.id)).size,activities.length);
 assert.ok(activities.length>=40);
 for(const a of activities){assert.ok(categories.includes(a.category));assert.ok(a.minutes>0&&a.cost>=0&&a.energy>=1&&a.energy<=10);assert.ok(a.step&&a.title);}
});
test('default recommendations are three distinct activities',()=>{const r=recommend(defaults);assert.equal(r.length,3);assert.equal(new Set(r.map(a=>a.id)).size,3);});
test('sick, low-energy, mentally engaged scenario stays restful',()=>{
 const r=recommend({energy:2,time:120,health:'sick',place:'home',mental:3});
 assert.equal(r.length,3);assert.ok(r.every(a=>a.rest&&a.place==='home'&&a.physical===1));assert.equal(r[0].mental,3);
 console.log('Restful scenario:',r.map(a=>a.title).join(' / '));
});
test('energetic social outing produces very different recommendations',()=>{
 const r=recommend({energy:9,time:360,budget:50,place:'out',social:'social',physical:3,mood:'restless'});
 assert.equal(r.length,3);assert.ok(r.every(a=>a.place==='out'&&a.social==='social'));assert.equal(r[0].physical,3);
 const restful=recommend({energy:2,time:120,health:'sick',place:'home',mental:3});
 assert.ok(r.every(a=>!restful.some(b=>a.id===b.id)));
 console.log('Social outing scenario:',r.map(a=>a.title).join(' / '));
});
test('hard limits hold across combinations',()=>{
 for(const energy of [1,5,10])for(const time of [15,60,360])for(const budget of [0,50])for(const health of ['well','sick'])for(const place of ['any','home','out'])for(const social of ['any','alone','social']){
 const p={energy,time,budget,health,place,social};
 for(const a of recommend(p)){assert.ok(a.minutes<=time&&a.cost<=budget&&a.energy<=energy+2);assert.ok(place==='any'||a.place===place);assert.ok(social==='any'||a.social===social);if(health==='sick')assert.ok(a.rest&&a.place==='home'&&a.energy<=4);}
 }
});
test('rejections never return; exhaustion is explicit',()=>{
 const ids=new Set(recommend(defaults).map(a=>a.id));
 assert.ok(recommend(defaults,ids).every(a=>!ids.has(a.id)));
 assert.deepEqual(recommend(defaults,new Set(activities.map(a=>a.id))),[]);
 assert.deepEqual(recommend({health:'sick',place:'out'}),[]);
});
test('mental preference changes the primary result',()=>{
 const p={energy:2,time:120,place:'home',health:'sick'};
 assert.equal(recommend({...p,mental:1})[0].mental,1);
 assert.equal(recommend({...p,mental:3})[0].mental,3);
});
