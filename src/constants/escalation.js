export const PHASES = Object.freeze({
  ASK: 'ask',
  YES: 'yes',
  NO_LEVEL_1: 'no-level-1',
  NO_LEVEL_2: 'no-level-2',
  NO_LEVEL_3: 'no-level-3',
  NO_LEVEL_4: 'no-level-4',
});

const NO_PHASE_ORDER = [PHASES.ASK, PHASES.NO_LEVEL_1, PHASES.NO_LEVEL_2, PHASES.NO_LEVEL_3, PHASES.NO_LEVEL_4];
const LOCAL_ASSET_URLS = import.meta.glob('../assets/*.{gif,mp3,wav,ogg,m4a,webm}', {
  eager: true,
  import: 'default',
});

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
      fallbackSources: ['/assets/cat-happy.gif', '/assets/happy-cat.gif', 'https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif'],
      alt: 'A sweet kitten waiting for your answer',
      fallbackEmoji: '🐱',
    },
  },
  [PHASES.NO_LEVEL_1]: {
    chip: 'Are you sure?',
    noLabel: 'No',
    media: {
      src: resolveLocalAsset('cat-cry.gif'),
      fallbackSources: ['/assets/cat-cry.gif', '/assets/sad-kitten.gif', 'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif'],
      alt: 'A crying kitten',
      fallbackEmoji: '🥺',
    },
  },
  [PHASES.NO_LEVEL_2]: {
    chip: 'This is unliveable.',
    noLabel: 'No',
    media: {
      src: resolveLocalAsset('cat-surprised.gif'),
      fallbackSources: ['/assets/cat-surprised.gif', '/assets/surprise-kitten.gif', 'https://media.giphy.com/media/5i7umUqAOYYEw/giphy.gif'],
      alt: 'A surprised kitten',
      fallbackEmoji: '😿',
    },
  },
  [PHASES.NO_LEVEL_3]: {
    chip: 'Wrath unleashed.',
    noLabel: 'No',
    media: {
      src: resolveLocalAsset('cat-angry.gif'),
      fallbackSources: ['/assets/cat-angry.gif', '/assets/angry-kitten.gif', 'https://media.giphy.com/media/lJNoBCvQYp7nq/giphy.gif'],
      alt: 'An angry kitten',
      fallbackEmoji: '😾',
    },
  },
  [PHASES.NO_LEVEL_4]: {
    chip: 'Wrath unleashed.',
    noLabel: 'Better say yes.',
    media: {
      src: resolveLocalAsset('cat-angry.gif'),
      fallbackSources: ['/assets/cat-angry.gif', '/assets/angry-kitten.gif', 'https://media.giphy.com/media/lJNoBCvQYp7nq/giphy.gif'],
      alt: 'An angry kitten in full wrath mode',
      fallbackEmoji: '😾',
    },
  },
};

export const PHASE_AUDIO = {
  [PHASES.NO_LEVEL_1]: {
    src: resolveLocalAsset('sad.mp3'),
    volume: 0.28,
    loop: false,
  },
  [PHASES.NO_LEVEL_2]: {
    src: resolveLocalAsset('drama.mp3'),
    volume: 0.32,
    loop: false,
  },
  [PHASES.NO_LEVEL_3]: {
    src: resolveLocalAsset('war.mp3'),
    volume: 0.38,
    loop: false,
  },
  [PHASES.NO_LEVEL_4]: {
    src: resolveLocalAsset('tension-loop.mp3'),
    volume: 0.18,
    loop: true,
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
  fallbackSources: ['/assets/cat-happy.gif', '/assets/happy-cat.gif', 'https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif'],
  alt: 'A happy cat celebrating',
  fallbackEmoji: '😻',
};

export function isWarPhase(phase) {
  return phase === PHASES.NO_LEVEL_3 || phase === PHASES.NO_LEVEL_4;
}
