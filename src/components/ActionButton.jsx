const VARIANT_STYLES = {
  primary:
    'border-transparent bg-gradient-to-r from-primary to-primaryStrong text-white shadow-soft hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lift',
  secondary:
    'border border-border bg-white/35 text-ink shadow-none hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-white/60 hover:shadow-soft',
  soft:
    'border border-transparent bg-white/80 text-ink shadow-soft hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-white hover:shadow-lift',
};

const SIZE_STYLES = {
  lg: 'min-h-[4.25rem] px-6 py-3 text-[1.35rem] sm:min-h-[4.75rem] sm:text-[1.85rem]',
  md: 'min-h-[3.5rem] px-5 py-2.5 text-base sm:text-lg',
};

const BASE_STYLES =
  'inline-flex w-full items-center justify-center gap-2 rounded-button border font-heading font-semibold leading-none tracking-tight ' +
  'transition-[transform,box-shadow,background-color,color,border-color,opacity] duration-200 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bgMiddle ' +
  'active:scale-[0.98] ' +
  'disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none';

export function ActionButton({ icon: Icon, variant = 'primary', size = 'lg', className = '', children, ...props }) {
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.lg;

  return (
    <button type="button" className={`${BASE_STYLES} ${variantStyle} ${sizeStyle} ${className}`.trim()} {...props}>
      {Icon ? <Icon className="h-5 w-5" /> : null}
      <span className="text-center">{children}</span>
    </button>
  );
}
