"use client";

import React from 'react';

export const ScallopedBorder = ({ fillColor = '#021527', invert = false, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden leading-none select-none ${className}`}>
      <svg
        className={`relative block w-full h-10 md:h-16 ${invert ? 'rotate-180' : ''}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,70 C100,30 200,30 300,70 C400,110 500,110 600,70 C700,30 800,30 900,70 C1000,110 1100,110 1200,70 L1200,120 L0,120 Z"
          fill={fillColor}
          opacity="0.35"
        />
        <path
          d="M0,85 C100,115 200,115 300,85 C400,55 500,55 600,85 C700,115 800,115 900,85 C1000,55 1100,55 1200,85 L1200,120 L0,120 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};

export const ItalianScallopPattern = ({ color = '#BFA888' }) => {
  return (
    <div className="w-full h-2 flex overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <div 
          key={i} 
          className="flex-1 h-3 rounded-b-full"
          style={{ backgroundColor: i % 2 === 0 ? color : '#BFA888' }}
        />
      ))}
    </div>
  );
};
