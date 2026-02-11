export function HeartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 20.6 4.2 13.2a4.9 4.9 0 0 1 0-7 5 5 0 0 1 7.1 0l.7.8.7-.8a5 5 0 0 1 7.1 0 4.9 4.9 0 0 1 0 7L12 20.6Z" />
    </svg>
  );
}

export function SparkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.5 13.8 8 18.5 9.8 13.8 11.6 12 16.3 10.2 11.6 5.5 9.8 10.2 8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m18.2 3.8.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7.7-1.7Z" fill="currentColor" />
    </svg>
  );
}

export function RefreshIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 11a8 8 0 1 0-2.3 5.7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="m20 6.8-.2 4.5-4.5-.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
