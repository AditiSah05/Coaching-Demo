"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { FileText, ArrowDownToLine, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { imuCetBook } from '../data/book';
import { useData } from '../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const groupNotes = {
  'IMU CET': 'Practise the exam itself: a mock test, a past paper and the official syllabus.',
  'General Knowledge': 'Maritime geography and shipping facts that come up in the exams and interviews.',
  'Course Notes': 'Notes for the Diploma in Nautical Science, BSc and B.Tech routes.',
};

// Each material opens its Google Drive link, where the PDF can be downloaded.
const hasLink = (url = '') => /^https?:\/\//.test(url);

const BookShowcase = () => {
  const [i, setI] = useState(3);
  const photo = imuCetBook.photos[i];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-8">
        <div className="flex min-h-[20rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-navy-deep/10 bg-white p-3 shadow-chunky-lg sm:p-5">
          <img src={photo.src} alt={`IMU-CET preparation book: ${photo.label.toLowerCase()}`} className="max-h-[42rem] w-full rounded-xl object-contain" />
        </div>
        <div role="group" aria-label="Book photos" className="mt-5 flex justify-center gap-3">
          {imuCetBook.photos.map((p, n) => (
            <button
              key={p.src}
              onClick={() => setI(n)}
              aria-label={`Show ${p.label.toLowerCase()}`}
              aria-pressed={n === i}
              className={`h-20 w-20 cursor-pointer overflow-hidden rounded-xl border-2 bg-white p-0.5 transition-colors ${focusRing} ${n === i ? 'border-navy-deep' : 'border-navy-deep/15 hover:border-gold'}`}
            >
              <img src={p.src} alt="" loading="lazy" className="h-full w-full rounded-lg object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4">
        <h2 id="book-heading" className="font-serif text-2xl font-semibold leading-tight text-navy-deep sm:text-3xl">{imuCetBook.title}</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">{imuCetBook.description}</p>
        <ul className="mt-6 space-y-3">
          {imuCetBook.includes.map((t) => (
            <li key={t} className="flex items-start gap-3 text-[17px] text-navy-deep"><Check className="mt-1 h-5 w-5 shrink-0 text-goldtext" aria-hidden="true" />{t}</li>
          ))}
        </ul>
        <a href={imuCetBook.url} target="_blank" rel="noreferrer" className={`mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-navy-deep px-8 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}>
          Buy on Amazon <ArrowUpRight className="h-4 w-4 text-gold" />
        </a>
      </div>
    </div>
  );
};

const Row = ({ item, index }) => {
  const ready = hasLink(item.downloadUrl);
  const btn = 'inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors';

  return (
    <li className="group flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-navy-deep/15 px-2 py-6 transition-colors hover:bg-white sm:px-4">
      <span className="w-9 shrink-0 font-serif text-2xl font-semibold tabular-nums text-gold sm:w-12 sm:text-3xl">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="min-w-0 flex-1 basis-56">
        <span className="block font-serif text-xl font-semibold leading-snug text-navy-deep sm:text-2xl">{item.title}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
          <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-goldtext" aria-hidden="true" />PDF</span>
          {item.type && <span>{item.type}</span>}
          {item.size && <span>{item.size}</span>}
        </span>
        {item.previewText && <span className="mt-2 block max-w-xl text-[15px] leading-relaxed text-ink/70">{item.previewText}</span>}
      </span>

      {ready ? (
        <a
          href={item.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} cursor-pointer border border-navy-deep/25 text-navy-deep group-hover:border-navy-deep group-hover:bg-navy-deep group-hover:text-white ${focusRing}`}
        >
          <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> Download PDF
        </a>
      ) : (
        <span aria-disabled="true" title="The download link is not added yet" className={`${btn} cursor-not-allowed border border-navy-deep/10 text-ink/40`}>
          <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> Download PDF
        </span>
      )}
    </li>
  );
};

export const StudyMaterials = () => {
  const { studyMaterials } = useData();

  // Group by category, keeping the order in which categories first appear.
  const groups = [];
  studyMaterials.forEach((m) => {
    const name = m.category || 'Study material';
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, items: [] }));
    g.items.push(m);
  });
  let n = 0;

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="border-b border-navy-deep/10">
        <div className="mx-auto grid max-w-7xl items-end gap-8 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-goldtext">Free study material</p>
            <h1 className="mt-4 text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-navy-deep sm:text-6xl lg:text-7xl">
              Prepare for the IMU CET, free of charge.
            </h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-ink/70 lg:col-span-4">
            Mock tests, past papers and notes from Pacific Marine Academy, for students preparing for the IMU CET and DNS.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {groups.map((g) => (
          <section key={g.name} className="grid gap-6 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <h2 className="font-serif text-3xl font-semibold text-navy-deep">{g.name}</h2>
                {groupNotes[g.name] && <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink/65">{groupNotes[g.name]}</p>}
              </div>
            </div>
            <ul className="border-t border-navy-deep/15 lg:col-span-9">
              {g.items.map((item) => <Row key={item.id} item={item} index={n++} />)}
            </ul>
          </section>
        ))}

        <section aria-labelledby="book-heading" className="border-t border-navy-deep/15 py-12 lg:py-16">
          <BookShowcase />
        </section>

        <section className="grid items-center gap-8 border-t border-navy-deep/15 py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">Want guided preparation?</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
              Our IMU CET Preparation course adds classroom sessions, regular mock tests and interview training to these materials.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link href="/courses/imu-cet-preparation" className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-navy-deep px-7 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}>
              See the IMU CET course <ArrowRight className="h-4 w-4 text-gold" />
            </Link>
            <Link href="/contact" className={`inline-flex min-h-[48px] items-center rounded-full border border-navy-deep/25 px-7 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}>
              Talk to us
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
