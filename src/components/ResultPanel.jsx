import { useEffect, useMemo, useRef, useState } from 'react';
import { CAT_GIFS } from '../constants/assets';
import { ActionButton } from './ActionButton';
import { HeartIcon, RefreshIcon } from './icons';

const RESULT_COPY = {
  yes: {
    title: 'Best answer ever!',
    accent: 'This kitty is all smiles.',
    subtitle: 'You unlocked happy-cat mode for this Valentine mission.',
    sticker: 'Purr-fect Match! 🐾',
  },
  no: {
    title: 'Hiss accepted.',
    accent: 'The cat needs space.',
    subtitle: 'No worries. You can always ask again if your answer changes.',
    sticker: 'Certified hiss 🐾',
  },
};

export function ResultPanel({ answer, onReset }) {
  const media = useMemo(() => CAT_GIFS[answer], [answer]);
  const [source, setSource] = useState(media.local);
  const [isFallback, setIsFallback] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    setSource(media.local);
    setIsFallback(false);
  }, [media]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [answer]);

  const handleMediaError = () => {
    if (!isFallback) {
      setSource(media.fallback);
      setIsFallback(true);
    }
  };

  return (
    <article className="mew-shell animate-result-pop" aria-live="polite" aria-labelledby="result-heading">
      <div className="badge-pill">
        <HeartIcon className="h-4 w-4" />
        <span>{answer === 'yes' ? 'MEWMENT MADE' : 'MEWMENT LOGGED'}</span>
      </div>

      <div className="hero-frame mt-5">
        <img
          src={source}
          alt={media.alt}
          className="hero-media"
          onError={handleMediaError}
          loading="eager"
        />
        <span className="hero-sticker">{RESULT_COPY[answer].sticker}</span>
      </div>

      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="mt-7 text-balance text-center">
        <span className="headline-main">{RESULT_COPY[answer].title}</span>
        <span className="headline-accent">{RESULT_COPY[answer].accent}</span>
      </h2>
      <p className="mx-auto mt-4 max-w-[28rem] text-center text-[1.2rem] sm:text-[1.3rem]">{RESULT_COPY[answer].subtitle}</p>

      <div className="mx-auto mt-6 max-w-[24rem]">
        <ActionButton icon={RefreshIcon} variant="soft" size="md" onClick={onReset} aria-label="Ask again">
          Ask Again
        </ActionButton>
      </div>

      <p className="mt-4 text-center text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
        {isFallback ? 'Using fallback GIF source' : 'Using local /assets GIF source'}
      </p>
    </article>
  );
}
