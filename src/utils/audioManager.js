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

    const sources = Array.isArray(src) ? src.filter(Boolean) : [src].filter(Boolean);
    if (sources.length === 0) {
      options.onError?.();
      return;
    }

    const token = audioToken;

    const tryPlay = (index) => {
      if (index >= sources.length || audioToken !== token) {
        if (audioToken === token) {
          options.onError?.();
        }
        return;
      }

      const audio = new Audio(sources[index]);
      audio.preload = 'auto';
      audio.loop = Boolean(options.loop);
      audio.volume = clampVolume(options.volume ?? 1);
      currentAudio = audio;

      const clearIfCurrent = () => {
        if (audioToken === token && currentAudio === audio && !audio.loop) {
          currentAudio = null;
        }
      };

      const tryNextSource = () => {
        if (audioToken !== token || currentAudio !== audio) {
          return;
        }
        currentAudio = null;
        tryPlay(index + 1);
      };

      audio.addEventListener('ended', clearIfCurrent, { once: true });
      audio.addEventListener('error', tryNextSource, { once: true });

      const playPromise = audio.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          tryNextSource();
        });
      }
    };

    tryPlay(0);
  };

  return { play, stop };
}
