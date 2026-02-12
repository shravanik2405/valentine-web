Drop local media files in this folder.

Expected GIF files:
- `cat-happy.gif`
- `cat-cry.gif`
- `cat-surprised.gif`
- `cat-angry.gif`

Expected audio files:
- `sad.mp3`
- `drama.mp3`
- `war.mp3`
- `tension-loop.mp3`

The app will fall back to emoji visuals if a GIF is missing, and it will fail silently for missing audio.

Image fallback order in code:
1. `/Users/shravani/Desktop/code/valentine-web/src/assets/*`
2. `/Users/shravani/Desktop/code/valentine-web/public/assets/*`
3. Remote GIF URL
4. Emoji fallback
