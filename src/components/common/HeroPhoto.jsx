import React from 'react';

// Hero photo: prow-and-wave shape with a thin gold-to-sea gradient border.
export const HeroPhoto = ({ src = '/images/about-academy-image-01.png', alt = 'Pacific Marine Academy cadets' }) => (
  <div className="relative w-full max-w-[860px] pt-6 pr-5 pb-5">
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <clipPath id="hero-shape" clipPathUnits="objectBoundingBox">
          <path d="M0,0.14 Q0,0 0.14,0 H0.66 C0.86,0 1,0.14 1,0.34 V0.82 C0.96,0.86 0.92,0.93 0.85,0.96 C0.76,1 0.66,0.97 0.58,0.95 C0.48,0.92 0.38,1 0.28,1 H0.12 Q0,1 0,0.86 Z" />
        </clipPath>
      </defs>
    </svg>

    <div className="absolute inset-8 rounded-full bg-sea-blue/15 blur-3xl" aria-hidden="true" />

    {/* Offset outline of the same shape: stroke only, so nothing grey sits behind the photo */}
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      className="absolute left-0 top-6 w-[calc(100%-1.25rem)] h-[calc(100%-2.75rem)] translate-x-4 translate-y-4 overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M0,0.14 Q0,0 0.14,0 H0.66 C0.86,0 1,0.14 1,0.34 V0.82 C0.96,0.86 0.92,0.93 0.85,0.96 C0.76,1 0.66,0.97 0.58,0.95 C0.48,0.92 0.38,1 0.28,1 H0.12 Q0,1 0,0.86 Z"
        fill="none"
        stroke="#C9B08A"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>

    {/* Outer shape = border, inner shape = photo */}
    <div className="relative aspect-[3/2] bg-gradient-to-br from-gold via-sea-blue to-gold shadow-2xl" style={{ clipPath: 'url(#hero-shape)' }}>
      <div className="absolute inset-[3px] bg-navy-dark" style={{ clipPath: 'url(#hero-shape)' }}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/45 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
      </div>
    </div>

    {/* Two thin wave lines tucked under the bottom-left corner */}
    <svg viewBox="0 0 160 36" className="absolute -left-6 bottom-1 w-40 h-9" fill="none" stroke="#C9B08A" strokeLinecap="round" aria-hidden="true">
      <path d="M2,12 C22,0 40,24 62,12 S102,0 122,12 S146,22 158,14" strokeWidth="2" strokeOpacity="0.7" />
      <path d="M2,28 C22,16 40,40 62,28 S102,16 122,28 S146,38 158,30" strokeWidth="2" strokeOpacity="0.35" />
    </svg>

    {/* Rotating seal */}
    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-navy-deep/85 backdrop-blur border-2 border-gold/60 shadow-xl flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full animate-spin-slow" aria-hidden="true">
        <defs><path id="seal-ring" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs>
        <text fontSize="10" fontWeight="700" fill="#C9B08A">
          <textPath href="#seal-ring" textLength="292" lengthAdjust="spacing">MERCHANT NAVY • SIKAR • COACHING •</textPath>
        </text>
      </svg>
      <img src="/logo.png" alt="" className="w-14 h-14 rounded-full bg-white" />
    </div>
  </div>
);
