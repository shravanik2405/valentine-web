export const PHASES = Object.freeze({
  ASK: 'ask',
  YES: 'yes',
  NO_LEVEL_1: 'no-level-1',
  NO_LEVEL_2: 'no-level-2',
  NO_LEVEL_3: 'no-level-3',
  NO_LEVEL_4: 'no-level-4',
});

const NO_PHASE_ORDER = [PHASES.ASK, PHASES.NO_LEVEL_1, PHASES.NO_LEVEL_2, PHASES.NO_LEVEL_3, PHASES.NO_LEVEL_4];
const LOCAL_ASSET_URLS = import.meta.glob('../assets/*.{gif,png,jpg,jpeg,webp,mp3,wav,ogg,m4a,webm}', {
  eager: true,
  import: 'default',
});
const HAPPY_GIF_FALLBACK_URL = 'https://media.giphy.com/media/uKvAWApE3vWL1MAASf/giphy.gif';

function resolveLocalAsset(fileName) {
  const key = `../assets/${fileName}`;
  return LOCAL_ASSET_URLS[key] ?? `/src/assets/${fileName}`;
}

export function getPhaseFromNoCount(noCount) {
  const safeCount = Math.max(0, Math.min(4, noCount));
  return NO_PHASE_ORDER[safeCount];
}

export const QUESTION_PHASE_CONTENT = {
  [PHASES.ASK]: {
    chip: '',
    noLabel: 'No',
    media: {
      src: resolveLocalAsset('cat-happy.gif'),
      fallbackSources: ['/assets/cat-happy.gif', '/assets/happy-cat.gif', HAPPY_GIF_FALLBACK_URL],
      alt: 'A sweet kitten waiting for your answer',
      fallbackEmoji: '🐱',
    },
  },
  [PHASES.NO_LEVEL_1]: {
    chip: 'Are you sure?',
    noLabel: 'No',
    media: {
      src: resolveLocalAsset('chikki-crying.jpg'),
      fallbackSources: ['/assets/chikki-crying.jpg'],
      alt: 'Crying Chikki peeking from a bag',
      fallbackEmoji: '🥺',
    },
  },
  [PHASES.NO_LEVEL_2]: {
    chip: 'This is unliveable.',
    noLabel: 'No',
    media: {
      src: resolveLocalAsset('chikki-surprised.jpg'),
      fallbackSources: ['/assets/chikki-surprised.jpg'],
      alt: 'Surprised Chikki with a wide-open expression',
      fallbackEmoji: '😿',
    },
  },
  [PHASES.NO_LEVEL_3]: {
    chip: 'Wrath unleashed.',
    noLabel: 'No',
    media: {
      src: resolveLocalAsset('chikki-angry.jpg'),
      fallbackSources: ['/assets/chikki-angry.jpg'],
      alt: 'Angry Chikki in tunnel mode',
      fallbackEmoji: '😾',
    },
  },
  [PHASES.NO_LEVEL_4]: {
    chip: 'Wrath unleashed.',
    noLabel: 'Better say yes.',
    media: {
      src: resolveLocalAsset('chikki-laser.jpg'),
      fallbackSources: ['/assets/chikki-laser.jpg'],
      alt: 'Laser Chikki in full wrath mode',
      fallbackEmoji: '😾',
    },
  },
};

export const PHASE_AUDIO = {
  [PHASES.NO_LEVEL_1]: {
    src: resolveLocalAsset('sad.mp3'),
    fallbackSources: ['/assets/sad.mp3', '/assets/cat-sad.mp3'],
    volume: 0.28,
    loop: false,
    fallbackCue: 'sad',
  },
  [PHASES.NO_LEVEL_2]: {
    src: resolveLocalAsset('drama.mp3'),
    fallbackSources: ['/assets/drama.mp3', '/assets/cat-drama.mp3'],
    volume: 0.32,
    loop: false,
    fallbackCue: 'drama',
  },
  [PHASES.NO_LEVEL_3]: {
    src: resolveLocalAsset('war.mp3'),
    fallbackSources: ['/assets/war.mp3', '/assets/cat-war.mp3'],
    volume: 0.38,
    loop: false,
    fallbackCue: 'war',
  },
  [PHASES.NO_LEVEL_4]: {
    src: resolveLocalAsset('tension-loop.mp3'),
    fallbackSources: ['/assets/tension-loop.mp3', '/assets/tension.mp3'],
    volume: 0.18,
    loop: true,
    fallbackCue: 'tension',
  },
};

export function getShakeLevelForPhase(phase) {
  if (phase === PHASES.NO_LEVEL_1) {
    return { card: 1, screen: 0 };
  }

  if (phase === PHASES.NO_LEVEL_2) {
    return { card: 2, screen: 1 };
  }

  if (phase === PHASES.NO_LEVEL_3) {
    return { card: 3, screen: 2 };
  }

  return { card: 0, screen: 0 };
}

export const HAPPY_CAT_MEDIA = {
  src: resolveLocalAsset('cat-happy.gif'),
  fallbackSources: ['/assets/cat-happy.gif', '/assets/happy-cat.gif', HAPPY_GIF_FALLBACK_URL],
  alt: 'A happy cat celebrating',
  fallbackEmoji: '😻',
};

export function isWarPhase(phase) {
  return phase === PHASES.NO_LEVEL_3 || phase === PHASES.NO_LEVEL_4;
}
