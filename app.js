'use strict';
const $=id=>document.getElementById(id), STORAGE='japanese-travel-pilot-v1';
let state={records:{},repetition:{},sessionNumber:0,settings:{voice:'auto',englishVoice:'auto',rate:'1',delay:'1500',romaji:true,script:false}};
let storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');if(saved)state={...state,...saved,settings:{...state.settings,...saved.settings}}}catch{storageOK=false}
// Apply the requested Australian default once; later explicit voice choices stay remembered.
if(state.settings.englishDefaultVersion!==1){state.settings.englishVoice='device';state.settings.englishLocale='en-AU';state.settings.englishDefaultVersion=1}
// Keep the existing Slower preference when upgrading from the earlier 80% setting.
if(state.settings.rate==='0.8')state.settings.rate='0.75';
if(!['1','0.75','0.6'].includes(state.settings.rate))state.settings.rate='1';
let selectedLesson=LESSONS.some(l=>l.id===state.settings.lesson)?state.settings.lesson:'basic-numbers';
const synth=window.speechSynthesis;
let session=[],index=0,mode='repeat',sessionId=0,results={},retryIds=new Set(),attempt=null,assisted=false,checked=false,active=false,token=0,timer=null;
let narrationPlaying=false,narrationIndex=0,narrationLesson=null;
let autoplayQueue=[],autoplayPaused=false,autoplayCardComplete=false;
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));storageOK=true}catch{storageOK=false}updateSummary()}
function lessonCards(){return selectedLesson==='all'?CARDS:CARDS.filter(c=>c.lesson===selectedLesson)}
function updateSummary(){const due=lessonCards().filter(c=>Learning.isDue(state.records[c.id],Date.now())).length;$('reviewSummary').textContent=storageOK?(due?`${due} phrase${due===1?' is':'s are'} ready for recall review. `:'')+'Progress stays on this device.':'Storage unavailable: progress lasts only in this tab.'}
function stop(){if(narrationPlaying){narrationPlaying=false;updateNarrationControls('Paused · Resume repeats this section.')}token++;clearTimeout(timer);timer=null;synth?.cancel()}
function voiceQuality(v){return /premium/i.test(v.name+' '+v.voiceURI)?2:/enhanced/i.test(v.name+' '+v.voiceURI)?1:0}
function englishVoices(){return synth?synth.getVoices().filter(v=>/^en(?:-|$)/i.test(v.lang)):[]}
function selectedEnglishVoice(){
 const voices=englishVoices();
 if(state.settings.englishVoice==='device')return null;
 if(state.settings.englishVoice!=='auto')return voices.find(v=>voiceKey(v)===state.settings.englishVoice)||null;
 const australian=voices.filter(v=>/^en[-_]AU$/i.test(v.lang));
 return australian.sort((a,b)=>Number(!!b.default)-Number(!!a.default)||voiceQuality(b)-voiceQuality(a))[0]||null;
}
function japaneseVoices(){return synth?synth.getVoices().filter(v=>/^ja(?:-|$)/i.test(v.lang)):[]}
function voiceKey(v){return JSON.stringify([v.voiceURI,v.name,v.lang,v.localService])}
function refreshVoices(){
 const voices=japaneseVoices();$('voice').replaceChildren(new Option('Device default Japanese voice','auto'));
 const names=voices.map(v=>v.name);
 voices.forEach(v=>$('voice').add(new Option(v.name+(names.filter(n=>n===v.name).length>1?' · '+v.voiceURI+' · '+(v.localService?'on device':'network'):''),voiceKey(v))));
 $('voice').value=voices.some(v=>voiceKey(v)===state.settings.voice)?state.settings.voice:'auto';
 const english=englishVoices();$('englishVoice').replaceChildren(new Option('Automatic · Australian English','auto'),new Option('Australian English · system default','device'));
 for(const v of english){const quality=voiceQuality(v);$('englishVoice').add(new Option(v.name+' · '+v.lang+(quality?' · '+(quality===2?'Premium':'Enhanced'):'')+(english.filter(x=>x.name===v.name&&x.lang===v.lang).length>1?' · '+v.voiceURI:''),voiceKey(v)))}
 $('englishVoice').value=['auto','device'].includes(state.settings.englishVoice)||english.some(v=>voiceKey(v)===state.settings.englishVoice)?state.settings.englishVoice:'auto';
 const selected=selectedEnglishVoice();$('englishVoiceInfo').textContent=english.length+' English voices exposed by this browser.'+(selected?' Selected: '+selected.name+'.':' Requesting the system’s Australian English default.')+' Preview a voice to choose; downloaded Accessibility voices may not appear here.';
 $('voiceInfo').textContent=!synth?'Speech playback is unavailable in this browser.':voices.length?`${voices.length} Japanese voice${voices.length===1?'':'s'} available. Preview to choose.`:'No Japanese voice is listed yet. Try Refresh voices; playback will request the device’s Japanese default.';
}
function speak(text,lang,done=()=>{},t=token,rateOverride){
 if(t!==token)return;
 if(!synth){audioFailure('Speech playback is unavailable in this browser.');return}
 const utterance=new SpeechSynthesisUtterance(text);utterance.lang=lang==='ja-JP'?'ja-JP':'en-AU';
 const chosen=lang==='ja-JP'?japaneseVoices().find(v=>voiceKey(v)===state.settings.voice):selectedEnglishVoice();
 if(chosen){utterance.voice=chosen;utterance.lang=chosen.lang}utterance.rate=lang==='ja-JP'?Number(rateOverride??state.settings.rate):1;
 utterance.onend=()=>{if(t===token)done()};utterance.onerror=()=>{if(t===token)audioFailure('Audio could not play. Tap Play to retry, or choose another voice in settings.')};
 synth.speak(utterance);
}
function audioFailure(message){if(narrationPlaying){stop();$('lessonAudioStatus').textContent=message;return}if(active&&mode==='autoplay'){pauseAutoplay();$('notice').textContent=message;return}$('notice').textContent=message;$('settingsStatus').textContent=message;$('stage').textContent='Audio unavailable · you can retry';$('response').disabled=false;$('check').disabled=false}
function focusAnswer(){
 if(!active||mode==='autoplay'||checked||$('settingsDialog').open)return;
 const field=$('response');
 // Focus during the tap itself: iPhone cannot open its keyboard from speech's onend.
 if(document.activeElement!==field)field.focus({preventScroll:true});
 viewport();
}
function playPrompt(includeJapanese=false){
 if(!active)return;stop();$('notice').textContent='';const t=token,c=session[index];
 $('stage').textContent='Listen to the English prompt…';
 const ready=()=>{$('stage').textContent='Your turn · use Japanese keyboard dictation';focusAnswer()};
 speak(c.prompt,'en',()=>{
  if(!includeJapanese){ready();return}
  $('stage').textContent='Japanese follows…';
  timer=setTimeout(()=>{
   timer=null;if(t!==token)return;
   assisted=true;$('stage').textContent='Listen to the Japanese model…';
   speak(c.spoken||c.target,'ja-JP',ready,t);
  },500);
 },t);
}
function showModel(){const c=session[index];$('modelLabel').textContent=mode==='autoplay'?'JAPANESE':'LISTEN & SAY IT AGAIN';$('model').hidden=false;$('romaji').textContent=c.romaji;$('romaji').hidden=!state.settings.romaji;$('script').textContent=c.target;$('script').hidden=!state.settings.script}
function playModel(){
 if(!active)return;stop();$('response').blur();assisted=true;showModel();const t=token;$('stage').textContent='Preparing Japanese audio…';
 timer=setTimeout(()=>{timer=null;if(t!==token)return;$('stage').textContent='Listen and say it again';speak(session[index].spoken||session[index].target,'ja-JP',()=>{$('stage').textContent='Ready · Next when you are'},t)},Number(state.settings.delay));
}
function orderCards(){
 const shuffled=[...lessonCards()];
 for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
 if(mode==='recall')shuffled.sort((a,b)=>Number(Learning.isDue(state.records[b.id],Date.now()))-Number(Learning.isDue(state.records[a.id],Date.now())));
 return $('length').value==='all'?shuffled:shuffled.slice(0,Number($('length').value));
}
function orderedLessonCards(){
 return selectedLesson==='all'?LESSONS.flatMap(l=>CARDS.filter(c=>c.lesson===l.id)):lessonCards();
}
function startAutoplay(){
 autoplayQueue=Autoplay.plan(orderedLessonCards());session=autoplayQueue.map(item=>item.card);index=0;
 if(!session.length)return;
 active=true;autoplayPaused=false;autoplayCardComplete=false;
 $('response').blur();$('setup').hidden=true;$('complete').hidden=true;$('practice').hidden=false;
 document.body.classList.add('practising','autoplay-mode');
 $('feedback').hidden=true;$('answerActions').hidden=true;$('notice').textContent='';$('autoplayStatus').hidden=false;
 playAutoplayCard();
}
function showAutoplayCard(){
 const item=autoplayQueue[index],c=item.card;
 $('progress').textContent=`Pass ${item.pass} / 3 · ${item.position} / ${item.count}`;
 $('bar').max=session.length;$('bar').value=index;
 $('instruction').textContent='AUTOPLAY · JUST LISTEN';$('prompt').textContent=c.prompt;
 $('context').textContent=c.note;$('context').hidden=!c.note;
 $('autoplayStatus').textContent=(item.pass===1?'First pass · Japanese twice':'Shuffled pass · Japanese once')+' · '+Math.round(Number(state.settings.rate)*100)+'% speed';
 showModel();viewport();
}
function playAutoplayCard(){
 if(!active||mode!=='autoplay')return;
 stop();autoplayPaused=false;autoplayCardComplete=false;showAutoplayCard();Pocket.sync();
 $('next').textContent='Ⅱ Pause';$('next').setAttribute('aria-label','Pause autoplay');
 const t=token,c=session[index],repeats=autoplayQueue[index].pass===1?2:1;
 function japanese(repetition){
  if(t!==token)return;$('stage').textContent=`Japanese ${repetition} of ${repeats}`;
  speak(c.spoken||c.target,'ja-JP',()=>{
   if(repetition<repeats){timer=setTimeout(()=>{timer=null;japanese(repetition+1)},800);return}
   autoplayCardComplete=true;$('stage').textContent='A moment before the next phrase';
   timer=setTimeout(()=>{timer=null;if(t===token)advanceAutoplay()},2000);
  },t);
 }
 $('stage').textContent='Listen to the English prompt…';
 speak(c.prompt,'en',()=>{timer=setTimeout(()=>{timer=null;japanese(1)},500)},t);
}
function pauseAutoplay(message){
 if(!active||mode!=='autoplay')return;
 stop();autoplayPaused=true;Pocket.sync();$('next').textContent='▶ Play';$('next').setAttribute('aria-label','Resume autoplay');$('autoplayStatus').textContent=message||(autoplayCardComplete?'Paused · Play continues with the next phrase':'Paused · Play restarts this phrase');
}
function advanceAutoplay(){
 if(!active||mode!=='autoplay')return;
 if(index+1>=session.length){finishAutoplay();return}
 index++;playAutoplayCard();
}
function finishAutoplay(){
 stop();active=false;Pocket.sync();document.body.classList.remove('practising','autoplay-mode');
 $('practice').hidden=true;$('complete').hidden=false;$('results').replaceChildren();
 const unique=autoplayQueue[0].count;
 $('completionText').textContent=`${unique} phrases · ${session.length} phrase plays · 3 complete passes`;
 $('completionNote').textContent='One pass in lesson order, followed by two shuffled passes. Japanese played twice per phrase on the first pass and once on later passes. Listening does not change your recall review scores.';
 $('complete').focus();updateSummary();
}
function start(){
 Pocket.clear();stop();mode=$('mode').value;Pocket.sync();if(mode==='autoplay'){startAutoplay();return}document.body.classList.remove('autoplay-mode');$('autoplayStatus').hidden=true;sessionId=++state.sessionNumber;session=orderCards();index=0;results={};retryIds=new Set();active=true;
 $('setup').hidden=true;$('complete').hidden=true;$('practice').hidden=false;document.body.classList.add('practising');save();showCard();focusAnswer();playPrompt(mode==='repeat');
}
function showCard(){
 document.querySelector('.practice-scroll').scrollTop=0;
 const c=session[index];attempt=null;assisted=mode==='repeat';checked=false;
 if(!results[c.id])results[c.id]={checks:0,missed:false,status:'pending',accepted:false};
 $('progress').textContent=`${index+1} / ${session.length}${c._retry?' · Review':''}`;$('bar').max=session.length;$('bar').value=index;
 $('instruction').textContent=mode==='repeat'?'LISTEN & REPEAT':'RECALL & SAY';$('prompt').textContent=c.prompt;$('context').textContent=c.note;$('context').hidden=!c.note;
 $('response').value='';$('response').disabled=false;$('check').disabled=false;$('model').hidden=true;$('feedback').hidden=true;$('answerActions').hidden=true;$('accept').hidden=false;$('reveal').hidden=false;$('notice').textContent='';
 $('next').removeAttribute('aria-label');$('stage').textContent='Ready to listen';$('next').textContent=index===session.length-1?'Finish session ✓':'Next phrase →';viewport();
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
 else {
  const p=state.repetition[c.id]||{attempts:0,matches:0};state.repetition[c.id]={attempts:p.attempts+1,matches:p.matches+Number(match)};
  // A missed repetition stays due; a later assisted match cannot erase it.
  if(!match||attempt.previous?.needsReview)state.records[c.id]=Learning.rate(attempt.previous,match?'assisted':'miss',Date.now(),sessionId);
 }
 checked=true;$('response').blur();$('response').disabled=true;$('check').disabled=true;$('reveal').hidden=false;
 $('feedback').textContent=match?'✓ Matches an accepted answer.':'✕ Not a match. Compare below.';$('feedback').dataset.result=match?'match':'miss';$('feedback').hidden=false;$('answerActions').hidden=false;$('accept').hidden=match;
 save();playModel();$('model').scrollIntoView({block:'nearest'});
}
function acceptAnswer(){
 if(!attempt||attempt.match)return;
 const c=session[index],before=attempt.resultBefore;
 results[c.id]={...before,checks:before.checks+1,status:before.status==='first'?'first':before.missed||before.checks?'repeated':'first',accepted:true};
 if(mode==='recall')state.records[c.id]=Learning.rate(attempt.previous,attempt.assistedBefore?'assisted':'correct',Date.now(),sessionId);
 else {
  state.repetition[c.id].matches++;
  // Restore the pre-attempt review record when a mismatch was false.
  if(attempt.previous)state.records[c.id]=attempt.previous;
  else delete state.records[c.id];
 }
 attempt.match=true;$('feedback').textContent='✓ Accepted by you.';$('feedback').dataset.result='match';$('accept').hidden=true;save();
}
function tryAgain(){
 if(!active||!checked)return;
 stop();checked=false;assisted=true;attempt=null;
 $('response').value='';$('response').disabled=false;$('check').disabled=false;
 $('feedback').hidden=true;$('answerActions').hidden=true;$('model').hidden=true;$('reveal').hidden=false;
 $('notice').textContent='';$('stage').textContent='Try the same phrase again';
 focusAnswer();
}
function next(){
 if(!active)return;if(mode==='autoplay'){if(autoplayPaused){if(autoplayCardComplete){advanceAutoplay();return}playAutoplayCard()}else pauseAutoplay();return}stop();
 if(results[session[index].id]?.missed)Learning.queueRetry(session,index,retryIds,2);
 if(index+1>=session.length){finish();return}index++;showCard();focusAnswer();playPrompt(mode==='repeat');
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
function back(){Pocket.clear();stop();active=false;Pocket.sync();document.body.classList.remove('autoplay-mode');$('response').blur();document.body.classList.remove('practising');$('practice').hidden=true;$('complete').hidden=true;$('setup').hidden=false;updateSummary()}
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
function applyLesson(){
 stop();
 const lesson=LESSONS.find(l=>l.id===selectedLesson),pool=lessonCards();
 $('lessonTitle').textContent=lesson?lesson.title:'Mixed revision';
 $('lessonDescription').textContent=lesson?lesson.description:'Practise phrases from all fourteen lessons.';
 $('lessonNumber').textContent=lesson?String(LESSONS.indexOf(lesson)+1).padStart(2,'0'):'↻';
 $('preparationCount').textContent=pool.length+' phrases';
 const allOption=Array.from($('length').options||[]).find(o=>o.value==='all');
 if(allOption)allOption.textContent='All '+pool.length+' phrases';
 state.settings.lesson=selectedLesson;save();renderGuide();renderLessonAudio();renderPreparation();
}
function renderGuide(){
 const box=$('lessonGuide');box.replaceChildren();
 const sections=selectedLesson==='all'?[]:(COUNTER_GUIDES[selectedLesson]||[]);
 for(const [title,text] of sections){const section=document.createElement('section');section.className='counter-explanation';const heading=document.createElement('h3');heading.textContent=title;const p=document.createElement('p');p.textContent=text;section.append(heading,p);box.append(section)}
 if(sections.length){const sources=document.createElement('p');sources.className='guide-note';sources.textContent='Based on the class counters handout, with contextual examples and reading notes. Start with this lesson’s examples; no script reading is required.';box.append(sources)}
}
function updateNarrationControls(message){
 const parts=LESSON_AUDIO[selectedLesson]||[];
 $('lessonListen').textContent=narrationPlaying?'Ⅱ Pause':narrationLesson===selectedLesson&&narrationIndex<parts.length?'▶ Resume':'▶ Listen to lesson';
 $('lessonListen').setAttribute('aria-pressed',String(narrationPlaying));
 $('lessonRestart').hidden=narrationLesson!==selectedLesson;
 if(message)$('lessonAudioStatus').textContent=message;
}
function renderLessonAudio(){
 const parts=LESSON_AUDIO[selectedLesson]||[];
 $('lessonAudio').hidden=!parts.length;
 if(narrationLesson!==selectedLesson){narrationLesson=null;narrationIndex=0;$('lessonAudioCurrent').textContent='';}
 updateNarrationControls('English explanations · Japanese examples');
}
function playNarrationPart(){
 const parts=LESSON_AUDIO[narrationLesson]||[],part=parts[narrationIndex],t=token;
 if(!narrationPlaying||!part)return;
 $('lessonAudioStatus').textContent=(part.lang==='ja-JP'?'Japanese example':'English explanation')+' · '+(narrationIndex+1)+' / '+parts.length;
 $('lessonAudioCurrent').textContent=part.display;
 speak(part.text,part.lang,()=>{
  timer=setTimeout(()=>{
   timer=null;if(t!==token||!narrationPlaying)return;
   narrationIndex++;
   if(narrationIndex>=parts.length){narrationPlaying=false;updateNarrationControls('Introduction complete · Try the practice cards when ready.');return}
   playNarrationPart();
  },700);
 },t);
}
function listenToLesson(restart=false){
 if(narrationPlaying&&!restart){stop();return}
 stop();
 const parts=LESSON_AUDIO[selectedLesson]||[];if(!parts.length)return;
 if(restart||narrationLesson!==selectedLesson||narrationIndex>=parts.length)narrationIndex=0;
 narrationLesson=selectedLesson;narrationPlaying=true;updateNarrationControls();playNarrationPart();
}
$('lessonListen').onclick=()=>listenToLesson();$('lessonRestart').onclick=()=>listenToLesson(true);
function renderPreparation(){
 $('phraseList').replaceChildren();lessonCards().forEach(c=>{
  const row=document.createElement('div');row.className='phrase';
  const meaning=document.createElement('p');meaning.textContent=c.prompt;
  const reading=document.createElement('p');reading.className='reading';reading.textContent=c.romaji;reading.hidden=!state.settings.romaji;
  const button=document.createElement('button');button.className='phrase-play';button.textContent='▶';button.setAttribute('aria-label','Hear Japanese: '+c.prompt);
  button.onclick=()=>{stop();$('settingsStatus').textContent='';speak(c.spoken||c.target,'ja-JP')};
  row.append(meaning,reading,button);
  const keywords=document.createElement('div');keywords.className='phrase-keywords';
  const label=document.createElement('p');label.className='keyword-label';label.textContent='Words to notice';keywords.append(label);
  c.keywords.forEach(word=>{
   const wordButton=document.createElement('button');wordButton.className='keyword';
   wordButton.setAttribute('aria-label','Hear '+word.romaji+': '+word.meaning);
   const term=document.createElement('strong');term.textContent='▶ '+word.romaji;
   const gloss=document.createElement('span');gloss.textContent=word.meaning;
   wordButton.append(term,gloss);wordButton.onclick=()=>{stop();speak(word.ja,'ja-JP')};keywords.append(wordButton);
  });
  row.append(keywords);
  if(c.note||c.example){const note=document.createElement('p');note.className='preparation-context';note.textContent=[c.note,c.example].filter(Boolean).join(' ');row.append(note)}
  $('phraseList').append(row);
 });
}
$('lesson').replaceChildren(...LESSONS.map((l,i)=>new Option(String(i+1).padStart(2,'0')+' · '+l.title,l.id)),new Option('All lessons · mixed revision','all'));
$('lesson').value=selectedLesson;
$('lesson').onchange=()=>{selectedLesson=$('lesson').value;applyLesson()};
$('start').onclick=start;$('again').onclick=start;$('backToLesson').onclick=back;$('back').onclick=back;$('play').onclick=()=>{focusAnswer();playPrompt()};$('next').onclick=next;
$('answerForm').onsubmit=checkAnswer;$('response').onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault();if(!e.repeat)checkAnswer(e)}};
$('accept').onclick=acceptAnswer;$('tryAgain').onclick=tryAgain;
$('reveal').onclick=()=>{if(mode==='recall'&&!checked){state.records[session[index].id]=Learning.rate(state.records[session[index].id],'assisted',Date.now(),sessionId);save()}playModel();$('model').scrollIntoView({block:'nearest'})};
$('settings').onclick=()=>{if(active&&mode==='autoplay')pauseAutoplay();stop();$('response').blur();$('settingsStatus').textContent='';refreshVoices();$('settingsDialog').showModal()};$('practiceSettings').onclick=()=>$('settings').click();$('done').onclick=()=>{stop();$('settingsDialog').close();focusAnswer()};
$('refreshVoices').onclick=refreshVoices;$('previewEnglishVoice').onclick=()=>{stop();$('settingsStatus').textContent='Playing English sample…';speak('I have a reservation. What time is breakfast?','en',()=>{$('settingsStatus').textContent='English sample finished.'})};
$('compareSpeed').onclick=()=>{stop();const t=token,rate=state.settings.rate==='1'?0.75:Number(state.settings.rate),c=CARDS.find(c=>c.id==='hotel-04');$('speedTestStatus').textContent='Normal (100%)…';speak(c.target,'ja-JP',()=>{timer=setTimeout(()=>{timer=null;if(t!==token)return;$('speedTestStatus').textContent='Slower ('+Math.round(rate*100)+'%)…';speak(c.target,'ja-JP',()=>{$('speedTestStatus').textContent='Comparison finished: 100%, then '+Math.round(rate*100)+'%.'},t,rate)},600)},t,1)};
$('previewVoice').onclick=()=>{stop();$('settingsStatus').textContent='Playing voice sample…';speak(CARDS.find(c=>c.id==='hotel-04').target,'ja-JP',()=>{$('settingsStatus').textContent='Sample finished.'})};
for(const [id,key] of [['voice','voice'],['englishVoice','englishVoice'],['rate','rate'],['delay','delay'],['showRomaji','romaji'],['showScript','script']]){
 const element=$(id);if(element.type==='checkbox')element.checked=state.settings[key];else if(id!=='voice')element.value=state.settings[key];
 element.onchange=()=>{state.settings[key]=element.type==='checkbox'?element.checked:element.value;save();renderPreparation();if(active&&!$('model').hidden)showModel();if(id==='rate'||id==='voice')$('previewVoice').click();if(id==='englishVoice'){refreshVoices();$('previewEnglishVoice').click()}};
}
function updateMode(){
 const selected=$('mode').value,isAutoplay=selected==='autoplay';
 $('modeHelp').textContent=isAutoplay?'Whole lesson: ordered, then two shuffled passes. Japanese plays twice on pass 1. Dim & lock protects the controls while listening; keep Safari open.':selected==='repeat'?'Hear the English, then Japanese. Repeat the Japanese using keyboard dictation.':'Hear the English, then say the Japanese from memory.';
 $('lengthSetting').hidden=isAutoplay;
 $('start').textContent=isAutoplay?'Start autoplay →':'Start practice →';
}
$('mode').onchange=updateMode;
$('clear').onclick=()=>{if(!confirm('Clear only Japanese practice history on this browser?'))return;state.records={};state.repetition={};save();$('settingsStatus').textContent='Japanese practice history cleared.'};
// Avoid dropping the caret when the learner taps playback or skips a card.
for(const id of ['play','next'])$(id).onpointerdown=event=>{
 if(document.activeElement===$('response'))event.preventDefault();
};
$('response').addEventListener('focus',viewport);
window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);window.addEventListener('resize',viewport);
if(synth)synth.onvoiceschanged=refreshVoices;
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(active&&mode==='autoplay'){if(!autoplayPaused)pauseAutoplay('Paused while away · tap Play to continue');return}stop();if(active)$('stage').textContent='Paused · tap Play to resume'}});
const Pocket=createPocketLock({applicable:()=>active&&mode==='autoplay'&&!$('settingsDialog').open,eligible:()=>active&&mode==='autoplay'&&!autoplayPaused&&!document.hidden&&!$('settingsDialog').open});
applyLesson();refreshVoices();updateMode();
