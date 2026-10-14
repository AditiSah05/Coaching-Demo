"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { sponsoredCadets, sponsoredGroup } from '../data/sponsoredCadets';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const companies = [...new Set([...sponsoredCadets.map((c) => c.company), sponsoredGroup.company])];
const cadetCount = sponsoredCadets.length + sponsoredGroup.names.length;
const countFor = (company) =>
  company === sponsoredGroup.company ? sponsoredGroup.names.length : sponsoredCadets.filter((c) => c.company === company).length;

export const Results = () => {
  const [company, setCompany] = useState('All');
  const [poster, setPoster] = useState(null);

  const cadets = sponsoredCadets.filter((c) => company === 'All' || c.company === company);
  const showGroup = company === 'All' || company === sponsoredGroup.company;

  useEffect(() => {
    if (!poster) return;
    const onKey = (e) => e.key === 'Escape' && setPoster(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [poster]);

  return (
    <div className="min-h-screen bg-ivory text-ink">

      <header className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-serif text-6xl font-semibold leading-[0.95] tracking-tight text-navy-deep sm:text-7xl">Results</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/70">
              Our cadets who have won sponsorships from shipping companies, and begin their careers at sea.
            </p>
          </div>
          <dl className="flex gap-10">
            <div>
              <dd className="font-serif text-6xl font-semibold leading-none text-navy-deep">{cadetCount}</dd>
              <dt className="mt-2 text-[15px] text-ink/60">cadets sponsored</dt>
            </div>
            <div>
              <dd className="font-serif text-6xl font-semibold leading-none text-navy-deep">{companies.length}</dd>
              <dt className="mt-2 text-[15px] text-ink/60">shipping companies</dt>
            </div>
          </dl>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">

        {/* Filter by company */}
        <div role="group" aria-label="Filter by shipping company" className="flex flex-wrap gap-2.5 border-t border-navy-deep/15 pt-8">
          {['All', ...companies].map((c) => {
            const on = company === c;
            return (
              <button
                key={c}
                onClick={() => setCompany(c)}
                aria-pressed={on}
                className={`rounded-full border px-5 py-2.5 text-[15px] font-semibold transition-colors ${focusRing} ${on ? 'border-navy-deep bg-navy-deep text-white' : 'border-navy-deep/20 bg-white text-navy-deep hover:border-gold hover:bg-gold-light'}`}
              >
                {c}
                <span className={`ml-2 font-normal ${on ? 'text-white/65' : 'text-ink/45'}`}>{c === 'All' ? cadetCount : countFor(c)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cadets.map((c) => (
            <article key={c.id} className="group flex flex-col items-center rounded-[1.75rem] border border-navy-deep/10 bg-white px-6 pb-7 pt-9 text-center shadow-chunky transition-all duration-300 hover:-translate-y-1 hover:shadow-chunky-lg">
              <img
                src={c.photo}
                alt={c.name}
                loading="lazy"
                className="h-36 w-36 rounded-full object-cover ring-2 ring-gold ring-offset-4 ring-offset-white transition-transform duration-500 group-hover:scale-105"
              />
              <h2 className="mt-6 font-serif text-2xl font-semibold leading-tight text-navy-deep">{c.name}</h2>
              <p className="mt-1.5 text-[15px] text-ink/55">Sponsored by</p>
              <p className="mt-0.5 text-lg font-semibold text-navy-deep">{c.company}</p>
              <button
                onClick={() => setPoster(c.poster)}
                className={`mt-5 rounded-full px-4 py-2 text-sm font-semibold text-goldtext transition-colors hover:bg-gold-light ${focusRing}`}
              >
                View poster
              </button>
            </article>
          ))}

          {showGroup && (
            <article className="grid gap-8 rounded-[1.75rem] border border-navy-deep/10 bg-white p-6 shadow-chunky sm:col-span-2 sm:p-8 lg:col-span-4 lg:grid-cols-12 lg:items-center lg:gap-10">
              <img
                src={sponsoredGroup.photo}
                alt={`Cadets sponsored by ${sponsoredGroup.company}`}
                loading="lazy"
                className="w-full rounded-2xl border border-navy-deep/10 object-cover lg:col-span-7"
              />
              <div className="lg:col-span-5">
                <p className="text-[15px] text-ink/55">Sponsored by</p>
                <h2 className="font-serif text-4xl font-semibold text-navy-deep">{sponsoredGroup.company}</h2>
                <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] font-medium text-navy-deep">
                  {sponsoredGroup.names.map((n) => <li key={n}>{n}</li>)}
                </ul>
                <button
                  onClick={() => setPoster(sponsoredGroup.poster)}
                  className={`mt-6 rounded-full border border-navy-deep/25 px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}
                >
                  View poster
                </button>
              </div>
            </article>
          )}
        </div>
      </main>

      {poster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/90 p-4 backdrop-blur-sm" onClick={() => setPoster(null)} role="dialog" aria-modal="true" aria-label="Cadet poster">
          <button onClick={() => setPoster(null)} aria-label="Close" className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 ${focusRing}`}>
            <X className="h-5 w-5" />
          </button>
          <img src={poster} alt="Sponsorship poster" onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-auto max-w-[92vw] rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};
