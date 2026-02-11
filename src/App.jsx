import { useEffect, useRef, useState } from 'react';
import { FloatingDecor } from './components/FloatingDecor';
import { QuestionCard } from './components/QuestionCard';
import { ResultPanel } from './components/ResultPanel';

const ITERATING_NO_COPY = ['are you sure?', "that's suspicious.", 'paws reconsidered?', 'try again hooman.'];

function App() {
  const [answer, setAnswer] = useState(null);
  const [noCount, setNoCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const audioContextRef = useRef(null);
  const activeOscillatorsRef = useRef([]);
  const shakeTimerRef = useRef(null);
  const shakeRafRef = useRef(null);

  const stage = Math.min(noCount, 5);

  useEffect(
    () => () => {
      if (shakeTimerRef.current) {
        clearTimeout(shakeTimerRef.current);
      }
      if (shakeRafRef.current) {
        cancelAnimationFrame(shakeRafRef.current);
      }
      activeOscillatorsRef.current.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // oscillator may already be stopped
        }
        try {
          oscillator.disconnect();
        } catch {
          // ignore
        }
      });
      activeOscillatorsRef.current = [];

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    },
    [],
  );

  const getAudioContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const context = audioContextRef.current;
    if (context.state === 'suspended') {
      context.resume().catch(() => {});
    }

    return context;
  };

  const clearAudio = () => {
    activeOscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // oscillator may already be stopped
      }
      try {
        oscillator.disconnect();
      } catch {
        // ignore
      }
    });
    activeOscillatorsRef.current = [];
  };

  const scheduleTone = ({
    type = 'sine',
    from,
    to,
    duration,
    volume,
    detune = 0,
    startOffset = 0,
  }) => {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startTime = context.currentTime + startOffset;

    oscillator.type = type;
    oscillator.detune.value = detune;

    oscillator.frequency.setValueAtTime(from, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(45, to), startTime + duration);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);

    activeOscillatorsRef.current.push(oscillator);
  };

  const playStageAudio = (nextStage) => {
    clearAudio();

    if (nextStage === 1) {
      scheduleTone({ type: 'sawtooth', from: 392, to: 215, duration: 0.72, volume: 0.075 });
      scheduleTone({ type: 'triangle', from: 311, to: 188, duration: 0.72, volume: 0.064, detune: 7 });
      return;
    }

    if (nextStage === 2) {
      scheduleTone({ type: 'triangle', from: 236, to: 178, duration: 1.4, volume: 0.045 });
      scheduleTone({ type: 'sine', from: 352, to: 262, duration: 1.18, volume: 0.03, startOffset: 0.06 });
      scheduleTone({ type: 'sine', from: 176, to: 138, duration: 1.35, volume: 0.022, startOffset: 0.03 });
      return;
    }

    if (nextStage === 3) {
      scheduleTone({ type: 'sawtooth', from: 284, to: 124, duration: 0.9, volume: 0.088 });
      scheduleTone({ type: 'triangle', from: 205, to: 95, duration: 0.92, volume: 0.072, detune: 8 });
      return;
    }

    if (nextStage === 4) {
      scheduleTone({ type: 'sawtooth', from: 332, to: 108, duration: 1.1, volume: 0.11 });
      scheduleTone({ type: 'square', from: 242, to: 82, duration: 1.1, volume: 0.082, detune: -4 });
      scheduleTone({ type: 'triangle', from: 168, to: 72, duration: 1.18, volume: 0.064, detune: 11, startOffset: 0.04 });
      return;
    }

    if (nextStage === 5) {
      scheduleTone({ type: 'sine', from: 320, to: 392, duration: 0.5, volume: 0.033 });
      scheduleTone({ type: 'sine', from: 392, to: 523, duration: 0.48, volume: 0.026, startOffset: 0.06 });
    }
  };

  const triggerShake = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setIsShaking(false);
    if (shakeRafRef.current) {
      cancelAnimationFrame(shakeRafRef.current);
    }
    shakeRafRef.current = requestAnimationFrame(() => {
      setIsShaking(true);
    });

    if (shakeTimerRef.current) {
      clearTimeout(shakeTimerRef.current);
    }
    shakeTimerRef.current = setTimeout(() => {
      setIsShaking(false);
    }, 430);
  };

  const handleNo = () => {
    setNoCount((prev) => {
      const next = Math.min(prev + 1, 5);
      playStageAudio(next);

      if (next === 3) {
        triggerShake();
      }

      return next;
    });
  };

  const handleYes = () => {
    setAnswer('yes');
    setNoCount(0);
    setIsShaking(false);
    clearAudio();
  };

  const handleReset = () => {
    setAnswer(null);
    setNoCount(0);
    setIsShaking(false);
    clearAudio();
  };

  const iteratingCopy = stage > 0 ? ITERATING_NO_COPY[(stage - 1) % ITERATING_NO_COPY.length] : '';
  const noButtonLabel = iteratingCopy || 'No';
  const stageMessage = iteratingCopy;

  const chaosClass =
    stage === 2 ? 'chaos-suspicious' : stage === 3 ? 'chaos-angry' : stage === 4 ? 'chaos-rage' : '';

  return (
    <div
      className={`app-shell relative isolate min-h-screen overflow-hidden px-gutter py-section ${chaosClass} ${
        isShaking ? 'chaos-shake' : ''
      }`.trim()}
    >
      <FloatingDecor chaosLevel={noCount} />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[32rem] items-center justify-center">
        <section className="w-full" aria-label="Valentine prompt">
          {answer ? (
            <ResultPanel answer={answer} onReset={handleReset} />
          ) : (
            <QuestionCard
              onYes={handleYes}
              onNo={handleNo}
              noCount={noCount}
              noButtonLabel={noButtonLabel}
              stageMessage={stageMessage}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
