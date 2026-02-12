function clampVolume(value) {
  if (Number.isNaN(value)) {
    return 1;
  }

  return Math.max(0, Math.min(1, value));
}

export function createAudioManager() {
  let currentAudio = null;
  let audioToken = 0;

  const stop = () => {
    audioToken += 1;

    if (!currentAudio) {
      return;
    }

    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  };

  const play = (src, options = {}) => {
    stop();

    if (!src) {
      return;
    }

    const token = audioToken;
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.loop = Boolean(options.loop);
    audio.volume = clampVolume(options.volume ?? 1);

    currentAudio = audio;

    const clearIfCurrent = () => {
      if (audioToken === token && currentAudio === audio && !audio.loop) {
        currentAudio = null;
      }
    };

    audio.addEventListener('ended', clearIfCurrent, { once: true });
    audio.addEventListener('error', clearIfCurrent, { once: true });

    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        clearIfCurrent();
      });
    }
  };

  return { play, stop };
}
