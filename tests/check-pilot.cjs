const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map(),saved=new Map();
function node(){return {value:'7',type:'',hidden:false,dataset:{},style:{setProperty(){}},classList:{add(){},remove(){}},replaceChildren(){},append(){},add(){},focus(){},blur(){},scrollIntoView(){},setAttribute(){},addEventListener(){}}}
const context={console,assert,setTimeout,clearTimeout,Option:class{},confirm:()=>false,innerHeight:844,localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},document:{getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id)},createElement:node,body:node(),documentElement:node(),addEventListener(){}},window:{addEventListener(){}}};
vm.createContext(context);
for(const f of ['cards.js','scheduler.js','app.js'])vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..',f),'utf8'),context);
vm.runInContext(`
for(const card of CARDS){for(const value of [card.target,card.kana,...card.accepted])assert(matchesJapanese(value,card));assert(!matchesJapanese('',card));assert(!matchesJapanese('いいえ',card))}
assert(matchesJapanese('Ｗｉ－Ｆｉ は ありますか？',CARDS[4]));assert(!matchesJapanese('ワイファイが使えます',CARDS[5]));
mode='recall';session=[CARDS[0]];index=0;sessionId=1;assisted=true;
results={[CARDS[0].id]:{checks:1,missed:true,status:'pending',accepted:false}};
attempt={previous:undefined,resultBefore:{checks:0,missed:false,status:'pending',accepted:false},assistedBefore:false,match:false};
state.records[CARDS[0].id]=Learning.rate(undefined,'miss',Date.now(),sessionId);
acceptAnswer();
assert.equal(state.records[CARDS[0].id].lastOutcome,'correct');assert.equal(state.records[CARDS[0].id].misses,undefined);assert.equal(state.records[CARDS[0].id].streak,1);assert.equal(results[CARDS[0].id].status,'first');assert(results[CARDS[0].id].accepted);
const n=Date.now(),miss=Learning.rate(undefined,'miss',n,1),repair=Learning.rate(miss,'correct',n+1,1);assert(repair.needsReview);assert(!Learning.rate(repair,'correct',n+Learning.DAY,2).needsReview);
const queue=[...CARDS],ids=new Set();assert(Learning.queueRetry(queue,0,ids,2));assert.equal(queue[4].id,CARDS[0].id);assert(!Learning.queueRetry(queue,0,ids,2));
`,context);
console.log('Passed answer variants, false-match rejection, manual-accept rollback after model playback, independent recall interval, same-session repair, and spaced retry checks.');
