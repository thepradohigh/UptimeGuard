interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2.5L27.5 7.5V15C27.5 21.5 22 27 16 29.5C10 27 4.5 21.5 4.5 15V7.5L16 2.5Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polyline
        points="8,16 11.5,16 13.5,11 16,21 18.5,13 20.5,16 24,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = 28, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className || ''}`}>
      <LogoMark size={size} className="text-primary shrink-0" />
      <span
        className="font-semibold tracking-tight text-foreground"
        style={{ fontSize: size * 0.5 }}
      >
        UptimeGuard
      </span>
    </div>
  );
}
