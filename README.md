# Japanese audio cards

Audio-first Japanese for travellers practice, beginning with seven hotel check-in phrases from the 27 October course handout.

## Practice on iPhone

Open the GitHub Pages site in Safari. Choose **Listen and repeat** to hear Japanese first, or **Recall and say** to answer an English prompt from memory. Select the Japanese keyboard and use its microphone to dictate into the answer field. Press Return or Check answer, listen to the model, then tap Next.

No script reading is required. Romaji is shown as an optional aid; Japanese script can be enabled in settings. Browser speech synthesis supplies audio. Settings offer voice previews, normal/slower speech, and a default 1.5-second pause after submission to let keyboard dictation release its audio session.

## Learning history

Progress stays in this browser on this device under the separate `japanese-travel-pilot-v1` storage key. Dictated answer text is not saved. Listen-and-repeat practice does not advance recall intervals. Independent recall reviews use 1, 3, 7, 14 and 30 days; assisted answers and same-session repairs remain due for later review. Skipping does not record a failure. Session summaries count unique phrases, including manually accepted matches.

## Development

A static HTML, CSS and JavaScript app with no dependencies or build step. Serve the repository root with any static HTTP server. GitHub Pages uses the root of the main branch.

The scheduler is reused from the Italian audio cards app. The Italian app and its history are unchanged. Accepted Japanese alternatives are explicit reviewed spellings, not a general semantic or pronunciation grader.

Run checks with `node tests/check-pilot.cjs`. Browser checks covered matching, manual acceptance, skipped-card summaries, both modes and the 390px phone layout. Actual iPhone dictation, keyboard behaviour and audio quality still require device testing.
