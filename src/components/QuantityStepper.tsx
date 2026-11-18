import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  qty: number;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  onChange: (nextQty: number) => void;
}

export function QuantityStepper({
  qty,
  min = 1,
  max = 99,
  size = 'md',
  onChange,
}: QuantityStepperProps) {
  const isSm = size === 'sm';
  return (
    <div
      className={`inline-flex items-center rounded-full border border-champagne bg-chiffon select-none ${
        isSm ? 'h-8 px-1.5 gap-2' : 'h-10 px-2 gap-3'
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        aria-label="Decrease quantity"
        className={`flex items-center justify-center rounded-full text-admiral transition-colors hover:bg-champagne/60 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed ${
          isSm ? 'h-5 w-5' : 'h-6 w-6'
        }`}
      >
        <Minus className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </button>
      <span
        className={`min-w-[1.25rem] text-center font-sans font-medium text-admiral tabular-nums ${
          isSm ? 'text-[13px]' : 'text-[15px]'
        }`}
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        aria-label="Increase quantity"
        className={`flex items-center justify-center rounded-full text-admiral transition-colors hover:bg-champagne/60 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed ${
          isSm ? 'h-5 w-5' : 'h-6 w-6'
        }`}
      >
        <Plus className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </button>
    </div>
  );
}
