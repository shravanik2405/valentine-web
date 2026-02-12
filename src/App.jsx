import { useEffect, useMemo, useRef, useState } from 'react';
import { QuestionCard } from './components/QuestionCard';
import { ResultPanel } from './components/ResultPanel';
import {
  PHASE_AUDIO,
  PHASES,
  getPhaseFromNoCount,
  getShakeLevelForPhase,
  isWarPhase,
} from './constants/escalation';
import { createAudioManager } from './utils/audioManager';

const DEBRIS_PARTICLES = [
  { left: '8%', size: '0.6rem', delay: '0s', duration: '7.4s', drift: '-26px' },
  { left: '17%', size: '0.78rem', delay: '0.25s', duration: '8.1s', drift: '22px' },
  { left: '28%', size: '0.56rem', delay: '0.65s', duration: '7.8s', drift: '-18px' },
  { left: '39%', size: '0.68rem', delay: '0.35s', duration: '8.8s', drift: '20px' },
  { left: '49%', size: '0.52rem', delay: '0.1s', duration: '7.1s', drift: '-12px' },
  { left: '57%', size: '0.82rem', delay: '0.55s', duration: '8.6s', drift: '28px' },
  { left: '69%', size: '0.6rem', delay: '0.45s', duration: '7.5s', drift: '-22px' },
  { left: '78%', size: '0.72rem', delay: '0.2s', duration: '8.2s', drift: '18px' },
  { left: '90%', size: '0.5rem', delay: '0.4s', duration: '7.9s', drift: '-15px' },
];

const SCENE_CLASS_BY_PHASE = {
  [PHASES.ASK]: 'scene-ask',
  [PHASES.NO_LEVEL_1]: 'scene-no-1',
  [PHASES.NO_LEVEL_2]: 'scene-no-2',
  [PHASES.NO_LEVEL_3]: 'scene-no-3',
  [PHASES.NO_LEVEL_4]: 'scene-no-4',
  [PHASES.YES]: 'scene-yes',
};

function getRandomCompatibilityScore() {
  return 92 + Math.floor(Math.random() * 9);
}

function getShakeClass(prefix, level) {
  if (level === 1) {
    return `${prefix}-soft`;
  }

  if (level === 2) {
    return `${prefix}-medium`;
  }

  if (level === 3) {
    return `${prefix}-hard`;
  }

  return '';
}

function App() {
  const [phase, setPhase] = useState(PHASES.ASK);
  const [noCount, setNoCount] = useState(0);
  const [cardShakeLevel, setCardShakeLevel] = useState(0);
  const [screenShakeLevel, setScreenShakeLevel] = useState(0);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [yesTransitioning, setYesTransitioning] = useState(false);
  const [isPawBurstActive, setIsPawBurstActive] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState(() => getRandomCompatibilityScore());

  const audioManagerRef = useRef(createAudioManager());
  const cueContextRef = useRef(null);
  const cueNodesRef = useRef([]);
  const cardShakeTimerRef = useRef(null);
  const cardShakeRafRef = useRef(null);
  const screenShakeTimerRef = useRef(null);
  const screenShakeRafRef = useRef(null);
  const flashTimerRef = useRef(null);
  const flashRafRef = useRef(null);
  const yesTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (cardShakeTimerRef.current) {
        clearTimeout(cardShakeTimerRef.current);
      }
      if (cardShakeRafRef.current) {
        cancelAnimationFrame(cardShakeRafRef.current);
      }
      if (screenShakeTimerRef.current) {
        clearTimeout(screenShakeTimerRef.current);
      }
      if (screenShakeRafRef.current) {
        cancelAnimationFrame(screenShakeRafRef.current);
      }
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
      if (flashRafRef.current) {
        cancelAnimationFrame(flashRafRef.current);
      }
      if (yesTimerRef.current) {
        clearTimeout(yesTimerRef.current);
      }
      audioManagerRef.current.stop();
      cueNodesRef.current.forEach(({ oscillator, gain }) => {
        try {
          oscillator.stop();
        } catch {
          // oscillator might already be stopped
        }
        try {
          oscillator.disconnect();
          gain.disconnect();
        } catch {
          // ignore disconnect errors
        }
      });
      cueNodesRef.current = [];

      if (cueContextRef.current) {
        cueContextRef.current.close().catch(() => {});
      }
    },
    [],
  );

  const sceneClass = SCENE_CLASS_BY_PHASE[phase];
  const cardShakeClass = getShakeClass('card-shake', cardShakeLevel);
  const screenShakeClass = getShakeClass('screen-shake', screenShakeLevel);
  const shouldShowCracks =
    !yesTransitioning &&
    (phase === PHASES.NO_LEVEL_2 || phase === PHASES.NO_LEVEL_3 || phase === PHASES.NO_LEVEL_4);
  const shouldShowDebris = !yesTransitioning && isWarPhase(phase);

  const triggerShake = ({ card, screen }) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      return;
    }

    if (card > 0) {
      setCardShakeLevel(0);
      if (cardShakeRafRef.current) {
        cancelAnimationFrame(cardShakeRafRef.current);
      }
      cardShakeRafRef.current = requestAnimationFrame(() => {
        setCardShakeLevel(card);
      });
      if (cardShakeTimerRef.current) {
        clearTimeout(cardShakeTimerRef.current);
      }
      cardShakeTimerRef.current = setTimeout(() => {
        setCardShakeLevel(0);
      }, 420);
    }

    if (screen > 0) {
      setScreenShakeLevel(0);
      if (screenShakeRafRef.current) {
        cancelAnimationFrame(screenShakeRafRef.current);
      }
      screenShakeRafRef.current = requestAnimationFrame(() => {
        setScreenShakeLevel(screen);
      });
      if (screenShakeTimerRef.current) {
        clearTimeout(screenShakeTimerRef.current);
      }
      screenShakeTimerRef.current = setTimeout(() => {
        setScreenShakeLevel(0);
      }, 460);
    }
  };

  const triggerFlash = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      return;
    }

    setIsFlashActive(false);
    if (flashRafRef.current) {
      cancelAnimationFrame(flashRafRef.current);
    }
    flashRafRef.current = requestAnimationFrame(() => {
      setIsFlashActive(true);
    });
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    flashTimerRef.current = setTimeout(() => {
      setIsFlashActive(false);
    }, 360);
  };

  const stopFallbackCue = () => {
    cueNodesRef.current.forEach(({ oscillator, gain }) => {
      try {
        oscillator.stop();
      } catch {
        // oscillator might already be stopped
      }
      try {
        oscillator.disconnect();
        gain.disconnect();
      } catch {
        // ignore disconnect errors
      }
    });
    cueNodesRef.current = [];
  };

  const getCueContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }

    if (!cueContextRef.current) {
      cueContextRef.current = new AudioContextClass();
    }

    if (cueContextRef.current.state === 'suspended') {
      cueContextRef.current.resume().catch(() => {});
    }

    return cueContextRef.current;
  };

  const scheduleCueTone = ({ type = 'sine', from, to, duration, volume = 0.04, startOffset = 0 }) => {
    const context = getCueContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startTime = context.currentTime + startOffset;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, startTime);
    if (to) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(36, to), startTime + duration);
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);

    if (duration) {
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    }

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);

    if (duration) {
      oscillator.stop(startTime + duration + 0.03);
    }

    cueNodesRef.current.push({ oscillator, gain });
  };

  const playFallbackCue = (cueType) => {
    stopFallbackCue();

    if (cueType === 'sad') {
      scheduleCueTone({ type: 'triangle', from: 412, to: 212, duration: 0.64, volume: 0.03 });
      return;
    }

    if (cueType === 'drama') {
      scheduleCueTone({ type: 'sawtooth', from: 280, to: 198, duration: 0.4, volume: 0.035 });
      scheduleCueTone({ type: 'triangle', from: 226, to: 164, duration: 0.52, volume: 0.03, startOffset: 0.14 });
      return;
    }

    if (cueType === 'war') {
      scheduleCueTone({ type: 'square', from: 162, to: 78, duration: 0.7, volume: 0.05 });
      scheduleCueTone({ type: 'sawtooth', from: 204, to: 92, duration: 0.72, volume: 0.04, startOffset: 0.05 });
      return;
    }

    if (cueType === 'tension') {
      scheduleCueTone({ type: 'sawtooth', from: 74, volume: 0.015 });
      scheduleCueTone({ type: 'sine', from: 112, volume: 0.008, startOffset: 0.01 });
    }
  };

  const playPhaseAudio = (nextPhase) => {
    const track = PHASE_AUDIO[nextPhase];
    if (!track) {
      audioManagerRef.current.stop();
      stopFallbackCue();
      return;
    }

    stopFallbackCue();
    audioManagerRef.current.play([track.src, ...(track.fallbackSources ?? [])], {
      loop: track.loop,
      volume: track.volume,
      onError: () => {
        playFallbackCue(track.fallbackCue);
      },
    });
  };

  const finalizeYesState = () => {
    setPhase(PHASES.YES);
    setNoCount(0);
    setCardShakeLevel(0);
    setScreenShakeLevel(0);
    setIsFlashActive(false);
    setYesTransitioning(false);
    setIsPawBurstActive(false);
    setCompatibilityScore(getRandomCompatibilityScore());
  };

  const handleYes = ({ triggeredFromNoLevel4 = false } = {}) => {
    if (yesTransitioning || phase === PHASES.YES) {
      return;
    }

    audioManagerRef.current.stop();
    stopFallbackCue();

    if (yesTimerRef.current) {
      clearTimeout(yesTimerRef.current);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      finalizeYesState();
      return;
    }

    setYesTransitioning(true);
    setIsPawBurstActive(true);

    const transitionDuration = triggeredFromNoLevel4 ? 900 : 620;
    yesTimerRef.current = setTimeout(() => {
      finalizeYesState();
    }, transitionDuration);
  };

  const handleNo = () => {
    if (phase === PHASES.YES || yesTransitioning) {
      return;
    }

    if (phase === PHASES.NO_LEVEL_4) {
      handleYes({ triggeredFromNoLevel4: true });
      return;
    }

    const nextNoCount = Math.min(noCount + 1, 4);
    const nextPhase = getPhaseFromNoCount(nextNoCount);

    setNoCount(nextNoCount);
    setPhase(nextPhase);

    const shakeLevel = getShakeLevelForPhase(nextPhase);
    triggerShake(shakeLevel);

    if (nextPhase === PHASES.NO_LEVEL_3) {
      triggerFlash();
    }

    playPhaseAudio(nextPhase);
  };

  const handleReset = () => {
    if (yesTimerRef.current) {
      clearTimeout(yesTimerRef.current);
    }

    audioManagerRef.current.stop();
    stopFallbackCue();
    setPhase(PHASES.ASK);
    setNoCount(0);
    setCardShakeLevel(0);
    setScreenShakeLevel(0);
    setIsFlashActive(false);
    setYesTransitioning(false);
    setIsPawBurstActive(false);
    setCompatibilityScore(getRandomCompatibilityScore());
  };

  const shellClassName = useMemo(
    () =>
      `app-shell relative isolate min-h-screen overflow-hidden px-gutter py-section ${sceneClass} ${
        screenShakeClass || ''
      } ${yesTransitioning ? 'peace-restoring' : ''}`.trim(),
    [sceneClass, screenShakeClass, yesTransitioning],
  );

  return (
    <div className={shellClassName}>
      <div className={`scene-flash ${isFlashActive ? 'scene-flash-active' : ''}`.trim()} aria-hidden="true" />
      <div className={`scene-cracks ${shouldShowCracks ? 'scene-cracks-active' : ''}`.trim()} aria-hidden="true">
        <span className="crack-fragment crack-fragment-1" />
        <span className="crack-fragment crack-fragment-2" />
        <span className="crack-fragment crack-fragment-3" />
      </div>
      <div className={`scene-debris ${shouldShowDebris ? 'scene-debris-active' : ''}`.trim()} aria-hidden="true">
        {DEBRIS_PARTICLES.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.delay}-${index}`}
            className="debris-particle"
            style={{
              '--debris-left': particle.left,
              '--debris-size': particle.size,
              '--debris-delay': particle.delay,
              '--debris-duration': particle.duration,
              '--debris-drift': particle.drift,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[34rem] items-center justify-center">
        <section className="w-full" aria-label="Mewentine prompt">
          {phase === PHASES.YES ? (
            <ResultPanel compatibilityScore={compatibilityScore} onReset={handleReset} />
          ) : (
            <QuestionCard
              phase={phase}
              noCount={noCount}
              onYes={handleYes}
              onNo={handleNo}
              yesTransitioning={yesTransitioning}
              cardShakeClass={cardShakeClass}
              pawBurstActive={isPawBurstActive}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
