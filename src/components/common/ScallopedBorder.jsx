"use client";

import React from 'react';

export const ScallopedBorder = ({ fillColor = '#0B2545', invert = false, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden leading-none select-none ${className}`}>
      <svg
        className={`relative block w-full h-8 md:h-12 ${invert ? 'rotate-180' : ''}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,-20 1200,40 L1200,120 L0,120 Z"
          fill={fillColor}
        ></path>
      </svg>
    </div>
  );
};

export const ItalianScallopPattern = ({ color = '#E4572E' }) => {
  return (
    <div className="w-full h-2 flex overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <div 
          key={i} 
          className="flex-1 h-3 rounded-b-full"
          style={{ backgroundColor: i % 2 === 0 ? color : '#13A0C9' }}
        />
      ))}
    </div>
  );
};
