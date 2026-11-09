'use strict';
// A page-level touch shield, not the phone's OS lock. Speech is never cancelled here.
function createPocketLock({applicable,eligible,enabled}){
 const shield=document.getElementById('pocketShield'),unlock=document.getElementById('pocketUnlock'),hint=document.getElementById('pocketHint'),button=document.getElementById('pocketLock'),main=document.querySelector('main');
 const IDLE=30000;let locked=false,awake=false,idleTimer=null,wakeTimer=null,deadline=0,sentinel=null,wakePending=false;
 async function power(){
  if(typeof navigator==='undefined'||!navigator.wakeLock)return;
  if(!eligible()){if(sentinel){const old=sentinel;sentinel=null;try{await old.release()}catch{}}return}
  if(sentinel||wakePending)return;
  wakePending=true;
  try{const acquired=await navigator.wakeLock.request('screen');if(eligible()){sentinel=acquired;acquired.addEventListener('release',()=>{if(sentinel===acquired)sentinel=null})}else await acquired.release()}catch{}finally{wakePending=false}
 }
 function dim(){awake=false;shield.classList.remove('awake');unlock.hidden=true;hint.textContent='Autoplay locked · Tap to wake';shield.focus({preventScroll:true})}
 function lock(){
  if(!applicable()||locked)return;
  locked=true;clearTimeout(idleTimer);document.activeElement?.blur();main.inert=true;shield.hidden=false;document.body.classList.add('pocket-locked');dim();
 }
 function arm(reset=false){
  clearTimeout(idleTimer);
  if(!eligible()||!enabled()||locked){deadline=0;return}
  if(reset||!deadline)deadline=Date.now()+IDLE;
  idleTimer=setTimeout(lock,Math.max(0,deadline-Date.now()));
 }
 function sync(){button.hidden=!applicable();arm();power()}
 function clear(){clearTimeout(idleTimer);clearTimeout(wakeTimer);deadline=0;locked=false;awake=false;main.inert=false;shield.hidden=true;document.body.classList.remove('pocket-locked')}
 function wake(){awake=true;shield.classList.add('awake');hint.textContent='Tap Unlock controls to continue';unlock.hidden=false;unlock.focus({preventScroll:true});clearTimeout(wakeTimer);wakeTimer=setTimeout(dim,5000)}
 button.onclick=lock;
 shield.onclick=event=>{
  event.preventDefault();event.stopPropagation();
  if(!locked)return;
  if(!awake){wake();return}
  if(event.target===unlock||unlock.contains(event.target)){clear();arm(true);button.focus({preventScroll:true})}
 };
 shield.addEventListener('touchmove',event=>event.preventDefault(),{passive:false});
 shield.onkeydown=event=>{if(event.key==='Tab'){event.preventDefault();(awake?unlock:shield).focus({preventScroll:true})}};
 for(const type of ['pointerdown','touchstart','keydown','input','change','click'])document.addEventListener(type,event=>{
  // Catch an expired timer before a delayed pocket tap can reach an app control.
  if(!locked&&eligible()&&enabled()&&deadline&&Date.now()>=deadline)lock();
  if(locked){if(!shield.contains(event.target)){event.preventDefault();event.stopImmediatePropagation()}return}
  if(eligible())arm(true);
 },{capture:true,passive:false});
 return {sync,clear,lock,get locked(){return locked},get awake(){return awake}};
}
