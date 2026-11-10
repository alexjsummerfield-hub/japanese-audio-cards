# Japanese audio cards

Audio-first Japanese for travellers practice, with 146 cards across fourteen lessons from the supplied course handouts.

## Practice on iPhone

Open the GitHub Pages site in Safari. Choose a lesson and open its preparation list. Each phrase has romaji, contextual keyword meanings and audio buttons for both whole phrases and keywords. Autoplay is the first and default practice option. Choose **Listen and repeat** to hear English followed by Japanese after a half-second pause, or **Recall and say** to answer an English prompt from memory. Select the Japanese keyboard and use its microphone to dictate into the answer field. Press Return or Check answer, listen to the model, then tap Next.

No script reading is required. Romaji is shown as an optional aid; Japanese script can be enabled in settings. Browser speech synthesis supplies audio. Settings offer voice previews, normal (100%), slower (75%) and extra slow (60%) Japanese speech, and a default 1.5-second pause after submission to let keyboard dictation release its audio session.

## Learning history

Progress stays in this browser on this device under the separate `japanese-travel-pilot-v1` storage key. Dictated answer text is not saved. Listen-and-repeat practice does not advance recall intervals. Independent recall reviews use 1, 3, 7, 14 and 30 days; assisted answers and same-session repairs remain due for later review. Skipping does not record a failure. Session summaries count unique phrases, including manually accepted matches.

## Development

A static HTML, CSS and JavaScript app with no dependencies or build step. Serve the repository root with any static HTTP server. GitHub Pages uses the root of the main branch. Lessons are selected separately, with an optional mixed revision pool. Original hotel IDs and all existing device history are retained. See CONTENT-NOTES.md for source mapping and completed placeholder patterns.

The scheduler is reused from the Italian audio cards app. The Italian app and its history are unchanged. Accepted Japanese alternatives are explicit reviewed spellings, not a general semantic or pronunciation grader.

Run checks with `node tests/check-pilot.cjs`. Browser checks covered matching, manual acceptance, skipped-card summaries, both modes and the 390px phone layout. Actual iPhone dictation, keyboard behaviour and audio quality still require device testing.

## Autoplay

Autoplay uses the existing browser voices with the selected Japanese speed. It plays the full selected lesson (or all lessons in course order for mixed revision) three times: once in lesson order, then twice shuffled without replacement. English is followed by a 500ms pause and Japanese. Japanese plays twice on the first pass, separated by 800ms, and once on the two shuffled passes. A 2-second pause precedes the next card. Play/Pause replaces Next; resuming during a phrase restarts that phrase. A pause after completed Japanese continues with the next phrase. The page pauses when hidden; background and lock-screen playback are not included. Autoplay does not write attempts or change recall history. No prerecorded audio or runtime dependencies are used.

## Voices and dimmed controls

Settings offer an English voice chooser and preview using the voices Safari exposes. Automatic selection prefers voices identified as Premium or Enhanced, then a browser default. An explicit choice is remembered. Accessibility’s selected voice is not necessarily exposed to web pages. Compare Japanese speeds plays the same phrase at 100% and then the chosen slower rate (75% when Normal is selected).

During autoplay, **Dim & lock screen** covers the page and blocks its controls without stopping speech. Dimming activates only when you tap its button. Tap once to wake the shield, then separately tap **Unlock controls**. It dims the page rather than adjusting hardware brightness. A supported browser is asked to keep the screen awake during playback; this can be refused by the device. Keep Safari visible: OS lock and background playback are not supported.

The first two lessons teach basic numbers (0–19 and alternative readings) and building larger numbers through 12,345. Models use explicit kana for predictable pronunciation.
