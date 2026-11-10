const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map(),saved=new Map(),spoken=[],timers=new Map(),delays=[],events=new Map();let timerId=0;
const testVoices=[{lang:'en-US',name:'US',default:true},{lang:'en-GB',name:'UK alternate'},{lang:'en-GB',name:'UK default',default:true},{lang:'ja-JP',name:'Japanese'}];
function node(){return {value:'7',type:'',hidden:false,dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},replaceChildren(){},append(){},add(){},focus(){context.document.activeElement=this},blur(){if(context.document.activeElement===this)context.document.activeElement=null},scrollIntoView(){},contains(target){return target===this||this===elements.get('pocketShield')&&target===elements.get('pocketUnlock')},setAttribute(){},removeAttribute(){},addEventListener(){}}}
const context={console,assert,spoken,delays,events,testVoices,setTimeout(fn,delay){delays.push(delay);const id=++timerId;timers.set(id,{fn,delay});return id},clearTimeout(id){timers.delete(id)},runTimers(maxDelay=5000){for(const [id,{fn,delay}] of [...timers]){if(delay>maxDelay)continue;timers.delete(id);fn()}},SpeechSynthesisUtterance:class{constructor(text){this.text=text}},Option:class{},confirm:()=>false,innerHeight:844,localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},document:{getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id)},createElement:node,querySelector(){return node()},body:node(),documentElement:node(),addEventListener(name,fn){events.set(name,fn)}},window:{addEventListener(){},speechSynthesis:{getVoices(){return testVoices},cancel(){},speak(u){spoken.push({text:u.text,lang:u.lang,voice:u.voice?.name,rate:u.rate});u.onend()}}}};
saved.set('japanese-travel-pilot-v1',JSON.stringify({settings:{rate:'0.8'}}));
vm.createContext(context);
for(const f of ['cards.js','counters.js','numbers.js','scheduler.js','autoplay.js','pocket.js','app.js'])vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..',f),'utf8'),context);
vm.runInContext(`
for(const card of CARDS){for(const value of [card.target,card.kana,...card.accepted])assert(matchesJapanese(value,card));assert(!matchesJapanese('',card));assert(!matchesJapanese('これはテストではありません',card))}
assert(matchesJapanese('Ｗｉ－Ｆｉ は ありますか？',CARDS.find(c=>c.id==='hotel-05')));assert(!matchesJapanese('ワイファイが使えます',CARDS.find(c=>c.id==='hotel-06')));
mode='recall';session=[CARDS.find(c=>c.id==='hotel-01')];index=0;sessionId=1;assisted=true;
results={[CARDS.find(c=>c.id==='hotel-01').id]:{checks:1,missed:true,status:'pending',accepted:false}};
attempt={previous:undefined,resultBefore:{checks:0,missed:false,status:'pending',accepted:false},assistedBefore:false,match:false};
state.records[CARDS.find(c=>c.id==='hotel-01').id]=Learning.rate(undefined,'miss',Date.now(),sessionId);
acceptAnswer();
assert.equal(state.records[CARDS.find(c=>c.id==='hotel-01').id].lastOutcome,'correct');assert.equal(state.records[CARDS.find(c=>c.id==='hotel-01').id].misses,undefined);assert.equal(state.records[CARDS.find(c=>c.id==='hotel-01').id].streak,1);assert.equal(results[CARDS.find(c=>c.id==='hotel-01').id].status,'first');assert(results[CARDS.find(c=>c.id==='hotel-01').id].accepted);
const n=Date.now(),miss=Learning.rate(undefined,'miss',n,1),repair=Learning.rate(miss,'correct',n+1,1);assert(repair.needsReview);assert(!Learning.rate(repair,'correct',n+Learning.DAY,2).needsReview);
const queue=[...CARDS],ids=new Set();assert(Learning.queueRetry(queue,0,ids,2));assert.equal(queue[4].id,CARDS[0].id);assert(!Learning.queueRetry(queue,0,ids,2));

// Content integrity and lesson isolation.
assert.equal(CARDS.length,146);assert.equal(LESSONS.length,14);assert.equal(new Set(CARDS.map(c=>c.id)).size,CARDS.length);
for(const c of CARDS){assert(LESSONS.some(l=>l.id===c.lesson));assert(c.keywords.length);for(const w of c.keywords)assert(w.ja&&w.romaji&&w.meaning);assert(!/XXX|_{2,}|〜|[*]{2,}/i.test(c.target+c.prompt+c.romaji));}
selectedLesson='hotel';assert.equal(lessonCards().length,7);assert(lessonCards().every(c=>c.id.startsWith('hotel-')));
selectedLesson='introductions';assert.equal(lessonCards().length,5);assert(orderCards().every(c=>c.lesson==='introductions'));
selectedLesson='all';assert.equal(lessonCards().length,146);selectedLesson='hotel';
assert(CARDS.find(c=>c.id==='hotel-04').keywords.some(w=>w.romaji==='chōshoku'&&w.meaning==='breakfast'));
assert(CARDS.find(c=>c.id==='hotel-07').keywords.some(w=>w.romaji==='nimotsu'&&w.meaning.includes('luggage')));
// New cards pause half a second after default English; all Japanese uses the chosen speed.
active=true;session=[CARDS.find(c=>c.id==='hotel-01')];index=0;mode='repeat';checked=false;spoken.length=0;
assert.equal(state.settings.rate,'0.75');
playPrompt(true);assert.equal(spoken.length,1);assert.equal(spoken[0].lang,'en');assert.equal(spoken[0].voice,'US');assert.equal(spoken[0].rate,1);assert.equal(delays[delays.length-1],500);
runTimers();assert.equal(spoken.length,2);assert.equal(spoken[1].lang,'ja-JP');assert.equal(spoken[1].rate,0.75);
spoken.length=0;$('play').onclick();assert.equal(spoken.length,1);assert.equal(spoken[0].lang,'en');
spoken.length=0;$('reveal').onclick();runTimers();assert.equal(spoken.length,1);assert.equal(spoken[0].lang,'ja-JP');assert.equal(spoken[0].rate,0.75);
spoken.length=0;playPrompt(true);$('play').onclick();runTimers();assert.equal(spoken.length,2);assert(spoken.every(u=>u.lang==='en'));
spoken.length=0;$('previewVoice').onclick();assert.equal(spoken[0].rate,0.75);
state.settings.rate='1';spoken.length=0;speak(CARDS.find(c=>c.id==='hotel-01').target,'ja-JP');assert.equal(spoken[0].rate,1);state.settings.rate='0.75';
// Retrying the same card keeps its miss due and counts one unique phrase.
state.records={};state.repetition={};results={[CARDS.find(c=>c.id==='hotel-01').id]:{checks:0,missed:false,status:'pending',accepted:false}};
$('response').value='いいえ';checkAnswer({preventDefault(){}});assert(state.records[CARDS.find(c=>c.id==='hotel-01').id].needsReview);assert(checked);assert(!$('tryAgain').hidden);
tryAgain();assert(!checked);assert.equal($('response').value,'');assert(!$('response').disabled);assert($('model').hidden);assert.equal(index,0);assert(state.records[CARDS.find(c=>c.id==='hotel-01').id].needsReview);
$('response').value=CARDS.find(c=>c.id==='hotel-01').target;checkAnswer({preventDefault(){}});assert.equal(results[CARDS.find(c=>c.id==='hotel-01').id].status,'repeated');assert(state.records[CARDS.find(c=>c.id==='hotel-01').id].needsReview);assert.equal(Object.keys(results).length,1);
// Accepting a false dictation mismatch removes only that failure in repeat mode.
state.records={};state.repetition={};results={[CARDS.find(c=>c.id==='hotel-01').id]:{checks:0,missed:false,status:'pending',accepted:false}};checked=false;
$('response').value='いいえ';checkAnswer({preventDefault(){}});assert(state.records[CARDS.find(c=>c.id==='hotel-01').id].needsReview);acceptAnswer();assert.equal(state.records[CARDS.find(c=>c.id==='hotel-01').id],undefined);assert.equal(results[CARDS.find(c=>c.id==='hotel-01').id].missed,false);

// Autoplay: one ordered pass and two separate full hats; all history stays untouched.
selectedLesson='hotel';const pool=orderedLessonCards(),sequence=Autoplay.plan(pool,()=>0);
assert.equal(sequence.length,21);assert.deepEqual(sequence.slice(0,7).map(x=>x.card.id),pool.map(c=>c.id));
for(let pass=1;pass<=3;pass++){const entries=sequence.filter(x=>x.pass===pass);assert.equal(entries.length,7);assert.equal(new Set(entries.map(x=>x.card.id)).size,7);assert.equal(entries[0].position,1);assert.equal(entries[6].position,7);}
selectedLesson='all';assert.equal(orderedLessonCards()[0].lesson,'basic-numbers');assert.equal(Autoplay.plan(orderedLessonCards()).length,438);selectedLesson='hotel';
const historyBefore=JSON.stringify({records:state.records,repetition:state.repetition,sessionNumber:state.sessionNumber});
mode='autoplay';spoken.length=0;startAutoplay();assert.equal(spoken.length,1);assert.equal(spoken[0].lang,'en');
next();assert(autoplayPaused);runTimers();assert.equal(spoken.length,1);next();assert(!autoplayPaused);assert.equal(index,0);
runTimers();assert(!autoplayCardComplete);runTimers();assert(autoplayCardComplete);assert.equal(spoken[spoken.length-1].lang,'ja-JP');
next();assert(autoplayPaused);next();assert.equal(index,1);assert(!autoplayPaused);
// Leaving the page pauses; returning does not start speech unexpectedly.
document.hidden=true;events.get('visibilitychange')();assert(autoplayPaused);document.hidden=false;
back();assert(!active);
// No idle timer is scheduled by the touch shield.
mode='autoplay';active=true;autoplayPaused=false;const timersBefore=delays.length;Pocket.sync();assert.equal(delays.length,timersBefore);active=false;
assert.deepEqual(LESSONS.slice(0,2).map(l=>l.id),['basic-numbers','building-numbers']);
const basics=CARDS.filter(c=>c.lesson==='basic-numbers');assert.equal(basics.length,24);for(let n=0;n<20;n++)assert(basics.some(c=>c.prompt===String(n)));
for(const sound of ['ゼロ','れい','よん','し','なな','しち','きゅう','く'])assert(basics.some(c=>c.spoken===sound));
for(const sound of ['さんびゃく','ろっぴゃく','はっぴゃく','さんぜん','はっせん'])assert(CARDS.some(c=>c.lesson==='building-numbers'&&c.spoken===sound));
// The dim shield never interrupts speech, and requires wake then unlock.
mode='autoplay';startAutoplay();const beforeLock=token;Pocket.lock();assert(Pocket.locked);assert.equal(token,beforeLock);
const tap={target:$('pocketUnlock'),preventDefault(){},stopPropagation(){}};
$('pocketShield').onclick(tap);assert(Pocket.awake);assert(Pocket.locked);
$('pocketShield').onclick(tap);assert(!Pocket.locked);
let blocked=false;Pocket.lock();events.get('click')({target:$('next'),preventDefault(){blocked=true},stopImmediatePropagation(){}});assert(blocked);back();assert(!Pocket.locked);
// A fresh uninterrupted session has 21 English and 28 Japanese plays and no score changes.
mode='autoplay';spoken.length=0;startAutoplay();let guard=0;
while(active&&guard++<100)runTimers();
assert(!active);assert.equal(spoken.length,49);assert.equal(spoken.filter(x=>x.lang==='en').length,21);assert.equal(spoken.filter(x=>x.lang==='ja-JP').length,28);
assert.equal(JSON.stringify({records:state.records,repetition:state.repetition,sessionNumber:state.sessionNumber}),historyBefore);
assert($('completionText').textContent.includes('21 phrase plays'));assert($('completionText').textContent.includes('3 complete passes'));
// Speech selection and speed comparison use explicit settings.
testVoices.push({name:'Better (Premium)',lang:'en-AU',voiceURI:'premium'});state.settings.englishVoice='auto';
spoken.length=0;speak('Hello','en');assert.equal(spoken[0].voice,'Better (Premium)');
state.settings.englishVoice=voiceKey(testVoices[1]);spoken.length=0;speak('Hello','en');assert.equal(spoken[0].voice,'UK alternate');
state.settings.rate='0.6';spoken.length=0;$('compareSpeed').onclick();runTimers();assert.deepEqual(spoken.map(x=>x.rate),[1,0.6]);assert.equal(state.settings.rate,'0.6');
assert(CARDS.filter(c=>c.source==='counters').every(c=>c.spoken&&c.keywords.length));
assert(CARDS.some(c=>c.prompt.includes('203')&&c.spoken.includes('にまるさん')));
assert(CARDS.some(c=>c.prompt.includes('two cats')||c.prompt.includes('2 cats')));
`,context);
console.log('Passed Autoplay ordering, no replacement, three passes, pause/resume, visibility handling, completion and untouched history; 146-card content and keyword checks, lesson isolation, answer variants, review intervals, manual acceptance, default English voice selection, 500ms audio gap, 75% Japanese speed, preference migration, cancellation during the gap, bilingual entry audio, separate English/Japanese playback, and same-card retry history.');
