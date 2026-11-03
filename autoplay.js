'use strict';
const Autoplay = (() => {
 function shuffle(cards,random=Math.random){
  const copy=[...cards];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
  return copy;
 }
 // Each shuffled pass has its own full hat: no card can repeat within a pass.
 function plan(cards,random=Math.random){
  return [[...cards],shuffle(cards,random),shuffle(cards,random)].flatMap((pass,p)=>pass.map((card,i)=>({card,pass:p+1,position:i+1,count:cards.length})));
 }
 return {shuffle,plan};
})();
