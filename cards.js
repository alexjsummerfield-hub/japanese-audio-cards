'use strict';
const CARDS = [
 {id:'hotel-01',prompt:'I have a reservation.',target:'予約しています',kana:'よやくしています',romaji:'Yoyaku shite imasu.',accepted:['予約してます','よやくしてます'],note:'At hotel reception.'},
 {id:'hotel-02',prompt:'Check-in, please.',target:'チェックインをお願いします',kana:'チェックインをおねがいします',romaji:'Chekkuin o onegai shimasu.',accepted:['チェックインお願いします','チェックインおねがいします'],note:''},
 {id:'hotel-03',prompt:'Is a passport okay?',target:'パスポートでいいですか',kana:'パスポートでいいですか',romaji:'Pasupōto de ii desu ka?',accepted:['パスポートで良いですか'],note:'Asking whether your passport is acceptable as identification.'},
 {id:'hotel-04',prompt:'What time is breakfast?',target:'朝食は何時ですか',kana:'ちょうしょくはなんじですか',romaji:'Chōshoku wa nanji desu ka?',accepted:['朝食はなんじですか','ちょうしょくは何時ですか'],note:''},
 {id:'hotel-05',prompt:'Is there Wi-Fi?',target:'ワイファイはありますか',kana:'ワイファイはありますか',romaji:'Waifai wa arimasu ka?',accepted:['Wi-Fiはありますか','WiFiはありますか','ワイファイありますか'],note:''},
 {id:'hotel-06',prompt:'I can’t use the Wi-Fi.',target:'ワイファイが使えません',kana:'ワイファイがつかえません',romaji:'Waifai ga tsukaemasen.',accepted:['Wi-Fiが使えません','WiFiが使えません','Wi-Fiがつかえません'],note:'For example, in your hotel room.'},
 {id:'hotel-07',prompt:'May I leave my luggage?',target:'荷物を預けてもいいですか',kana:'にもつをあずけてもいいですか',romaji:'Nimotsu o azukete mo ii desu ka?',accepted:['荷物を預けても良いですか','荷物をあずけてもいいですか','にもつを預けてもいいですか'],note:'Asking reception to store your luggage.'}
].map(c=>({...c,grammar:[],targets:['hotel'],type:'sentence'}));
function normalizeJapanese(text){
 return text.normalize('NFKC').toLowerCase().replace(/wi[\s‐‑–—-]*fi/g,'ワイファイ').replace(/[\p{P}\p{Z}\s]/gu,'');
}
function matchesJapanese(text,card){
 const value=normalizeJapanese(text);
 return !!value&&[card.target,card.kana,...card.accepted].some(a=>normalizeJapanese(a)===value);
}
