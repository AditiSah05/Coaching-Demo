"use client";

import React, { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useData } from '../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const fmt = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const Fact = ({ label, children }) => (
  <div className="flex items-baseline justify-between gap-4">
    <dt className="text-[17px] text-ink/55">{label}</dt>
    <dd className="text-right text-[17px] font-semibold leading-snug text-navy-deep">{children}</dd>
  </div>
);

// Each form is a ticket: who and what on top, a perforated line, then the fee, the date and the way in.
const FormTicket = ({ f }) => (
  <article className={`relative flex flex-col rounded-[1.75rem] border border-navy-deep/10 bg-white shadow-chunky transition-all duration-300 hover:-translate-y-1 hover:shadow-chunky-lg`}>
    <div className="flex flex-col items-center p-7 pb-6 text-center">
      <img src={f.logo} alt="" loading="lazy" className="h-32 w-32 rounded-3xl border border-navy-deep/10 bg-white object-contain p-3" />
      <h2 className="mt-5 font-serif text-2xl font-semibold leading-tight text-navy-deep">{f.name}</h2>
      <p className="mt-1.5 text-[15px] text-ink/60">{f.course ? `${f.course}, ${f.batch}` : f.batch}</p>
    </div>

    {/* perforation */}
    <div className="relative" aria-hidden="true">
      <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-ivory shadow-[inset_-1px_0_0_rgba(2,21,39,0.1)]" />
      <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-ivory shadow-[inset_1px_0_0_rgba(2,21,39,0.1)]" />
      <div className="mx-6 border-t-2 border-dashed border-navy-deep/15" />
    </div>

    <div className="flex flex-1 flex-col p-7 pt-6">
      <dl className="mb-7 space-y-3.5">
        <Fact label="Form fee">
          {f.fee.split(' / ').map((line) => <span key={line} className="block">{line}</span>)}
        </Fact>
        {f.startDate && <Fact label="Start date">{fmt(f.startDate)}</Fact>}
        {f.examDate && <Fact label="Exam date">{fmt(f.examDate)}</Fact>}
        <Fact label="Last date">{f.lastDate ? fmt(f.lastDate) : 'To be announced'}</Fact>
      </dl>

      <a
        href={f.applyUrl}
        target="_blank"
        rel="noreferrer"
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy-deep px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}
      >
        Apply now <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  </article>
);

export const AvailableForms = () => {
  const { examForms } = useData();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = examForms.filter((f) => (!q || `${f.name} ${f.course}`.toLowerCase().includes(q)));

  return (
    <div className="min-h-screen bg-ivory text-ink">

      <header className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-serif text-6xl font-semibold leading-[0.95] tracking-tight text-navy-deep sm:text-7xl">Available forms</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
              Application forms from shipping companies and maritime institutes. Each button takes you to that institute's own application page.
            </p>
          </div>

          <div className="w-full sm:w-80">
            <div className="relative w-full">
              <label htmlFor="form-search" className="sr-only">Search forms</label>
              <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
              <input
                id="form-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search an institute"
                className="h-12 w-full rounded-full border border-navy-deep/15 bg-white pl-12 pr-5 text-base placeholder:text-ink/35 focus:border-navy-deep focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {shown.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((f) => <FormTicket key={`${f.name}-${f.course}`} f={f} />)}
          </div>
        )}

        {shown.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-navy-deep/25 bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl font-semibold text-navy-deep">No forms match {'“'}{query.trim()}{'”'}</p>
            <button onClick={() => setQuery('')} className={`mt-6 rounded-full border border-navy-deep/25 px-6 py-3 text-sm font-semibold text-navy-deep hover:border-gold hover:bg-gold-light ${focusRing}`}>Clear search</button>
          </div>
        )}

        <aside className="mt-12 flex max-w-3xl items-start gap-4 rounded-2xl border border-gold/60 bg-gold-light/60 p-6">
          <p className="text-base leading-relaxed text-ink/80">
            <strong className="font-semibold text-navy-deep">Note: </strong>
            Fees and dates are as listed by each institute and can change. Check the institute's site before you pay.
          </p>
        </aside>
      </main>
    </div>
  );
};
