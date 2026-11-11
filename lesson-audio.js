'use strict';
// Explicit language boundaries keep Japanese examples on the Japanese voice.
const LESSON_AUDIO = {
  "basic-numbers": [
    {
      "lang": "en",
      "text": "Let’s practise counting in short groups. Listen, then say each complete group. First, zero, one, two, three.",
      "display": "Let’s practise counting in short groups. Listen, then say each complete group. First, zero, one, two, three."
    },
    {
      "lang": "ja-JP",
      "text": "ゼロ、いち、に、さん",
      "display": "Zero, ichi, ni, san."
    },
    {
      "lang": "en",
      "text": "Next, four, five, six.",
      "display": "Next, four, five, six."
    },
    {
      "lang": "ja-JP",
      "text": "よん、ご、ろく",
      "display": "Yon, go, roku."
    },
    {
      "lang": "en",
      "text": "Then seven, eight, nine, ten. Notice the longer vowels in nine and ten.",
      "display": "Then seven, eight, nine, ten. Notice the longer vowels in nine and ten."
    },
    {
      "lang": "ja-JP",
      "text": "なな、はち、きゅう、じゅう",
      "display": "Nana, hachi, kyū, jū."
    },
    {
      "lang": "en",
      "text": "Some numbers have another reading. Here is the same first group with another reading of zero.",
      "display": "Some numbers have another reading. Here is the same first group with another reading of zero."
    },
    {
      "lang": "ja-JP",
      "text": "れい、いち、に、さん",
      "display": "Rei, ichi, ni, san."
    },
    {
      "lang": "en",
      "text": "Here is four, five, six with the alternative reading of four.",
      "display": "Here is four, five, six with the alternative reading of four."
    },
    {
      "lang": "ja-JP",
      "text": "し、ご、ろく",
      "display": "Shi, go, roku."
    },
    {
      "lang": "en",
      "text": "And seven to ten, with alternative readings for seven and nine.",
      "display": "And seven to ten, with alternative readings for seven and nine."
    },
    {
      "lang": "ja-JP",
      "text": "しち、はち、く、じゅう",
      "display": "Shichi, hachi, ku, jū."
    },
    {
      "lang": "en",
      "text": "The reading depends on the word that follows. Compare four o’clock, seven o’clock, and nine o’clock.",
      "display": "The reading depends on the word that follows. Compare four o’clock, seven o’clock, and nine o’clock."
    },
    {
      "lang": "ja-JP",
      "text": "よじ、しちじ、くじ",
      "display": "Yo-ji, shichi-ji, ku-ji."
    },
    {
      "lang": "en",
      "text": "For the teens, start with ten and add the next number. Eleven, twelve, thirteen.",
      "display": "For the teens, start with ten and add the next number. Eleven, twelve, thirteen."
    },
    {
      "lang": "ja-JP",
      "text": "じゅういち、じゅうに、じゅうさん",
      "display": "Jū ichi, jū ni, jū san."
    },
    {
      "lang": "en",
      "text": "Now try the counting cards. Say each whole sequence into the Japanese keyboard microphone.",
      "display": "Now try the counting cards. Say each whole sequence into the Japanese keyboard microphone."
    }
  ],
  "building-numbers": [
    {
      "lang": "en",
      "text": "Larger numbers are built from smaller parts. Twenty is two tens. Twenty-one adds one.",
      "display": "Larger numbers are built from smaller parts. Twenty is two tens. Twenty-one adds one."
    },
    {
      "lang": "ja-JP",
      "text": "にじゅう、にじゅういち",
      "display": "Ni-jū, ni-jū ichi."
    },
    {
      "lang": "en",
      "text": "Compare forty, seventy, and ninety.",
      "display": "Compare forty, seventy, and ninety."
    },
    {
      "lang": "ja-JP",
      "text": "よんじゅう、ななじゅう、きゅうじゅう",
      "display": "Yon-jū, nana-jū, kyū-jū."
    },
    {
      "lang": "en",
      "text": "One hundred, two hundred. Then listen for a sound change in three hundred.",
      "display": "One hundred, two hundred. Then listen for a sound change in three hundred."
    },
    {
      "lang": "ja-JP",
      "text": "ひゃく、にひゃく、さんびゃく",
      "display": "Hyaku, ni-hyaku, sanbyaku."
    },
    {
      "lang": "en",
      "text": "Six hundred and eight hundred also change sound. There is a brief hold before the next consonant.",
      "display": "Six hundred and eight hundred also change sound. There is a brief hold before the next consonant."
    },
    {
      "lang": "ja-JP",
      "text": "ろっぴゃく、はっぴゃく",
      "display": "Roppyaku, happyaku."
    },
    {
      "lang": "en",
      "text": "Now one thousand, two thousand, three thousand, and eight thousand. Hear the changes in three thousand and eight thousand.",
      "display": "Now one thousand, two thousand, three thousand, and eight thousand. Hear the changes in three thousand and eight thousand."
    },
    {
      "lang": "ja-JP",
      "text": "せん、にせん、さんぜん、はっせん",
      "display": "Sen, ni-sen, sanzen, hassen."
    },
    {
      "lang": "en",
      "text": "Ten thousand has its own unit.",
      "display": "Ten thousand has its own unit."
    },
    {
      "lang": "ja-JP",
      "text": "いちまん",
      "display": "Ichiman."
    },
    {
      "lang": "en",
      "text": "Put the pieces together for twelve thousand, three hundred and forty-five.",
      "display": "Put the pieces together for twelve thousand, three hundred and forty-five."
    },
    {
      "lang": "ja-JP",
      "text": "いちまんにせんさんびゃくよんじゅうご",
      "display": "Ichiman ni-sen sanbyaku yon-jū go."
    },
    {
      "lang": "en",
      "text": "Missing places are skipped. One hundred and one has no spoken zero.",
      "display": "Missing places are skipped. One hundred and one has no spoken zero."
    },
    {
      "lang": "ja-JP",
      "text": "ひゃくいち",
      "display": "Hyaku ichi."
    },
    {
      "lang": "en",
      "text": "The next lessons add labels and counters to these number sounds.",
      "display": "The next lessons add labels and counters to these number sounds."
    }
  ],
  "number-labels": [
    {
      "lang": "en",
      "text": "An amount and a label are different. Three hundred yen is an amount.",
      "display": "An amount and a label are different. Three hundred yen is an amount."
    },
    {
      "lang": "ja-JP",
      "text": "さんびゃくえんです",
      "display": "Sanbyaku en desu."
    },
    {
      "lang": "en",
      "text": "Room two zero three is a label. Here it is read digit by digit, with zero pronounced as follows.",
      "display": "Room two zero three is a label. Here it is read digit by digit, with zero pronounced as follows."
    },
    {
      "lang": "ja-JP",
      "text": "にまるさん",
      "display": "Ni maru san."
    },
    {
      "lang": "en",
      "text": "The complete room-number sentence is:",
      "display": "The complete room-number sentence is:"
    },
    {
      "lang": "ja-JP",
      "text": "へやはにまるさんごうしつです",
      "display": "Heya wa ni maru san gōshitsu desu."
    },
    {
      "lang": "en",
      "text": "Floor numbers use a floor counter. Japan’s floor one is ground level. Listen to floors one, three, and six.",
      "display": "Floor numbers use a floor counter. Japan’s floor one is ground level. Listen to floors one, three, and six."
    },
    {
      "lang": "ja-JP",
      "text": "いっかい、さんがい、ろっかい",
      "display": "Ikkai, sangai, rokkai."
    },
    {
      "lang": "en",
      "text": "A train carriage number, a bus route label, and a platform number each use different endings. Carriage two; number five bus; platform three.",
      "display": "A train carriage number, a bus route label, and a platform number each use different endings. Carriage two; number five bus; platform three."
    },
    {
      "lang": "ja-JP",
      "text": "にごうしゃ、ごばんのバス、さんばんせん",
      "display": "Ni gōsha; go-ban no basu; san-bansen."
    },
    {
      "lang": "en",
      "text": "Practise these endings inside the complete sentences on the cards.",
      "display": "Practise these endings inside the complete sentences on the cards."
    }
  ],
  "counter-objects": [
    {
      "lang": "en",
      "text": "Choose a counter to fit the thing you mean. General objects can use a special set. One, two, three.",
      "display": "Choose a counter to fit the thing you mean. General objects can use a special set. One, two, three."
    },
    {
      "lang": "ja-JP",
      "text": "ひとつ、ふたつ、みっつ",
      "display": "Hitotsu, futatsu, mittsu."
    },
    {
      "lang": "en",
      "text": "Two of these, please.",
      "display": "Two of these, please."
    },
    {
      "lang": "ja-JP",
      "text": "これをふたつください",
      "display": "Kore o futatsu kudasai."
    },
    {
      "lang": "en",
      "text": "Small individual objects can use another set. Listen to one, six, and eight.",
      "display": "Small individual objects can use another set. Listen to one, six, and eight."
    },
    {
      "lang": "ja-JP",
      "text": "いっこ、ろっこ、はっこ",
      "display": "Ikko, rokko, hakko."
    },
    {
      "lang": "en",
      "text": "Flat items such as tickets use a flat-item counter. Two tickets, please.",
      "display": "Flat items such as tickets use a flat-item counter. Two tickets, please."
    },
    {
      "lang": "ja-JP",
      "text": "きっぷをにまいください",
      "display": "Kippu o ni-mai kudasai."
    },
    {
      "lang": "en",
      "text": "Bottles are long and narrow. One bottle of water, please.",
      "display": "Bottles are long and narrow. One bottle of water, please."
    },
    {
      "lang": "ja-JP",
      "text": "みずをいっぽんください",
      "display": "Mizu o ippon kudasai."
    },
    {
      "lang": "en",
      "text": "A glassful uses a different counter. One glass of water, please.",
      "display": "A glassful uses a different counter. One glass of water, please."
    },
    {
      "lang": "ja-JP",
      "text": "みずをいっぱいください",
      "display": "Mizu o ippai kudasai."
    },
    {
      "lang": "en",
      "text": "The same water uses different counters depending on whether you mean bottles or glasses.",
      "display": "The same water uses different counters depending on whether you mean bottles or glasses."
    }
  ],
  "counter-living": [
    {
      "lang": "en",
      "text": "People have their own counter, with special forms for one and two. One person; two people; four people.",
      "display": "People have their own counter, with special forms for one and two. One person; two people; four people."
    },
    {
      "lang": "ja-JP",
      "text": "ひとり、ふたり、よにん",
      "display": "Hitori, futari, yonin."
    },
    {
      "lang": "en",
      "text": "At a restaurant, to say there are two of us:",
      "display": "At a restaurant, to say there are two of us:"
    },
    {
      "lang": "ja-JP",
      "text": "ふたりです",
      "display": "Futari desu."
    },
    {
      "lang": "en",
      "text": "Small animals such as cats use a different counter. There are two cats.",
      "display": "Small animals such as cats use a different counter. There are two cats."
    },
    {
      "lang": "ja-JP",
      "text": "ねこがにひきいます",
      "display": "Neko ga ni-hiki imasu."
    },
    {
      "lang": "en",
      "text": "Now three cats, then one cat. Listen to the changes at the start of the counter.",
      "display": "Now three cats, then one cat. Listen to the changes at the start of the counter."
    },
    {
      "lang": "ja-JP",
      "text": "ねこがさんびきいます。ねこがいっぴきいます",
      "display": "Neko ga sanbiki imasu. Neko ga ippiki imasu."
    },
    {
      "lang": "en",
      "text": "The verb for the presence of people and animals differs from the one for objects. Two cats; six apples.",
      "display": "The verb for the presence of people and animals differs from the one for objects. Two cats; six apples."
    },
    {
      "lang": "ja-JP",
      "text": "ねこがにひきいます。りんごがろっこあります",
      "display": "Neko ga ni-hiki imasu. Ringo ga rokko arimasu."
    },
    {
      "lang": "en",
      "text": "Practise each counter as part of a complete sentence.",
      "display": "Practise each counter as part of a complete sentence."
    }
  ],
  "counter-days": [
    {
      "lang": "en",
      "text": "A calendar date and a length of time can have different readings. First, today is the first of the month.",
      "display": "A calendar date and a length of time can have different readings. First, today is the first of the month."
    },
    {
      "lang": "ja-JP",
      "text": "きょうはついたちです",
      "display": "Kyō wa tsuitachi desu."
    },
    {
      "lang": "en",
      "text": "Now a stay lasting one day.",
      "display": "Now a stay lasting one day."
    },
    {
      "lang": "ja-JP",
      "text": "いちにちです",
      "display": "Ichinichi desu."
    },
    {
      "lang": "en",
      "text": "The second of the month and two days share a reading. An added ending can make the duration clear. Today is the second; the stay is two days.",
      "display": "The second of the month and two days share a reading. An added ending can make the duration clear. Today is the second; the stay is two days."
    },
    {
      "lang": "ja-JP",
      "text": "きょうはふつかです。ふつかかんです",
      "display": "Kyō wa futsuka desu. Futsuka-kan desu."
    },
    {
      "lang": "en",
      "text": "The eighth and tenth also have special date readings.",
      "display": "The eighth and tenth also have special date readings."
    },
    {
      "lang": "ja-JP",
      "text": "ようか、とおか",
      "display": "Yōka, tōka."
    },
    {
      "lang": "en",
      "text": "To count repetitions, use the times counter. Once more, please.",
      "display": "To count repetitions, use the times counter. Once more, please."
    },
    {
      "lang": "ja-JP",
      "text": "もういっかいおねがいします",
      "display": "Mō ikkai onegai shimasu."
    },
    {
      "lang": "en",
      "text": "The bus runs three times a day.",
      "display": "The bus runs three times a day."
    },
    {
      "lang": "ja-JP",
      "text": "バスはいちにちにさんかいあります",
      "display": "Basu wa ichinichi ni sankai arimasu."
    },
    {
      "lang": "en",
      "text": "Context tells you whether you are naming a date, giving a duration, or counting occurrences.",
      "display": "Context tells you whether you are naming a date, giving a duration, or counting occurrences."
    }
  ]
};
