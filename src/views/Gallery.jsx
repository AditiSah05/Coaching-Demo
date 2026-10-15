"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowDown, ArrowUpRight, Phone, Expand } from 'lucide-react';
import { useData } from '../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const CURATED = 9;

// Photos in the header collage: results board, officers, classroom.
const collage = [
  { src: '/images/gallery/g01.jpg', cls: 'left-0 top-6 w-[62%] -rotate-3 z-10' },
  { src: '/images/gallery/g05.jpg', cls: 'right-0 top-0 w-[52%] rotate-3 z-20' },
  { src: '/images/gallery/g17.jpg', cls: 'bottom-0 left-[22%] w-[58%] -rotate-1 z-30' },
];

// One photo from each category in turn, so the opening run is varied; the featured photo leads.
const arrange = (items) => {
  const buckets = [...items.reduce((m, g) => m.set(g.category, [...(m.get(g.category) || []), g]), new Map()).values()]
    .sort((a, b) => a.length - b.length);
  const out = [];
  for (let i = 0; buckets.some((b) => i < b.length); i++) buckets.forEach((b) => b[i] && out.push(b[i]));
  return out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
};

export const Gallery = () => {
  const { gallery, settings } = useData();
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(null);
  const closeBtn = useRef(null);
  const opener = useRef(null);

  const cats = ['All', ...new Set(gallery.map((g) => g.category).filter(Boolean))];
  const pool = arrange(filter === 'All' ? gallery : gallery.filter((g) => g.category === filter));
  const curated = filter === 'All' && !showAll && pool.length > CURATED;
  const shown = curated ? pool.slice(0, CURATED) : pool;

  const close = useCallback(() => { setOpen(null); opener.current?.focus(); }, []);
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close, step]);

  const current = open !== null ? shown[open] : null;

  return (
    <div className="min-h-screen bg-ivory text-ink">
      {/* Header with a layered photo collage */}
      <header className="overflow-hidden border-b border-navy-deep/10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-goldtext">Photo gallery</p>
            <h1 className="mt-4 text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-navy-deep sm:text-6xl lg:text-[4.25rem]">
              Life at Pacific Marine <span className="text-goldtext">Academy</span>.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              Felicitation ceremonies, classrooms and mentors, in photographs from the academy in Sikar.
            </p>
            <a href="#photos" className={`mt-8 inline-flex min-h-[48px] items-center rounded-full bg-navy-deep px-7 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}>
              Browse the photos
            </a>
          </div>

          <div className="relative mx-auto h-[300px] w-full max-w-lg sm:h-[400px] lg:col-span-6 lg:h-[440px] lg:max-w-none" aria-hidden="true">
            {collage.map((c) => (
              <img key={c.src} src={c.src} alt="" className={`absolute rounded-md border-[7px] border-white object-cover shadow-chunky-lg ${c.cls}`} />
            ))}
          </div>
        </div>
      </header>

      {/* Results band, as shown on the academy's own board in the photos */}
      <section aria-label="IMU CET 2023 results" className="border-b border-navy-deep/10 bg-navy-deep text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-14 gap-y-4 px-4 py-6 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">IMU CET 2023 · Results board</p>
          <p className="font-serif text-2xl"><span className="font-semibold text-gold">9</span> in Top 1000</p>
          <p className="font-serif text-2xl"><span className="font-semibold text-gold">26</span> in Top 4000</p>
        </div>
      </section>

      {/* Photo wall */}
      <main id="photos" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">Browse the photos</h2>
          <div role="tablist" aria-label="Photo categories" className="no-scrollbar flex gap-2 overflow-x-auto">
            {cats.map((c) => {
              const on = c === filter;
              const count = c === 'All' ? gallery.length : gallery.filter((g) => g.category === c).length;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={on}
                  onClick={() => { setFilter(c); setShowAll(false); }}
                  className={`inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${on ? 'border-navy-deep bg-navy-deep text-white' : 'border-navy-deep/20 bg-white text-navy-deep hover:border-gold hover:bg-gold-light'} ${focusRing}`}
                >
                  {c} <span className={`text-xs tabular-nums ${on ? 'text-gold' : 'text-ink/45'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul
          key={`${filter}-${shown.length}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((item, i) => (
            <li key={item.id}>
              <button
                onClick={(e) => { opener.current = e.currentTarget; setOpen(i); }}
                aria-label={`Open photo: ${item.title}`}
                className={`group block w-full cursor-pointer text-left ${focusRing}`}
              >
                <span className="relative block aspect-[3/2] overflow-hidden rounded-2xl border border-navy-deep/10 bg-ivory-dark">
                  <img src={item.image} alt={item.caption || item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 bg-navy-deep/0 transition-colors duration-300 group-hover:bg-navy-deep/25" />
                  <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-navy-deep opacity-0 shadow-chunky transition-opacity duration-300 group-hover:opacity-100">
                    <Expand className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-4 block">
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-goldtext">{item.category}</span>
                  <span className="mt-1 block font-serif text-xl font-semibold leading-snug text-navy-deep">{item.title}</span>
                </span>
              </button>
            </li>
          ))}
        </motion.ul>

        {curated && (
          <div className="mt-14 flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-ink/60">Showing {shown.length} of {pool.length} photos</p>
            <button onClick={() => setShowAll(true)} className={`inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border border-navy-deep/25 px-7 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}>
              Show all {pool.length} photos <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        )}

        <section aria-label="Join the academy" className="mt-16 grid items-center gap-6 rounded-3xl bg-navy-deep p-8 text-white sm:p-10 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">Be in the next photo.</h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/70">Join the next batch at Pacific Marine Academy and start your Merchant Navy preparation in Sikar.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link href="/admission" className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gold px-7 text-sm font-extrabold uppercase tracking-wider text-navy-deep transition hover:brightness-110 ${focusRing}`}>
              Enrol now <ArrowUpRight className="h-4 w-4" />
            </Link>
            {settings?.phonePrimary && (
              <a href={`tel:${settings.phonePrimary.replace(/\s/g, '')}`} className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold ${focusRing}`}>
                <Phone className="h-4 w-4" /> {settings.phonePrimary}
              </a>
            )}
          </div>
        </section>
      </main>

      {current && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-navy-dark/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <div className="flex items-center justify-between px-4 py-4 text-white sm:px-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold tabular-nums text-white/70">{String(open + 1).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}</p>
            <button ref={closeBtn} onClick={close} aria-label="Close" className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 ${focusRing}`}><X className="h-5 w-5" /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className={`absolute left-3 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 ${focusRing}`}><ChevronLeft className="h-6 w-6" /></button>
            <img src={current.image} alt={current.caption || current.title} onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />
            <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className={`absolute right-3 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 ${focusRing}`}><ChevronRight className="h-6 w-6" /></button>
          </div>
          <div className="px-4 py-5 text-center text-white sm:px-8" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-xl font-semibold">{current.title}</p>
            {current.caption && <p className="mx-auto mt-1 max-w-2xl text-sm text-white/65">{current.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
