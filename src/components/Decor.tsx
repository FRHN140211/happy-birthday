import type { SVGProps } from 'react';

export function FlowerMark({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none" {...props}>
      <path d="M32 8c5.5 0 8.3 7.8 5.6 13.3C43 17.8 51 20.6 51 26s-7.8 8.3-13.3 5.6C42.2 37 39.4 45 34 45s-8.3-7.8-5.6-13.3C23 36.2 15 33.4 15 28s7.8-8.3 13.3-5.6C23.8 17 26.6 8 32 8Z" fill="currentColor" />
      <circle cx="33" cy="27" r="5" fill="#f4c6d5" />
    </svg>
  );
}

export function TinyStar({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" fill="none" {...props}>
      <path d="M16 2.5 19.5 12.5 29.5 16 19.5 19.5 16 29.5 12.5 19.5 2.5 16 12.5 12.5 16 2.5Z" fill="currentColor" />
    </svg>
  );
}

export function HeartSeal({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" fill="none" {...props}>
      <path d="M24 42s-18-11.5-18-24.1C6 9.3 16.5 6.6 24 15.2 31.5 6.6 42 9.3 42 17.9 42 30.5 24 42 24 42Z" fill="currentColor" />
      <path d="M16 20c2-3 5-3 8-1" stroke="#fffaf4" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Tape({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`washi-tape ${className}`} />;
}
