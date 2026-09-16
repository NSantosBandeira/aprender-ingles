export function BrandMark({ size = 32, title = "Inglês no Trabalho" }: { size?: number; title?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className="brand-mark"
    >
      <rect width="32" height="32" rx="8" fill="#12263a" />
      <path
        fill="#f3f6f8"
        d="M19.2 7.6c3.6 0 6.5 2.5 6.5 5.6 0 3.1-2.9 5.6-6.5 5.6-1.1 0-2.1-.2-3-.6l-2.4 1.5.6-2.4c-1.3-1.1-2.1-2.6-2.1-4.1 0-3.1 2.9-5.6 6.9-5.6z"
      />
      <path
        fill="#0f6d66"
        d="M12.4 11.8c4.1 0 7.4 2.8 7.4 6.3 0 3.5-3.3 6.3-7.4 6.3-1.2 0-2.4-.3-3.4-.7L5.8 25.4l.9-2.8C5.4 21.4 5 20 5 18.1c0-3.5 3.3-6.3 7.4-6.3z"
      />
      <circle cx="25.2" cy="20.4" r="1.15" fill="#d7a441" />
    </svg>
  );
}
