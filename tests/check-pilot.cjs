const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map(),saved=new Map(),spoken=[],timers=new Map(),delays=[];let timerId=0;
const testVoices=[{lang:'en-US',name:'US',default:true},{lang:'en-GB',name:'UK alternate'},{lang:'en-GB',name:'UK default',default:true},{lang:'ja-JP',name:'Japanese'}];
function node(){return {value:'7',type:'',hidden:false,dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},replaceChildren(){},append(){},add(){},focus(){context.document.activeElement=this},blur(){if(context.document.activeElement===this)context.document.activeElement=null},scrollIntoView(){},setAttribute(){},addEventListener(){}}}
const context={console,assert,spoken,delays,setTimeout(fn,delay){delays.push(delay);const id=++timerId;timers.set(id,fn);return id},clearTimeout(id){timers.delete(id)},runTimers(){for(const [id,fn] of [...timers]){timers.delete(id);fn()}},SpeechSynthesisUtterance:class{constructor(text){this.text=text}},Option:class{},confirm:()=>false,innerHeight:844,localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},document:{getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id)},createElement:node,querySelector(){return node()},body:node(),documentElement:node(),addEventListener(){}},window:{addEventListener(){},speechSynthesis:{getVoices(){return testVoices},cancel(){},speak(u){spoken.push({text:u.text,lang:u.lang,voice:u.voice?.name,rate:u.rate});u.onend()}}}};
saved.set('japanese-travel-pilot-v1',JSON.stringify({settings:{rate:'0.8'}}));
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

// New cards pause half a second after default English; all Japanese uses the chosen speed.
active=true;session=[CARDS[0]];index=0;mode='repeat';checked=false;spoken.length=0;
assert.equal(state.settings.rate,'0.75');
playPrompt(true);assert.equal(spoken.length,1);assert.equal(spoken[0].lang,'en');assert.equal(spoken[0].voice,'US');assert.equal(spoken[0].rate,1);assert.equal(delays[delays.length-1],500);
runTimers();assert.equal(spoken.length,2);assert.equal(spoken[1].lang,'ja-JP');assert.equal(spoken[1].rate,0.75);
spoken.length=0;$('play').onclick();assert.equal(spoken.length,1);assert.equal(spoken[0].lang,'en');
spoken.length=0;$('reveal').onclick();runTimers();assert.equal(spoken.length,1);assert.equal(spoken[0].lang,'ja-JP');assert.equal(spoken[0].rate,0.75);
spoken.length=0;playPrompt(true);$('play').onclick();runTimers();assert.equal(spoken.length,2);assert(spoken.every(u=>u.lang==='en'));
spoken.length=0;$('previewVoice').onclick();assert.equal(spoken[0].rate,0.75);
state.settings.rate='1';spoken.length=0;speak(CARDS[0].target,'ja-JP');assert.equal(spoken[0].rate,1);state.settings.rate='0.75';
// Retrying the same card keeps its miss due and counts one unique phrase.
state.records={};state.repetition={};results={[CARDS[0].id]:{checks:0,missed:false,status:'pending',accepted:false}};
$('response').value='いいえ';checkAnswer({preventDefault(){}});assert(state.records[CARDS[0].id].needsReview);assert(checked);assert(!$('tryAgain').hidden);
tryAgain();assert(!checked);assert.equal($('response').value,'');assert(!$('response').disabled);assert($('model').hidden);assert.equal(index,0);assert(state.records[CARDS[0].id].needsReview);
$('response').value=CARDS[0].target;checkAnswer({preventDefault(){}});assert.equal(results[CARDS[0].id].status,'repeated');assert(state.records[CARDS[0].id].needsReview);assert.equal(Object.keys(results).length,1);
// Accepting a false dictation mismatch removes only that failure in repeat mode.
state.records={};state.repetition={};results={[CARDS[0].id]:{checks:0,missed:false,status:'pending',accepted:false}};checked=false;
$('response').value='いいえ';checkAnswer({preventDefault(){}});assert(state.records[CARDS[0].id].needsReview);acceptAnswer();assert.equal(state.records[CARDS[0].id],undefined);assert.equal(results[CARDS[0].id].missed,false);
`,context);
console.log('Passed answer variants, review intervals, manual acceptance, default English voice selection, 500ms audio gap, 75% Japanese speed, preference migration, cancellation during the gap, bilingual entry audio, separate English/Japanese playback, and same-card retry history.');
