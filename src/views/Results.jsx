"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useData } from '../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

// Everything shown is taken from the poster itself: who, which company, and any extra line printed on it.
const titleOf = (p) => (p.names.length > 1 ? `${p.names.length} cadets` : p.names[0]);
const describe = (p) => {
  if (p.note) return p.note;
  const who = p.names.length > 1 ? `${p.names.join(', ')}. ` : '';
  return `${who}Sponsored by ${p.company}.${p.detail ? ` ${p.detail}.` : ''}`;
};

export const Results = () => {
  const { resultPosters } = useData();
  const years = Object.keys(resultPosters).sort((a, b) => b - a);
  const total = years.reduce((n, y) => n + resultPosters[y].length, 0);
  const [year, setYear] = useState('All');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null); // index into the posters currently shown

  const q = query.trim().toLowerCase();
  const matches = (p) => !q || [...p.names, p.company, p.detail].some((v) => String(v).toLowerCase().includes(q));
  const groups = years
    .filter((y) => year === 'All' || y === year)
    .map((y) => ({ year: y, items: resultPosters[y].filter(matches) }))
    .filter((g) => g.items.length > 0);
  const shown = groups.flatMap((g) => g.items);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length)), [shown.length]);

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

  let index = -1; // running position across groups, so each poster knows its place in the viewer
  const current = open !== null ? shown[open] : null;

  return (
    <div className="min-h-screen bg-ivory text-ink">

      <header className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-serif text-6xl font-semibold leading-[0.95] tracking-tight text-navy-deep sm:text-7xl">Results</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/70">
              Our cadets who won sponsorships from shipping companies. Tap a poster to see it full size.
            </p>
          </div>

          <div role="group" aria-label="Filter by year" className="inline-flex self-start rounded-full border border-navy-deep/15 bg-white p-1.5 lg:self-auto">
            {['All', ...years].map((y) => {
              const on = year === y;
              const count = y === 'All' ? total : resultPosters[y].length;
              return (
                <button
                  key={y}
                  onClick={() => { setYear(y); setOpen(null); }}
                  aria-pressed={on}
                  className={`rounded-full px-6 py-3 text-base font-semibold transition-colors ${focusRing} ${on ? 'bg-navy-deep text-white' : 'text-navy-deep/70 hover:bg-gold-light'}`}
                >
                  {y}
                  <span className={`ml-2 text-sm font-normal ${on ? 'text-white/65' : 'text-ink/45'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-8 w-full sm:max-w-md">
          <label htmlFor="result-search" className="sr-only">Search by cadet or company</label>
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
          <input
            id="result-search"
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(null); }}
            placeholder="Search a cadet or company"
            className="h-14 w-full rounded-full border border-navy-deep/15 bg-white pl-12 pr-5 text-base shadow-chunky placeholder:text-ink/35 focus:border-navy-deep focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {groups.map((g) => (
          <section key={g.year} aria-label={`${g.year} sponsorships`} className="border-t border-navy-deep/15 py-10">
            {year === 'All' && <h2 className="mb-8 font-serif text-4xl font-semibold text-navy-deep">{g.year}</h2>}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map((p) => {
                index += 1;
                const i = index;
                return (
                  <article key={p.src} className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-navy-deep/10 bg-white shadow-chunky transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-chunky-lg">
                    <button onClick={() => setOpen(i)} aria-label={`View poster: ${titleOf(p)}`} className={`block overflow-hidden bg-ivory ${focusRing}`}>
                      <img src={p.src} alt={`Sponsorship poster for ${p.names.join(', ')}`} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    </button>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-xl font-semibold leading-snug text-navy-deep">{titleOf(p)}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{describe(p)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-navy-deep/25 bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl font-semibold text-navy-deep">No results match {'“'}{query.trim()}{'”'}</p>
            <p className="mt-2 text-[15px] text-ink/65">Check the spelling, or search by company instead.</p>
            <button onClick={() => setQuery('')} className={`mt-6 rounded-full border border-navy-deep/25 px-6 py-3 text-sm font-semibold text-navy-deep hover:border-gold hover:bg-gold-light ${focusRing}`}>Clear search</button>
          </div>
        )}
      </main>

      {current && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-deep/90 p-4 backdrop-blur-sm" onClick={close} role="dialog" aria-modal="true" aria-label="Sponsorship poster">
          <button onClick={close} aria-label="Close" className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 ${focusRing}`}>
            <X className="h-5 w-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous poster" className={`absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 ${focusRing}`}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img src={current.src} alt={`Sponsorship poster for ${current.names.join(', ')}`} onClick={(e) => e.stopPropagation()} className="max-h-[76vh] w-auto max-w-[88vw] rounded-2xl shadow-2xl" />
          <div className="mt-5 max-w-xl text-center text-white" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-2xl font-semibold">{titleOf(current)}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-white/75">{describe(current)}</p>
            <p className="mt-3 text-sm font-semibold text-white/55">{open + 1} / {shown.length}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next poster" className={`absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 ${focusRing}`}>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};
