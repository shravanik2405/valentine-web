Drop local media files in this folder.

Expected GIF files:
- `cat-happy.gif`

Chikki escalation image files:
- `chikki-crying.jpg` (no-level-1)
- `chikki-surprised.jpg` (no-level-2)
- `chikki-angry.jpg` (no-level-3)
- `chikki-laser.jpg` (no-level-4)

Expected audio files:
- `sad.mp3`
- `drama.mp3`
- `war.mp3`
- `tension-loop.mp3`

The app will fall back to emoji visuals if a GIF is missing, and it now plays a synthesized cue if audio files are missing.

Image fallback order in code:
1. `/Users/shravani/Desktop/code/valentine-web/src/assets/*`
2. `/Users/shravani/Desktop/code/valentine-web/public/assets/*`
3. Remote GIF URL
4. Emoji fallback

Audio fallback behavior:
1. `/Users/shravani/Desktop/code/valentine-web/src/assets/*`
2. `/Users/shravani/Desktop/code/valentine-web/public/assets/*`
3. Synthesized Web Audio cue
