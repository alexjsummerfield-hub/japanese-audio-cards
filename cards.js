'use strict';
const LESSONS = [
  {
    "id": "introductions",
    "title": "Introductions",
    "description": "Meeting someone for the first time.",
    "sources": [
      "oct6"
    ]
  },
  {
    "id": "greetings",
    "title": "Greetings & courtesy",
    "description": "Everyday greetings and polite expressions.",
    "sources": [
      "oct13",
      "travel"
    ]
  },
  {
    "id": "responses",
    "title": "Simple responses",
    "description": "Yes, no, agreement and a polite negative.",
    "sources": [
      "oct13"
    ]
  },
  {
    "id": "hotel",
    "title": "Hotel check-in",
    "description": "Reservations, breakfast, Wi-Fi and luggage.",
    "sources": [
      "oct27"
    ]
  },
  {
    "id": "transport",
    "title": "Getting around",
    "description": "Stations, trains, tickets and finding places.",
    "sources": [
      "travel"
    ]
  },
  {
    "id": "dining",
    "title": "Eating & drinking",
    "description": "Ordering, asking and paying for a meal.",
    "sources": [
      "travel"
    ]
  },
  {
    "id": "shopping",
    "title": "Shopping & payment",
    "description": "Choosing items, quantities, prices and payment.",
    "sources": [
      "travel"
    ]
  },
  {
    "id": "help",
    "title": "Asking for help",
    "description": "Finding help and reporting a lost passport.",
    "sources": [
      "travel"
    ]
  }
];
const CARDS = [
  {
    "id": "hotel-01",
    "lesson": "hotel",
    "prompt": "I have a reservation.",
    "target": "予約しています",
    "kana": "よやくしています",
    "romaji": "Yoyaku shite imasu.",
    "accepted": [
      "予約してます",
      "よやくしてます"
    ],
    "note": "At hotel reception.",
    "keywords": [
      {
        "romaji": "yoyaku",
        "meaning": "reservation",
        "ja": "よやく"
      },
      {
        "romaji": "yoyaku shite imasu",
        "meaning": "I have a reservation",
        "ja": "よやくしています"
      }
    ],
    "source": "oct27",
    "example": ""
  },
  {
    "id": "hotel-02",
    "lesson": "hotel",
    "prompt": "Check-in, please.",
    "target": "チェックインをお願いします",
    "kana": "チェックインをおねがいします",
    "romaji": "Chekkuin o onegai shimasu.",
    "accepted": [
      "チェックインお願いします",
      "チェックインおねがいします"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "chekkuin",
        "meaning": "check-in",
        "ja": "チェックイン"
      },
      {
        "romaji": "onegai shimasu",
        "meaning": "please; a polite request",
        "ja": "おねがいします"
      }
    ],
    "source": "oct27",
    "example": ""
  },
  {
    "id": "hotel-03",
    "lesson": "hotel",
    "prompt": "Is a passport okay?",
    "target": "パスポートでいいですか",
    "kana": "パスポートでいいですか",
    "romaji": "Pasupōto de ii desu ka?",
    "accepted": [
      "パスポートで良いですか"
    ],
    "note": "Asking whether your passport is acceptable as identification.",
    "keywords": [
      {
        "romaji": "pasupōto",
        "meaning": "passport",
        "ja": "パスポート"
      },
      {
        "romaji": "ii desu ka",
        "meaning": "is it okay?",
        "ja": "いいですか"
      }
    ],
    "source": "oct27",
    "example": ""
  },
  {
    "id": "hotel-04",
    "lesson": "hotel",
    "prompt": "What time is breakfast?",
    "target": "朝食は何時ですか",
    "kana": "ちょうしょくはなんじですか",
    "romaji": "Chōshoku wa nanji desu ka?",
    "accepted": [
      "朝食はなんじですか",
      "ちょうしょくは何時ですか"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "chōshoku",
        "meaning": "breakfast",
        "ja": "ちょうしょく"
      },
      {
        "romaji": "nanji",
        "meaning": "what time",
        "ja": "なんじ"
      },
      {
        "romaji": "desu ka",
        "meaning": "polite question ending",
        "ja": "ですか"
      }
    ],
    "source": "oct27",
    "example": ""
  },
  {
    "id": "hotel-05",
    "lesson": "hotel",
    "prompt": "Is there Wi-Fi?",
    "target": "ワイファイはありますか",
    "kana": "ワイファイはありますか",
    "romaji": "Waifai wa arimasu ka?",
    "accepted": [
      "Wi-Fiはありますか",
      "WiFiはありますか",
      "ワイファイありますか"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "waifai",
        "meaning": "Wi-Fi",
        "ja": "ワイファイ"
      },
      {
        "romaji": "arimasu ka",
        "meaning": "is there? / do you have?",
        "ja": "ありますか"
      }
    ],
    "source": "oct27",
    "example": ""
  },
  {
    "id": "hotel-06",
    "lesson": "hotel",
    "prompt": "I can’t use the Wi-Fi.",
    "target": "ワイファイが使えません",
    "kana": "ワイファイがつかえません",
    "romaji": "Waifai ga tsukaemasen.",
    "accepted": [
      "Wi-Fiが使えません",
      "WiFiが使えません",
      "Wi-Fiがつかえません"
    ],
    "note": "For example, in your hotel room.",
    "keywords": [
      {
        "romaji": "waifai",
        "meaning": "Wi-Fi",
        "ja": "ワイファイ"
      },
      {
        "romaji": "tsukaemasen",
        "meaning": "cannot use",
        "ja": "つかえません"
      }
    ],
    "source": "oct27",
    "example": ""
  },
  {
    "id": "hotel-07",
    "lesson": "hotel",
    "prompt": "May I leave my luggage?",
    "target": "荷物を預けてもいいですか",
    "kana": "にもつをあずけてもいいですか",
    "romaji": "Nimotsu o azukete mo ii desu ka?",
    "accepted": [
      "荷物を預けても良いですか",
      "荷物をあずけてもいいですか",
      "にもつを預けてもいいですか"
    ],
    "note": "Asking reception to store your luggage.",
    "keywords": [
      {
        "romaji": "nimotsu",
        "meaning": "luggage / baggage",
        "ja": "にもつ"
      },
      {
        "romaji": "azukete",
        "meaning": "leave in someone’s care",
        "ja": "あずけて"
      },
      {
        "romaji": "mo ii desu ka",
        "meaning": "may I? / is it okay to?",
        "ja": "もいいですか"
      }
    ],
    "source": "oct27",
    "example": ""
  },
  {
    "id": "introductions-01",
    "lesson": "introductions",
    "prompt": "Nice to meet you.",
    "target": "はじめまして",
    "kana": "はじめまして",
    "romaji": "Hajimemashite.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "hajimemashite",
        "meaning": "greeting when meeting for the first time",
        "ja": "はじめまして"
      }
    ],
    "source": "oct6",
    "example": ""
  },
  {
    "id": "introductions-02",
    "lesson": "introductions",
    "prompt": "My name is Alex.",
    "target": "私の名前はアレックスです",
    "kana": "わたしのなまえはアレックスです",
    "romaji": "Watashi no namae wa Arekkusu desu.",
    "accepted": [
      "わたしの名前はアレックスです",
      "私のなまえはアレックスです",
      "名前はアレックスです"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "watashi",
        "meaning": "I / me",
        "ja": "わたし"
      },
      {
        "romaji": "namae",
        "meaning": "name",
        "ja": "なまえ"
      },
      {
        "romaji": "Arekkusu",
        "meaning": "Alex",
        "ja": "アレックス"
      },
      {
        "romaji": "desu",
        "meaning": "polite sentence ending: am / is",
        "ja": "です"
      }
    ],
    "source": "oct6",
    "example": "The handout’s name blank is filled with Alex."
  },
  {
    "id": "introductions-03",
    "lesson": "introductions",
    "prompt": "I am Australian.",
    "target": "私はオーストラリア人です",
    "kana": "わたしはオーストラリアじんです",
    "romaji": "Watashi wa Ōsutoraria-jin desu.",
    "accepted": [
      "オーストラリア人です",
      "オーストラリアじんです",
      "わたしはオーストラリア人です"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "Ōsutoraria",
        "meaning": "Australia",
        "ja": "オーストラリア"
      },
      {
        "romaji": "jin",
        "meaning": "person; nationality suffix here",
        "ja": "じん"
      },
      {
        "romaji": "desu",
        "meaning": "am / is, politely",
        "ja": "です"
      }
    ],
    "source": "oct6",
    "example": ""
  },
  {
    "id": "introductions-04",
    "lesson": "introductions",
    "prompt": "What is your name?",
    "target": "あなたの名前は何ですか",
    "kana": "あなたのなまえはなんですか",
    "romaji": "Anata no namae wa nan desu ka?",
    "accepted": [
      "あなたの名前はなんですか",
      "あなたのなまえは何ですか"
    ],
    "note": "The wording taught in class; in conversation, names and “you” are often omitted.",
    "keywords": [
      {
        "romaji": "anata",
        "meaning": "you",
        "ja": "あなた"
      },
      {
        "romaji": "namae",
        "meaning": "name",
        "ja": "なまえ"
      },
      {
        "romaji": "nan",
        "meaning": "what",
        "ja": "なん"
      },
      {
        "romaji": "ka",
        "meaning": "question ending",
        "ja": "か"
      }
    ],
    "source": "oct6",
    "example": ""
  },
  {
    "id": "introductions-05",
    "lesson": "introductions",
    "prompt": "Pleased to meet you.",
    "target": "よろしくお願いします",
    "kana": "よろしくおねがいします",
    "romaji": "Yoroshiku onegai shimasu.",
    "accepted": [],
    "note": "Said as part of introducing yourself, after the first greeting.",
    "keywords": [
      {
        "romaji": "yoroshiku onegai shimasu",
        "meaning": "a polite introduction formula; pleased to meet you",
        "ja": "よろしくおねがいします"
      }
    ],
    "source": "oct6",
    "example": ""
  },
  {
    "id": "greetings-01",
    "lesson": "greetings",
    "prompt": "Good morning.",
    "target": "おはようございます",
    "kana": "おはようございます",
    "romaji": "Ohayō gozaimasu.",
    "accepted": [],
    "note": "Use the polite form.",
    "keywords": [
      {
        "romaji": "ohayō",
        "meaning": "good morning, casually",
        "ja": "おはよう"
      },
      {
        "romaji": "gozaimasu",
        "meaning": "adds politeness in this greeting",
        "ja": "ございます"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-02",
    "lesson": "greetings",
    "prompt": "Hello.",
    "target": "こんにちは",
    "kana": "こんにちは",
    "romaji": "Konnichiwa.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "konnichiwa",
        "meaning": "hello / good afternoon",
        "ja": "こんにちは"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-03",
    "lesson": "greetings",
    "prompt": "Good evening.",
    "target": "こんばんは",
    "kana": "こんばんは",
    "romaji": "Konbanwa.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "konbanwa",
        "meaning": "good evening",
        "ja": "こんばんは"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-04",
    "lesson": "greetings",
    "prompt": "Goodbye.",
    "target": "さようなら",
    "kana": "さようなら",
    "romaji": "Sayōnara.",
    "accepted": [
      "さよなら"
    ],
    "note": "Use sayōnara for this course phrase; for a casual “see you”, use the next phrase.",
    "keywords": [
      {
        "romaji": "sayōnara",
        "meaning": "goodbye; a more lasting farewell",
        "ja": "さようなら"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-05",
    "lesson": "greetings",
    "prompt": "See you again.",
    "target": "じゃまた",
    "kana": "じゃまた",
    "romaji": "Ja mata.",
    "accepted": [
      "ではまた",
      "じゃあまた"
    ],
    "note": "Casual farewell.",
    "keywords": [
      {
        "romaji": "mata",
        "meaning": "again",
        "ja": "また"
      },
      {
        "romaji": "ja mata",
        "meaning": "see you, casually",
        "ja": "じゃまた"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-06",
    "lesson": "greetings",
    "prompt": "Thank you.",
    "target": "ありがとうございます",
    "kana": "ありがとうございます",
    "romaji": "Arigatō gozaimasu.",
    "accepted": [],
    "note": "Use the polite form.",
    "keywords": [
      {
        "romaji": "arigatō",
        "meaning": "thank you",
        "ja": "ありがとう"
      },
      {
        "romaji": "gozaimasu",
        "meaning": "adds politeness here",
        "ja": "ございます"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-07",
    "lesson": "greetings",
    "prompt": "Excuse me.",
    "target": "すみません",
    "kana": "すみません",
    "romaji": "Sumimasen.",
    "accepted": [],
    "note": "Getting someone’s attention politely.",
    "keywords": [
      {
        "romaji": "sumimasen",
        "meaning": "excuse me / sorry; also used to express appreciation",
        "ja": "すみません"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-08",
    "lesson": "greetings",
    "prompt": "Please.",
    "target": "お願いします",
    "kana": "おねがいします",
    "romaji": "Onegai shimasu.",
    "accepted": [],
    "note": "Use onegai shimasu for this course phrase.",
    "keywords": [
      {
        "romaji": "onegai shimasu",
        "meaning": "please; a polite request expression",
        "ja": "おねがいします"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-09",
    "lesson": "greetings",
    "prompt": "Here you are.",
    "target": "どうぞ",
    "kana": "どうぞ",
    "romaji": "Dōzo.",
    "accepted": [],
    "note": "Offering something to someone.",
    "keywords": [
      {
        "romaji": "dōzo",
        "meaning": "here you are / please go ahead",
        "ja": "どうぞ"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "greetings-10",
    "lesson": "greetings",
    "prompt": "How are you?",
    "target": "お元気ですか",
    "kana": "おげんきですか",
    "romaji": "Ogenki desu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "genki",
        "meaning": "well / in good spirits",
        "ja": "げんき"
      },
      {
        "romaji": "desu ka",
        "meaning": "polite question ending",
        "ja": "ですか"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "responses-01",
    "lesson": "responses",
    "prompt": "Yes.",
    "target": "はい",
    "kana": "はい",
    "romaji": "Hai.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "hai",
        "meaning": "yes",
        "ja": "はい"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "responses-02",
    "lesson": "responses",
    "prompt": "No.",
    "target": "いいえ",
    "kana": "いいえ",
    "romaji": "Iie.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "iie",
        "meaning": "no",
        "ja": "いいえ"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "responses-03",
    "lesson": "responses",
    "prompt": "It’s okay.",
    "target": "大丈夫です",
    "kana": "だいじょうぶです",
    "romaji": "Daijōbu desu.",
    "accepted": [],
    "note": "Reassuring someone that things are okay. In other situations this phrase can politely decline something.",
    "keywords": [
      {
        "romaji": "daijōbu",
        "meaning": "okay / all right",
        "ja": "だいじょうぶ"
      },
      {
        "romaji": "desu",
        "meaning": "polite sentence ending",
        "ja": "です"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "responses-04",
    "lesson": "responses",
    "prompt": "That’s right.",
    "target": "そうです",
    "kana": "そうです",
    "romaji": "Sō desu.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "sō",
        "meaning": "so / that way",
        "ja": "そう"
      },
      {
        "romaji": "sō desu",
        "meaning": "that’s right",
        "ja": "そうです"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "responses-05",
    "lesson": "responses",
    "prompt": "That’s not right.",
    "target": "違います",
    "kana": "ちがいます",
    "romaji": "Chigaimasu.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "chigaimasu",
        "meaning": "is different / is not correct",
        "ja": "ちがいます"
      }
    ],
    "source": ["oct13", "travel"],
    "example": ""
  },
  {
    "id": "responses-06",
    "lesson": "responses",
    "prompt": "I am not Australian.",
    "target": "私はオーストラリア人ではありません",
    "kana": "わたしはオーストラリアじんではありません",
    "romaji": "Watashi wa Ōsutoraria-jin dewa arimasen.",
    "accepted": [
      "私はオーストラリア人じゃありません",
      "わたしはオーストラリアじんじゃありません",
      "オーストラリア人ではありません",
      "オーストラリア人じゃありません"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "Ōsutoraria-jin",
        "meaning": "Australian person",
        "ja": "オーストラリアじん"
      },
      {
        "romaji": "dewa arimasen",
        "meaning": "am not / is not, politely",
        "ja": "ではありません"
      }
    ],
    "source": ["oct13", "travel"],
    "example": "The negative pattern uses Australian, already introduced in lesson 1."
  },
  {
    "id": "transport-01",
    "lesson": "transport",
    "prompt": "Where is the station?",
    "target": "駅はどこですか",
    "kana": "えきはどこですか",
    "romaji": "Eki wa doko desu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "eki",
        "meaning": "station",
        "ja": "えき"
      },
      {
        "romaji": "doko",
        "meaning": "where",
        "ja": "どこ"
      }
    ],
    "source": "travel",
    "example": "The place blank is filled with station, used in the supplied travel material."
  },
  {
    "id": "transport-02",
    "lesson": "transport",
    "prompt": "Does this train go to Tokyo?",
    "target": "この電車は東京に行きますか",
    "kana": "このでんしゃはとうきょうにいきますか",
    "romaji": "Kono densha wa Tōkyō ni ikimasu ka?",
    "accepted": [
      "この電車は東京にいきますか",
      "このでんしゃは東京に行きますか"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "kono",
        "meaning": "this, before a noun",
        "ja": "この"
      },
      {
        "romaji": "densha",
        "meaning": "train",
        "ja": "でんしゃ"
      },
      {
        "romaji": "Tōkyō",
        "meaning": "Tokyo",
        "ja": "とうきょう"
      },
      {
        "romaji": "ikimasu ka",
        "meaning": "does it go?",
        "ja": "いきますか"
      }
    ],
    "source": "travel",
    "example": "Tokyo fills the destination blank; hear and learn Tōkyō here before practising."
  },
  {
    "id": "transport-03",
    "lesson": "transport",
    "prompt": "A ticket, please.",
    "target": "切符をください",
    "kana": "きっぷをください",
    "romaji": "Kippu o kudasai.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "kippu",
        "meaning": "ticket",
        "ja": "きっぷ"
      },
      {
        "romaji": "kudasai",
        "meaning": "please give me, in this request",
        "ja": "ください"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "transport-04",
    "lesson": "transport",
    "prompt": "Where do I transfer?",
    "target": "乗り換えはどこですか",
    "kana": "のりかえはどこですか",
    "romaji": "Norikae wa doko desu ka?",
    "accepted": [
      "乗換はどこですか",
      "乗りかえはどこですか"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "norikae",
        "meaning": "transfer / changing trains",
        "ja": "のりかえ"
      },
      {
        "romaji": "doko",
        "meaning": "where",
        "ja": "どこ"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "transport-05",
    "lesson": "transport",
    "prompt": "Where is the bus stop?",
    "target": "バス停はどこですか",
    "kana": "バスていはどこですか",
    "romaji": "Basutei wa doko desu ka?",
    "accepted": [
      "ばすていはどこですか"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "basutei",
        "meaning": "bus stop",
        "ja": "バスてい"
      },
      {
        "romaji": "doko desu ka",
        "meaning": "where is it?",
        "ja": "どこですか"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "transport-06",
    "lesson": "transport",
    "prompt": "Please show me a map.",
    "target": "地図を見せてください",
    "kana": "ちずをみせてください",
    "romaji": "Chizu o misete kudasai.",
    "accepted": [
      "地図をみせてください",
      "ちずを見せてください"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "chizu",
        "meaning": "map",
        "ja": "ちず"
      },
      {
        "romaji": "misete kudasai",
        "meaning": "please show me",
        "ja": "みせてください"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "transport-07",
    "lesson": "transport",
    "prompt": "I’ll get off here.",
    "target": "ここで降ります",
    "kana": "ここでおります",
    "romaji": "Koko de orimasu.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "koko",
        "meaning": "here",
        "ja": "ここ"
      },
      {
        "romaji": "orimasu",
        "meaning": "get off",
        "ja": "おります"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "transport-08",
    "lesson": "transport",
    "prompt": "Where is the toilet?",
    "target": "トイレはどこですか",
    "kana": "トイレはどこですか",
    "romaji": "Toire wa doko desu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "toire",
        "meaning": "toilet / restroom",
        "ja": "トイレ"
      },
      {
        "romaji": "doko",
        "meaning": "where",
        "ja": "どこ"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-01",
    "lesson": "dining",
    "prompt": "A menu, please.",
    "target": "メニューをください",
    "kana": "メニューをください",
    "romaji": "Menyū o kudasai.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "menyū",
        "meaning": "menu",
        "ja": "メニュー"
      },
      {
        "romaji": "kudasai",
        "meaning": "please give me",
        "ja": "ください"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-02",
    "lesson": "dining",
    "prompt": "What do you recommend?",
    "target": "おすすめは何ですか",
    "kana": "おすすめはなんですか",
    "romaji": "Osusume wa nan desu ka?",
    "accepted": [
      "お勧めは何ですか",
      "お勧めはなんですか"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "osusume",
        "meaning": "recommendation",
        "ja": "おすすめ"
      },
      {
        "romaji": "nan",
        "meaning": "what",
        "ja": "なん"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-03",
    "lesson": "dining",
    "prompt": "Is breakfast available?",
    "target": "朝食はありますか",
    "kana": "ちょうしょくはありますか",
    "romaji": "Chōshoku wa arimasu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "chōshoku",
        "meaning": "breakfast; from the hotel lesson",
        "ja": "ちょうしょく"
      },
      {
        "romaji": "arimasu ka",
        "meaning": "is there? / do you have?",
        "ja": "ありますか"
      }
    ],
    "source": "travel",
    "example": "The item blank uses breakfast from the hotel lesson."
  },
  {
    "id": "dining-04",
    "lesson": "dining",
    "prompt": "I’m vegetarian.",
    "target": "ベジタリアンです",
    "kana": "ベジタリアンです",
    "romaji": "Bejitarian desu.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "bejitarian",
        "meaning": "vegetarian",
        "ja": "ベジタリアン"
      },
      {
        "romaji": "desu",
        "meaning": "am / is, politely",
        "ja": "です"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-05",
    "lesson": "dining",
    "prompt": "Water, please.",
    "target": "お水をください",
    "kana": "おみずをください",
    "romaji": "Omizu o kudasai.",
    "accepted": [
      "水をください",
      "みずをください"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "omizu",
        "meaning": "water, politely",
        "ja": "おみず"
      },
      {
        "romaji": "kudasai",
        "meaning": "please give me",
        "ja": "ください"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-06",
    "lesson": "dining",
    "prompt": "Thank you for the food.",
    "target": "いただきます",
    "kana": "いただきます",
    "romaji": "Itadakimasu.",
    "accepted": [],
    "note": "Before eating; use itadakimasu.",
    "keywords": [
      {
        "romaji": "itadakimasu",
        "meaning": "a set expression of gratitude before eating",
        "ja": "いただきます"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-07",
    "lesson": "dining",
    "prompt": "Thank you for the meal.",
    "target": "ごちそうさまでした",
    "kana": "ごちそうさまでした",
    "romaji": "Gochisōsama deshita.",
    "accepted": [],
    "note": "After eating.",
    "keywords": [
      {
        "romaji": "gochisōsama deshita",
        "meaning": "a set expression of gratitude after eating",
        "ja": "ごちそうさまでした"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-08",
    "lesson": "dining",
    "prompt": "Separate bills, please.",
    "target": "別々でお願いします",
    "kana": "べつべつでおねがいします",
    "romaji": "Betsubetsu de onegai shimasu.",
    "accepted": [
      "別々でおねがいします",
      "べつべつでお願いします"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "betsubetsu",
        "meaning": "separately",
        "ja": "べつべつ"
      },
      {
        "romaji": "onegai shimasu",
        "meaning": "please",
        "ja": "おねがいします"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-09",
    "lesson": "dining",
    "prompt": "The bill, please.",
    "target": "お会計をお願いします",
    "kana": "おかいけいをおねがいします",
    "romaji": "Okaikei o onegai shimasu.",
    "accepted": [
      "お会計お願いします",
      "おかいけいおねがいします"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "okaikei",
        "meaning": "bill / paying the bill",
        "ja": "おかいけい"
      },
      {
        "romaji": "onegai shimasu",
        "meaning": "please",
        "ja": "おねがいします"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "dining-10",
    "lesson": "dining",
    "prompt": "It’s delicious.",
    "target": "おいしいです",
    "kana": "おいしいです",
    "romaji": "Oishii desu.",
    "accepted": [
      "美味しいです"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "oishii",
        "meaning": "delicious",
        "ja": "おいしい"
      },
      {
        "romaji": "desu",
        "meaning": "polite sentence ending",
        "ja": "です"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "shopping-01",
    "lesson": "shopping",
    "prompt": "How much is it?",
    "target": "いくらですか",
    "kana": "いくらですか",
    "romaji": "Ikura desu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "ikura",
        "meaning": "how much",
        "ja": "いくら"
      },
      {
        "romaji": "desu ka",
        "meaning": "polite question ending",
        "ja": "ですか"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "shopping-02",
    "lesson": "shopping",
    "prompt": "I’ll take this.",
    "target": "これをください",
    "kana": "これをください",
    "romaji": "Kore o kudasai.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "kore",
        "meaning": "this thing",
        "ja": "これ"
      },
      {
        "romaji": "kudasai",
        "meaning": "please give me",
        "ja": "ください"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "shopping-03",
    "lesson": "shopping",
    "prompt": "Can I use a credit card?",
    "target": "クレジットカードは使えますか",
    "kana": "クレジットカードはつかえますか",
    "romaji": "Kurejitto kādo wa tsukaemasu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "kurejitto kādo",
        "meaning": "credit card",
        "ja": "クレジットカード"
      },
      {
        "romaji": "tsukaemasu ka",
        "meaning": "can I use?",
        "ja": "つかえますか"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "shopping-04",
    "lesson": "shopping",
    "prompt": "Please show me this.",
    "target": "これを見せてください",
    "kana": "これをみせてください",
    "romaji": "Kore o misete kudasai.",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "kore",
        "meaning": "this thing; from “I’ll take this”",
        "ja": "これ"
      },
      {
        "romaji": "misete kudasai",
        "meaning": "please show me; from the map request",
        "ja": "みせてください"
      }
    ],
    "source": "travel",
    "example": "The object blank uses kore, already introduced in this lesson."
  },
  {
    "id": "shopping-05",
    "lesson": "shopping",
    "prompt": "One of these, please.",
    "target": "これを一個ください",
    "kana": "これをいっこください",
    "romaji": "Kore o ikko kudasai.",
    "accepted": [
      "これを1個ください",
      "これを一こください",
      "これを1こください"
    ],
    "note": "For a small item counted with ko.",
    "keywords": [
      {
        "romaji": "kore",
        "meaning": "this thing",
        "ja": "これ"
      },
      {
        "romaji": "ikko",
        "meaning": "one item, with the counter ko",
        "ja": "いっこ"
      },
      {
        "romaji": "kudasai",
        "meaning": "please give me",
        "ja": "ください"
      }
    ],
    "source": "travel",
    "example": "The item blank uses kore; ikko is introduced here from the handout’s one-item pattern."
  },
  {
    "id": "shopping-06",
    "lesson": "shopping",
    "prompt": "Is tax-free shopping available?",
    "target": "免税できますか",
    "kana": "めんぜいできますか",
    "romaji": "Menzei dekimasu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "menzei",
        "meaning": "tax exemption / tax-free",
        "ja": "めんぜい"
      },
      {
        "romaji": "dekimasu ka",
        "meaning": "is it possible?",
        "ja": "できますか"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "shopping-07",
    "lesson": "shopping",
    "prompt": "Do you need a bag?",
    "target": "袋は要りますか",
    "kana": "ふくろはいりますか",
    "romaji": "Fukuro wa irimasu ka?",
    "accepted": [
      "袋はいりますか"
    ],
    "note": "A question you may hear from shop staff; practise recognising it too.",
    "keywords": [
      {
        "romaji": "fukuro",
        "meaning": "bag",
        "ja": "ふくろ"
      },
      {
        "romaji": "irimasu ka",
        "meaning": "do you need?",
        "ja": "いりますか"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "help-01",
    "lesson": "help",
    "prompt": "Please help!",
    "target": "助けてください",
    "kana": "たすけてください",
    "romaji": "Tasukete kudasai!",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "tasukete",
        "meaning": "help me",
        "ja": "たすけて"
      },
      {
        "romaji": "kudasai",
        "meaning": "please",
        "ja": "ください"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "help-02",
    "lesson": "help",
    "prompt": "Where is the hospital?",
    "target": "病院はどこですか",
    "kana": "びょういんはどこですか",
    "romaji": "Byōin wa doko desu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "byōin",
        "meaning": "hospital",
        "ja": "びょういん"
      },
      {
        "romaji": "doko",
        "meaning": "where",
        "ja": "どこ"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "help-03",
    "lesson": "help",
    "prompt": "Where is the pharmacy?",
    "target": "薬局はどこですか",
    "kana": "やっきょくはどこですか",
    "romaji": "Yakkyoku wa doko desu ka?",
    "accepted": [],
    "note": "",
    "keywords": [
      {
        "romaji": "yakkyoku",
        "meaning": "pharmacy",
        "ja": "やっきょく"
      },
      {
        "romaji": "doko",
        "meaning": "where",
        "ja": "どこ"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "help-04",
    "lesson": "help",
    "prompt": "Please call the police.",
    "target": "警察を呼んでください",
    "kana": "けいさつをよんでください",
    "romaji": "Keisatsu o yonde kudasai.",
    "accepted": [
      "警察をよんでください",
      "けいさつを呼んでください"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "keisatsu",
        "meaning": "police",
        "ja": "けいさつ"
      },
      {
        "romaji": "yonde kudasai",
        "meaning": "please call",
        "ja": "よんでください"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "help-05",
    "lesson": "help",
    "prompt": "I’m lost.",
    "target": "道に迷いました",
    "kana": "みちにまよいました",
    "romaji": "Michi ni mayoimashita.",
    "accepted": [
      "道にまよいました"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "michi",
        "meaning": "way / road",
        "ja": "みち"
      },
      {
        "romaji": "mayoimashita",
        "meaning": "got lost",
        "ja": "まよいました"
      }
    ],
    "source": "travel",
    "example": ""
  },
  {
    "id": "help-06",
    "lesson": "help",
    "prompt": "I lost my passport.",
    "target": "パスポートをなくしました",
    "kana": "パスポートをなくしました",
    "romaji": "Pasupōto o nakushimashita.",
    "accepted": [
      "パスポートを無くしました",
      "パスポートを失くしました"
    ],
    "note": "",
    "keywords": [
      {
        "romaji": "pasupōto",
        "meaning": "passport; from the hotel lesson",
        "ja": "パスポート"
      },
      {
        "romaji": "nakushimashita",
        "meaning": "lost something",
        "ja": "なくしました"
      }
    ],
    "source": "travel",
    "example": "The lost-item blank uses passport from the hotel lesson."
  }
].map(c=>({...c,grammar:[],targets:[c.lesson],type:'sentence'}));
function normalizeJapanese(text){
 return text.normalize('NFKC').toLowerCase().replace(/wi[\s‐‑–—-]*fi/g,'ワイファイ').replace(/[\p{P}\p{Z}\s]/gu,'');
}
function matchesJapanese(text,card){
 const value=normalizeJapanese(text);
 return !!value&&[card.target,card.kana,...card.accepted].some(a=>normalizeJapanese(a)===value);
}
