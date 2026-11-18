import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  fallbackText?: string;
}

export function LazyImage({
  src,
  alt,
  fill = false,
  priority = false,
  fallbackText,
  className = '',
  style,
  ...rest
}: LazyImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-chiffon via-champagne/45 to-biege text-admiral/60 select-none ${
          fill ? 'absolute inset-0 h-full w-full' : 'h-full w-full'
        } ${className}`}
        style={style}
        aria-label={alt}
      >
        <img src="/logo.png" alt="" className="h-10 w-10 object-contain opacity-30 mb-1" />
        <span className="px-3 text-center text-[11px] font-serif leading-tight line-clamp-2">
          {fallbackText || alt || "Pomegranate 'n' Lime"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      className={`${fill ? 'absolute inset-0 h-full w-full' : ''} transition-opacity duration-300 ${
        loaded || priority ? 'opacity-100' : 'opacity-85'
      } ${className}`}
      style={style}
      {...rest}
    />
  );
}
