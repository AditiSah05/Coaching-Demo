"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const posters = [16, 15, 14, 13, 12, 11, 10, 9, 8].map((n) => `/images/pacifc-sporands-photos-24-${n}.jpeg`);
const awards = [13, 14, 15].map((n) => `/images/home-image-${n}.jpeg`);

const Heading = ({ children }) => (
  <div className="text-center">
    <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-bold text-navy-deep tracking-tight">{children}</h2>
    <span className="mx-auto mt-5 block h-px w-16 bg-gold" aria-hidden="true" />
  </div>
);

export const SponsoredCadets = () => {
  const [open, setOpen] = useState(null);
  const track = useRef(null);
  const paused = useRef(false);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + posters.length) % posters.length)), []);

  // Posters are doubled so the strip loops with no visible jump.
  const loop = [...posters, ...posters];
  const cardStep = () => {
    const el = track.current;
    const card = el?.firstElementChild;
    return card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0) : 0;
  };
  const half = () => (track.current ? track.current.scrollWidth / 2 : 0);
  const slide = useCallback((dir) => {
    const el = track.current;
    if (!el) return;
    if (dir < 0 && el.scrollLeft <= 1) el.scrollLeft += half();
    el.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  }, []);
  const onScroll = () => {
    const el = track.current;
    if (el && el.scrollLeft >= half()) el.scrollLeft -= half();
  };

  // Auto-advance to the left every few seconds; pauses on hover/touch or while the viewer is open.
  useEffect(() => {
    if (open !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => { if (!paused.current) slide(1); }, 3200);
    return () => clearInterval(id);
  }, [open, slide]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, step]);

  return (
    <section className="py-16 bg-white text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Heading>Our <span className="text-goldtext">Sponsored</span> Cadets</Heading>

        {/* Horizontal strip: swipe or use the arrows; it also slides left on its own */}
        <div
          className="relative mt-12"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          onTouchStart={() => (paused.current = true)}
          onTouchEnd={() => setTimeout(() => (paused.current = false), 2500)}
        >
          <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto py-3">
            {loop.map((src, i) => (
              <button
                key={i}
                onClick={() => setOpen(i % posters.length)}
                aria-label={`View sponsored cadet poster ${(i % posters.length) + 1}`}
                aria-hidden={i >= posters.length || undefined}
                tabIndex={i >= posters.length ? -1 : 0}
                className="group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl border border-navy-deep/10 bg-ivory shadow-chunky transition-all duration-300 hover:border-gold hover:shadow-chunky-lg sm:w-[44%] lg:w-[calc((100%-3.75rem)/4)]"
              >
                <img src={src} alt="Pacific Marine Academy sponsored cadet" loading="lazy" draggable="false" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/0 opacity-0 transition-all duration-300 group-hover:bg-navy-deep/35 group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-deep shadow-chunky"><ZoomIn className="h-5 w-5" /></span>
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => slide(-1)} aria-label="Previous posters" className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-white/95 text-navy-deep shadow-chunky transition-colors hover:bg-gold-light sm:flex"><ChevronLeft className="h-6 w-6" /></button>
          <button onClick={() => slide(1)} aria-label="Next posters" className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-white/95 text-navy-deep shadow-chunky transition-colors hover:bg-gold-light sm:flex"><ChevronRight className="h-6 w-6" /></button>
        </div>

        {/* Awards: small source images, so kept at their natural size to stay sharp */}
        <div className="mt-20">
          <Heading>All <span className="text-goldtext">Winning</span> Awards</Heading>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 sm:grid-cols-3 gap-5">
            {awards.map((src) => (
              <img key={src} src={src} alt="Pacific Marine Academy award" loading="lazy" className="aspect-[4/3] w-full rounded-2xl border border-gold/40 object-cover shadow-chunky transition-transform duration-300 hover:-translate-y-1" />
            ))}
          </div>
        </div>
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/90 p-4 backdrop-blur-sm" onClick={close} role="dialog" aria-modal="true">
          <button onClick={close} aria-label="Close" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"><X className="h-5 w-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="absolute left-3 sm:left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
          <img src={posters[open]} alt="Sponsored cadet poster" onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-auto max-w-[88vw] rounded-2xl shadow-2xl" />
          <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="absolute right-3 sm:right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white">{open + 1} / {posters.length}</span>
        </div>
      )}
    </section>
  );
};
