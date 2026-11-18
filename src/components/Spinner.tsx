import React from 'react';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'brand' | 'light' | 'admiral';
  label?: string;
}

export function Spinner({ size = 'sm', color = 'brand', label }: SpinnerProps) {
  const sizeClass =
    size === 'xs'
      ? 'h-3.5 w-3.5 border-[2px]'
      : size === 'sm'
      ? 'h-4 w-4 border-2'
      : size === 'md'
      ? 'h-7 w-7 border-[2.5px]'
      : 'h-10 w-10 border-[3px]';

  const colorClass =
    color === 'light'
      ? 'border-chiffon/35 border-t-chiffon'
      : color === 'admiral'
      ? 'border-admiral/25 border-t-admiral'
      : 'border-antiquity/30 border-t-antiquity';

  return (
    <span className="inline-flex flex-col items-center justify-center gap-2">
      <span
        className={`inline-block rounded-full animate-spin ${sizeClass} ${colorClass}`}
        aria-hidden="true"
      />
      {label && <span className="text-[13px] text-admiral/80">{label}</span>}
    </span>
  );
}
