import { useEffect, useMemo, useState } from 'react';
import { PHASES, QUESTION_PHASE_CONTENT } from '../constants/escalation';
import { ActionButton } from './ActionButton';

const PAW_BURST_PARTICLES = [
  { x: '-135%', y: '-45%', delay: '0ms', rotate: '-26deg', size: '1.1rem' },
  { x: '-102%', y: '-120%', delay: '55ms', rotate: '-4deg', size: '1rem' },
  { x: '-36%', y: '-150%', delay: '75ms', rotate: '18deg', size: '1.15rem' },
  { x: '35%', y: '-156%', delay: '40ms', rotate: '-14deg', size: '1rem' },
  { x: '98%', y: '-122%', delay: '15ms', rotate: '12deg', size: '1.12rem' },
  { x: '138%', y: '-48%', delay: '62ms', rotate: '24deg', size: '1.22rem' },
  { x: '128%', y: '24%', delay: '110ms', rotate: '-8deg', size: '0.95rem' },
  { x: '72%', y: '95%', delay: '130ms', rotate: '16deg', size: '1.08rem' },
  { x: '-18%', y: '128%', delay: '95ms', rotate: '-19deg', size: '0.92rem' },
  { x: '-88%', y: '96%', delay: '140ms', rotate: '10deg', size: '1.03rem' },
  { x: '-134%', y: '22%', delay: '120ms', rotate: '-20deg', size: '0.98rem' },
  { x: '12%', y: '-176%', delay: '86ms', rotate: '5deg', size: '1.14rem' },
];

export function QuestionCard({ phase, onYes, onNo, noCount, yesTransitioning, cardShakeClass, pawBurstActive }) {
  const phaseContent = useMemo(() => QUESTION_PHASE_CONTENT[phase] ?? QUESTION_PHASE_CONTENT[PHASES.ASK], [phase]);
  const [activeMediaSrc, setActiveMediaSrc] = useState(phaseContent.media.src);
  const [fallbackStep, setFallbackStep] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);

  useEffect(() => {
    setActiveMediaSrc(phaseContent.media.src);
    setFallbackStep(0);
    setHasMediaError(false);
  }, [phaseContent.media]);

  const handleMediaError = () => {
    const fallbackSources = phaseContent.media.fallbackSources ?? [];
    if (fallbackStep < fallbackSources.length) {
      setActiveMediaSrc(fallbackSources[fallbackStep]);
      setFallbackStep((prev) => prev + 1);
      return;
    }

    setHasMediaError(true);
  };

  const isGlitchState = phase === PHASES.NO_LEVEL_4;
  const chipText = phaseContent.chip;
  const noButtonLabel = phaseContent.noLabel;
  const stickerLabel = chipText || (noCount > 0 ? `Escalation level ${noCount}` : 'Calm mode');

  return (
    <article
      className={`mew-shell question-card animate-card-in ${cardShakeClass || ''} ${yesTransitioning ? 'yes-transitioning' : ''}`.trim()}
      aria-labelledby="valentine-question-title"
   >

      <figure className="hero-frame">
        {!hasMediaError ? (
          <img
            src={activeMediaSrc}
            alt={phaseContent.media.alt}
            className="hero-media"
            loading="eager"
            onError={handleMediaError}
          />
        ) : (
          <div className="hero-fallback-emoji" role="img" aria-label={phaseContent.media.alt}>
            {phaseContent.media.fallbackEmoji}
          </div>
        )}

        <figcaption className="hero-sticker">{stickerLabel}</figcaption>
        <div className={`paw-burst ${pawBurstActive ? 'paw-burst-active' : ''}`.trim()} aria-hidden="true">
          {PAW_BURST_PARTICLES.map((particle, index) => (
            <span
              key={`${particle.x}-${particle.y}-${index}`}
              className="paw-particle"
              style={{
                '--paw-x': particle.x,
                '--paw-y': particle.y,
                '--paw-delay': particle.delay,
                '--paw-rotate': particle.rotate,
                '--paw-size': particle.size,
              }}
            >
              🐾
            </span>
          ))}
        </div>
      </figure>

      <header className="mt-7">
        <h1 id="valentine-question-title" className="text-balance text-center">
          <span className={`headline-main ${isGlitchState ? 'text-glitch' : ''}`.trim()}>Will you be my Mewentine? 🐾💖</span>
        </h1>
      </header>

      <div
        className={`mt-7 grid grid-cols-2 gap-3 transition-all duration-300 ${
          yesTransitioning ? 'pointer-events-none translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
        }`.trim()}
      >
        <ActionButton
          onClick={onYes}
          size="md"
          className="min-h-[3.75rem] text-[1rem] sm:text-[1.15rem]"
          aria-label="Answer yes"
          disabled={yesTransitioning}
        >
          Yes, purr-ever 💕
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={onNo}
          size="md"
          className="min-h-[3.75rem] px-3 text-[0.86rem] leading-tight sm:text-[0.98rem]"
          aria-label="Answer no"
          disabled={yesTransitioning}
        >
          {noButtonLabel}
        </ActionButton>
      </div>

      <div
        className={`mt-4 min-h-[1.7rem] transition-opacity duration-300 ${yesTransitioning ? 'opacity-0' : 'opacity-100'}`.trim()}
        aria-live="polite"
      >
        {isGlitchState ? <p className="mini-chaos-note text-glitch-subtle">You can still choose peace.</p> : null}
      </div>

      <p className="mt-7 text-center text-[0.96rem] font-medium uppercase tracking-[0.12em] text-primary/70">Made with cat drama and purpose</p>
    </article>
  );
}
