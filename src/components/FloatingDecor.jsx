const FLOATING_ITEMS = [
  { left: '6%', size: '3.2rem', delay: '0s', duration: 17.2, symbol: '🐾', tone: 'soft', drift: '-1.2rem' },
  { left: '20%', size: '1.1rem', delay: '0.8s', duration: 11.4, symbol: '♡', tone: 'bright', drift: '0.7rem' },
  { left: '74%', size: '2.4rem', delay: '1.3s', duration: 15.6, symbol: '🐾', tone: 'soft', drift: '-0.8rem' },
  { left: '84%', size: '1.3rem', delay: '0.2s', duration: 10.8, symbol: '♥', tone: 'bright', drift: '0.5rem' },
  { left: '9%', size: '1.6rem', delay: '1.8s', duration: 12.4, symbol: '♥', tone: 'bright', drift: '-0.4rem' },
  { left: '88%', size: '2rem', delay: '0.7s', duration: 16.7, symbol: '♡', tone: 'soft', drift: '0.9rem' },
  { left: '14%', size: '3rem', delay: '1.9s', duration: 15.1, symbol: '🐾', tone: 'soft', drift: '-0.7rem' },
  { left: '78%', size: '1.8rem', delay: '1.1s', duration: 13.2, symbol: '♥', tone: 'bright', drift: '0.45rem' },
  { left: '23%', size: '1.7rem', delay: '0.4s', duration: 14.1, symbol: '♡', tone: 'bright', drift: '-0.6rem' },
  { left: '41%', size: '1.35rem', delay: '0.6s', duration: 11.8, symbol: '♥', tone: 'bright', drift: '0.3rem' },
  { left: '55%', size: '2.2rem', delay: '1.4s', duration: 14.7, symbol: '🐾', tone: 'soft', drift: '0.6rem' },
  { left: '64%', size: '1.15rem', delay: '1.7s', duration: 10.7, symbol: '♡', tone: 'bright', drift: '-0.35rem' },
];

export function FloatingDecor({ chaosLevel = 0 }) {
  const durationFactor = chaosLevel >= 4 ? 0.72 : chaosLevel >= 2 ? 0.83 : chaosLevel >= 1 ? 0.92 : 1;

  return (
    <div className={`floating-canvas ${chaosLevel >= 1 ? 'floating-canvas-active' : ''}`.trim()} aria-hidden="true">
      {FLOATING_ITEMS.map((item, index) => (
        <span
          key={`${item.left}-${item.symbol}-${index}`}
          className={`float-track ${item.tone === 'bright' ? 'float-track-bright' : 'float-track-soft'}`}
          style={{
            '--float-left': item.left,
            '--float-size': item.size,
            '--float-delay': item.delay,
            '--float-duration': `${(item.duration * durationFactor).toFixed(2)}s`,
            '--float-drift': item.drift,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
