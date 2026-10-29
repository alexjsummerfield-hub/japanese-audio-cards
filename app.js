'use strict';
const $=id=>document.getElementById(id), STORAGE='japanese-travel-pilot-v1';
let state={records:{},repetition:{},sessionNumber:0,settings:{voice:'auto',rate:'1',delay:'1500',romaji:true,script:false}};
let storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');if(saved)state={...state,...saved,settings:{...state.settings,...saved.settings}}}catch{storageOK=false}
const synth=window.speechSynthesis;
let session=[],index=0,mode='repeat',sessionId=0,results={},retryIds=new Set(),attempt=null,assisted=false,checked=false,active=false,token=0,timer=null;
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));storageOK=true}catch{storageOK=false}updateSummary()}
function updateSummary(){const due=CARDS.filter(c=>Learning.isDue(state.records[c.id],Date.now())).length;$('reviewSummary').textContent=storageOK?(due?`${due} phrase${due===1?' is':'s are'} ready for recall review. `:'')+'Progress stays on this device.':'Storage unavailable: progress lasts only in this tab.'}
function stop(){token++;clearTimeout(timer);timer=null;synth?.cancel()}
function japaneseVoices(){return synth?synth.getVoices().filter(v=>/^ja(?:-|$)/i.test(v.lang)):[]}
function voiceKey(v){return JSON.stringify([v.voiceURI,v.name,v.lang,v.localService])}
function refreshVoices(){
 const voices=japaneseVoices();$('voice').replaceChildren(new Option('Device default Japanese voice','auto'));
 const names=voices.map(v=>v.name);
 voices.forEach(v=>$('voice').add(new Option(v.name+(names.filter(n=>n===v.name).length>1?' · '+v.voiceURI+' · '+(v.localService?'on device':'network'):''),voiceKey(v))));
 $('voice').value=voices.some(v=>voiceKey(v)===state.settings.voice)?state.settings.voice:'auto';
 $('voiceInfo').textContent=!synth?'Speech playback is unavailable in this browser.':voices.length?`${voices.length} Japanese voice${voices.length===1?'':'s'} available. Preview to choose.`:'No Japanese voice is listed yet. Try Refresh voices; playback will request the device’s Japanese default.';
}
function speak(text,lang,done=()=>{},t=token){
 if(t!==token)return;
 if(!synth){audioFailure('Speech playback is unavailable in this browser.');return}
 const utterance=new SpeechSynthesisUtterance(text);utterance.lang=lang;
 const vs=synth.getVoices();
 const chosen=lang==='ja-JP'?japaneseVoices().find(v=>voiceKey(v)===state.settings.voice):vs.find(v=>/^en/i.test(v.lang));
 if(chosen)utterance.voice=chosen;utterance.rate=lang==='ja-JP'?Number(state.settings.rate):1;
 utterance.onend=()=>{if(t===token)done()};utterance.onerror=()=>{if(t===token)audioFailure('Audio could not play. Tap Play to retry, or choose another voice in settings.')};
 synth.speak(utterance);
}
function audioFailure(message){$('notice').textContent=message;$('settingsStatus').textContent=message;$('stage').textContent='Audio unavailable · you can retry';$('response').disabled=false;$('check').disabled=false}
function focusAnswer(){if(active&&!checked&&!$('settingsDialog').open){$('response').focus({preventScroll:true});viewport()}}
function playPrompt(){
 if(!active)return;stop();$('notice').textContent='';const t=token,c=session[index];
 $('stage').textContent=mode==='repeat'?'Listen to the Japanese model…':'Listen to the English prompt…';
 if(mode==='repeat')assisted=true;
 speak(mode==='repeat'?c.target:c.prompt,mode==='repeat'?'ja-JP':'en-GB',()=>{$('stage').textContent='Your turn · use Japanese keyboard dictation';focusAnswer()},t);
}
function showModel(){const c=session[index];$('model').hidden=false;$('romaji').textContent=c.romaji;$('romaji').hidden=!state.settings.romaji;$('script').textContent=c.target;$('script').hidden=!state.settings.script}
function playModel(){
 if(!active)return;stop();$('response').blur();assisted=true;showModel();const t=token;$('stage').textContent='Preparing Japanese audio…';
 timer=setTimeout(()=>{timer=null;if(t!==token)return;$('stage').textContent='Listen and say it again';speak(session[index].target,'ja-JP',()=>{$('stage').textContent='Ready · Next when you are'},t)},Number(state.settings.delay));
}
function orderCards(){
 const shuffled=[...CARDS].sort(()=>Math.random()-.5);
 if(mode==='recall')shuffled.sort((a,b)=>Number(Learning.isDue(state.records[b.id],Date.now()))-Number(Learning.isDue(state.records[a.id],Date.now())));
 return shuffled.slice(0,Number($('length').value));
}
function start(){
 stop();mode=$('mode').value;sessionId=++state.sessionNumber;session=orderCards();index=0;results={};retryIds=new Set();active=true;
 $('setup').hidden=true;$('complete').hidden=true;$('practice').hidden=false;document.body.classList.add('practising');save();showCard();focusAnswer();playPrompt();
}
function showCard(){
 document.querySelector('.practice-scroll').scrollTop=0;
 const c=session[index];attempt=null;assisted=mode==='repeat';checked=false;
 if(!results[c.id])results[c.id]={checks:0,missed:false,status:'pending',accepted:false};
 $('progress').textContent=`${index+1} / ${session.length}${c._retry?' · Review':''}`;$('bar').max=session.length;$('bar').value=index;
 $('instruction').textContent=mode==='repeat'?'LISTEN & REPEAT':'RECALL & SAY';$('prompt').textContent=c.prompt;$('context').textContent=c.note;$('context').hidden=!c.note;
 $('response').value='';$('response').disabled=false;$('check').disabled=false;$('model').hidden=true;$('feedback').hidden=true;$('answerActions').hidden=true;$('accept').hidden=false;$('reveal').hidden=false;$('notice').textContent='';
 $('stage').textContent='Ready to listen';$('next').textContent=index===session.length-1?'Finish session ✓':'Next phrase →';viewport();
}
function checkAnswer(event){
 event.preventDefault();if(!active||checked)return;
 const input=$('response').value.trim();
 if(!input){$('feedback').textContent='Dictate or type your Japanese answer first.';$('feedback').dataset.result='empty';$('feedback').hidden=false;return}
 const c=session[index],match=matchesJapanese(input,c),r=results[c.id];
 attempt={previous:state.records[c.id]?{...state.records[c.id]}:undefined,resultBefore:{...r},assistedBefore:assisted,match};
 r.checks++;r.missed=r.missed||!match;
 if(match)r.status=r.status==='first'?'first':r.missed||r.checks>1?'repeated':'first';
 if(mode==='recall')state.records[c.id]=Learning.rate(attempt.previous,match?(assisted?'assisted':'correct'):'miss',Date.now(),sessionId);
 else {const p=state.repetition[c.id]||{attempts:0,matches:0};state.repetition[c.id]={attempts:p.attempts+1,matches:p.matches+Number(match)}}
 checked=true;$('response').blur();$('response').disabled=true;$('check').disabled=true;$('reveal').hidden=true;
 $('feedback').textContent=match?'Matches an accepted answer.':'Not a match. Compare below.';$('feedback').dataset.result=match?'match':'miss';$('feedback').hidden=false;$('answerActions').hidden=match;
 save();playModel();$('model').scrollIntoView({block:'nearest'});
}
function acceptAnswer(){
 if(!attempt||attempt.match)return;
 const c=session[index],before=attempt.resultBefore;
 results[c.id]={...before,checks:before.checks+1,status:before.status==='first'?'first':before.missed||before.checks?'repeated':'first',accepted:true};
 if(mode==='recall')state.records[c.id]=Learning.rate(attempt.previous,attempt.assistedBefore?'assisted':'correct',Date.now(),sessionId);
 else state.repetition[c.id].matches++;
 attempt.match=true;$('feedback').textContent='Accepted by you.';$('feedback').dataset.result='match';$('answerActions').hidden=true;save();
}
function next(){
 if(!active)return;stop();
 if(checked&&attempt&&!attempt.match)Learning.queueRetry(session,index,retryIds,2);
 if(index+1>=session.length){finish();return}index++;showCard();focusAnswer();playPrompt();
}
function finish(){
 active=false;stop();$('response').blur();document.body.classList.remove('practising');$('practice').hidden=true;$('complete').hidden=false;
 const rs=Object.values(results),first=rs.filter(r=>r.status==='first').length,repeated=rs.filter(r=>r.status==='repeated').length,pending=rs.length-first-repeated;
 $('completionText').textContent=`${rs.length} unique phrases practised · ${mode==='repeat'?'Listen and repeat':'Recall and say'}`;
 $('results').replaceChildren();
 const labels=mode==='repeat'?['Matched first try','Matched after repeat','Not yet matched']:['Matched first try','Matched after repeat','Not yet matched'];
 [first,repeated,pending].forEach((n,i)=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=labels[i];dd.textContent=n;row.append(dt,dd);$('results').append(row)});
 const accepted=rs.filter(r=>r.accepted).length;
 $('completionNote').textContent=(mode==='repeat'?'Repetition builds familiarity. Try Recall and say when you feel ready; repeating a model does not advance recall reviews.':'Independent recall advances reviews through 1, 3, 7, 14 and 30 days. Assisted answers and same-session repairs stay due for a later independent review.')+(accepted?` ${accepted} manually accepted answer${accepted===1?'':'s'} included.`:'')+(pending?' Skipped phrases are included in “Not yet matched”; skipping does not record a failure.':'');
 $('complete').focus();updateSummary();
}
function back(){stop();active=false;$('response').blur();document.body.classList.remove('practising');$('practice').hidden=true;$('complete').hidden=true;$('setup').hidden=false;updateSummary()}
function keepAnswerVisible(){
 if(!active||checked||document.activeElement!==$('response'))return;
 const scroller=document.querySelector('.practice-scroll'),field=$('response').getBoundingClientRect(),area=scroller.getBoundingClientRect();
 // Scroll only the practice pane; do not move Safari's page or reopen dictation.
 if(field.bottom>area.bottom-8)scroller.scrollTop+=field.bottom-area.bottom+8;
 else if(field.top<area.top+8)scroller.scrollTop-=area.top+8-field.top;
}
function viewport(){
 const v=window.visualViewport,height=v?v.height:innerHeight;
 document.documentElement.style.setProperty('--practice-height',height+'px');
 document.documentElement.style.setProperty('--practice-top',(v?v.offsetTop:0)+'px');
 document.body.classList.toggle('compact-practice',active&&height<560);
 if(window.requestAnimationFrame)window.requestAnimationFrame(keepAnswerVisible);
}
function renderPreparation(){
 $('phraseList').replaceChildren();CARDS.forEach(c=>{const row=document.createElement('div');row.className='phrase';const meaning=document.createElement('p');meaning.textContent=c.prompt;const reading=document.createElement('p');reading.className='reading';reading.textContent=c.romaji;reading.hidden=!state.settings.romaji;const button=document.createElement('button');button.textContent='▶';button.setAttribute('aria-label','Hear Japanese: '+c.prompt);button.onclick=()=>{stop();$('settingsStatus').textContent='';speak(c.target,'ja-JP',()=>{})};row.append(meaning,reading,button);$('phraseList').append(row)})
}
$('start').onclick=start;$('again').onclick=start;$('lesson').onclick=back;$('back').onclick=back;$('play').onclick=playPrompt;$('next').onclick=next;
$('answerForm').onsubmit=checkAnswer;$('response').onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault();if(!e.repeat)checkAnswer(e)}};
$('accept').onclick=acceptAnswer;$('reviewSoon').onclick=()=>{if(!active)return;const c=session[index];if(mode==='recall')state.records[c.id]=Learning.rate(attempt?.previous,'miss',Date.now(),sessionId);$('answerActions').hidden=true;$('notice').textContent='Kept for another review.';save()};
$('replayModel').onclick=playModel;$('reveal').onclick=()=>{if(mode==='recall'&&!checked){state.records[session[index].id]=Learning.rate(state.records[session[index].id],'assisted',Date.now(),sessionId);save()}playModel();$('model').scrollIntoView({block:'nearest'})};
$('settings').onclick=()=>{stop();$('response').blur();$('settingsStatus').textContent='';refreshVoices();$('settingsDialog').showModal()};$('practiceSettings').onclick=()=>$('settings').click();$('done').onclick=()=>{stop();$('settingsDialog').close()};
$('refreshVoices').onclick=refreshVoices;$('previewVoice').onclick=()=>{stop();$('settingsStatus').textContent='Playing voice sample…';speak(CARDS[0].target,'ja-JP',()=>{$('settingsStatus').textContent='Sample finished.'})};
for(const [id,key] of [['voice','voice'],['rate','rate'],['delay','delay'],['showRomaji','romaji'],['showScript','script']]){
 const element=$(id);if(element.type==='checkbox')element.checked=state.settings[key];else if(id!=='voice')element.value=state.settings[key];
 element.onchange=()=>{state.settings[key]=element.type==='checkbox'?element.checked:element.value;save();renderPreparation();if(active&&!$('model').hidden)showModel();if(id==='rate'||id==='voice')$('previewVoice').click()};
}
$('mode').onchange=()=>{$('modeHelp').textContent=$('mode').value==='repeat'?'Hear the Japanese, then repeat it using keyboard dictation.':'Hear the English, then say the Japanese from memory.'};
$('clear').onclick=()=>{if(!confirm('Clear only Japanese practice history on this browser?'))return;state.records={};state.repetition={};save();$('settingsStatus').textContent='Japanese practice history cleared.'};
$('response').addEventListener('focus',viewport);
window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);window.addEventListener('resize',viewport);
if(synth)synth.onvoiceschanged=refreshVoices;
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();if(active)$('stage').textContent='Paused · tap Play to resume'}});
renderPreparation();refreshVoices();updateSummary();
