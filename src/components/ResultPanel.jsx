import { useEffect, useRef, useState } from 'react';
import { HAPPY_CAT_MEDIA } from '../constants/escalation';
import { ActionButton } from './ActionButton';
import { RefreshIcon } from './icons';

export function ResultPanel({ compatibilityScore, onReset }) {
  const [activeMediaSrc, setActiveMediaSrc] = useState(HAPPY_CAT_MEDIA.src);
  const [fallbackStep, setFallbackStep] = useState(0);
  const [isFallback, setIsFallback] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    setActiveMediaSrc(HAPPY_CAT_MEDIA.src);
    setFallbackStep(0);
    setIsFallback(false);
    headingRef.current?.focus();
  }, [compatibilityScore]);

  const handleMediaError = () => {
    const fallbackSources = HAPPY_CAT_MEDIA.fallbackSources ?? [];
    if (fallbackStep < fallbackSources.length) {
      setActiveMediaSrc(fallbackSources[fallbackStep]);
      setFallbackStep((prev) => prev + 1);
      return;
    }

    setIsFallback(true);
  };

  return (
    <article className="mew-shell animate-result-pop" aria-live="polite" aria-labelledby="result-heading">
      <div className="badge-pill result-reveal result-delay-1">
        <span>🐾 Mewment Made</span>
      </div>

      <div className="hero-frame mt-5 result-reveal result-delay-2">
        {!isFallback ? (
          <img
            src={activeMediaSrc}
            alt={HAPPY_CAT_MEDIA.alt}
            className="hero-media"
            loading="eager"
            onError={handleMediaError}
          />
        ) : (
          <div className="hero-fallback-emoji" role="img" aria-label={HAPPY_CAT_MEDIA.alt}>
            {HAPPY_CAT_MEDIA.fallbackEmoji}
          </div>
        )}

        <span className="hero-sticker">Certified Mewentine.</span>
      </div>

      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="mt-7 text-balance text-center">
        <span className="headline-main result-reveal result-delay-3">Peace has been restored.</span>
        <span className="headline-accent result-reveal result-delay-4">Certified Mewentine.</span>
      </h2>

      <div className="mx-auto mt-4 max-w-[28rem] text-center">
        <p className="compatibility-line result-reveal result-delay-5">💘 Compatibility: {compatibilityScore}%</p>
        <p className="compatibility-reason result-reveal result-delay-6">Paw-thenticated by the cat council.</p>
      </div>

      <div className="mx-auto mt-6 max-w-[24rem] result-reveal result-delay-6">
        <ActionButton icon={RefreshIcon} variant="soft" size="md" onClick={onReset} aria-label="Ask again">
          Ask Again
        </ActionButton>
      </div>

      <p className="mt-4 text-center text-xs font-medium uppercase tracking-[0.12em] text-primary/70 result-reveal result-delay-7">
        {isFallback ? 'Fallback emoji active (missing local GIF)' : 'Local celebration GIF active'}
      </p>
    </article>
  );
}
