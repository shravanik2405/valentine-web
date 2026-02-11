import { useEffect, useMemo, useState } from 'react';
import { CAT_GIFS } from '../constants/assets';
import { ActionButton } from './ActionButton';
import { HeartIcon } from './icons';

export function QuestionCard({ onYes, onNo, noCount, noButtonLabel, stageMessage }) {
  const heroMedia = useMemo(() => {
    if (noCount >= 5) {
      return CAT_GIFS.yes;
    }
    if (noCount === 4) {
      return CAT_GIFS.no;
    }
    if (noCount === 3) {
      return CAT_GIFS.angry;
    }
    if (noCount === 2) {
      return CAT_GIFS.surprised;
    }
    if (noCount === 1) {
      return CAT_GIFS.sad;
    }
    return CAT_GIFS.yes;
  }, [noCount]);

  const [heroSource, setHeroSource] = useState(heroMedia.local);
  const [isHeroFallback, setIsHeroFallback] = useState(false);

  useEffect(() => {
    setHeroSource(heroMedia.local);
    setIsHeroFallback(false);
  }, [heroMedia]);

  const handleHeroError = () => {
    if (!isHeroFallback) {
      setHeroSource(heroMedia.fallback);
      setIsHeroFallback(true);
    }
  };

  const stickerLabel =
    noCount >= 5
      ? 'Told you so 😼'
      : noCount === 4
        ? 'Hiss mode unlocked 🐾'
        : noCount === 3
          ? 'This escalated quickly ⚠️'
          : noCount === 2
            ? 'Surprise whiskers activated 😲'
            : noCount === 1
              ? 'Sad kitten activated 🥺'
              : 'Purr-fect Match! 🐾';

  return (
    <article className="mew-shell animate-card-in" aria-labelledby="valentine-question-title">
      {/* <div className="badge-pill">
        <HeartIcon className="h-4 w-4" />
        <span>MEWENTINE</span>
      </div> */}

      <figure className="hero-frame">
        <img
          src={heroSource}
          alt="A cute cat waiting for your Valentine answer"
          className="hero-media"
          loading="eager"
          onError={handleHeroError}
        />
        <figcaption className="hero-sticker">{stickerLabel}</figcaption>
      </figure>

      <header className="mt-7">
        <h1 id="valentine-question-title" className="text-balance text-center">
          <span className="headline-main">Will you be my</span>
          <span className="headline-accent">Valentine?</span>
        </h1>
        {/* <p className="mx-auto mt-4 max-w-[28rem] text-center text-[1.08rem] sm:text-[1.35rem]">
          Are you fur-real? I promise infinite cuddles and treats if you say yes!
        </p> */}
      </header>

      <div className="mt-6 flex flex-row gap-4">
        <ActionButton onClick={onYes} aria-label="Answer yes">
          Yes, absolutely! 😻
        </ActionButton>
        <ActionButton variant="secondary" onClick={onNo} aria-label="Answer no">
          {noButtonLabel}
        </ActionButton>

   
</div>
    </article>
  );
}
