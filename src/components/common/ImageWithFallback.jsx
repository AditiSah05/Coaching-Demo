"use client";

import React, { useState } from 'react';
import { Anchor } from 'lucide-react';

export const ImageWithFallback = ({
  src,
  alt = 'Pacific Marine Academy',
  className = '',
  aspectRatio = 'aspect-video',
  loading = 'lazy',
  width,
  height,
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div 
        className={`${aspectRatio} ${className} bg-navy-deep text-ivory flex flex-col items-center justify-center p-4 border border-sea-blue/20 rounded-xl select-none`}
        style={{ width, height }}
      >
        <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center mb-2 text-goldtext">
          <Anchor className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-xs font-semibold text-sea-blue uppercase tracking-wider text-center">Pacific Marine</span>
        <span className="text-[10px] text-ivory/60 text-center line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      width={width}
      height={height}
      onError={() => setError(true)}
      className={`${className}`}
      {...props}
    />
  );
};

export const AvatarInitials = ({ initials = 'PM', name = 'Cadet', color = 'bg-terracotta', size = 'w-14 h-14 text-lg' }) => {
  return (
    <div className={`${size} ${color} rounded-full text-white font-serif font-bold flex items-center justify-center shadow-md border-2 border-white select-none`}>
      {initials}
    </div>
  );
};
