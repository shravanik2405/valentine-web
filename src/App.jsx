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

  const playPhaseAudio = (nextPhase) => {
    const track = PHASE_AUDIO[nextPhase];
    if (!track) {
      audioManagerRef.current.stop();
      return;
    }

    audioManagerRef.current.play(track.src, {
      loop: track.loop,
      volume: track.volume,
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
