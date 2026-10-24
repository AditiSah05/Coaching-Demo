"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { imuCetBook } from '../../data/book';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const subjects = ['Physics', 'Chemistry', 'Mathematics', 'English', 'General Aptitude'];

export const MockTest = () => {
  const { studyMaterials = [] } = useData();
  const mock = studyMaterials.find((m) => /mock test/i.test(m.title) && m.downloadUrl);

  return (
    <section aria-labelledby="mock-heading" className="bg-white py-20 text-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-7">
          <h2 id="mock-heading" className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-navy-deep sm:text-5xl">IMUCET mock test</h2>
          <span className="mt-6 block h-px w-16 bg-gold" aria-hidden="true" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            Practise for the IMU CET before the real exam. Download the IMUCET Sunday Mock Test for free, and check how you do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {mock && (
              <a
                href={mock.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full bg-navy-deep px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}
              >
                Download the mock test <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <Link
              href="/study-materials"
              className={`inline-flex items-center gap-2 rounded-full border border-navy-deep/25 px-7 py-4 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}
            >
              More free study material
            </Link>
            <a
              href={imuCetBook.url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border border-navy-deep/25 px-7 py-4 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}
            >
              Get the IMU-CET book <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-navy-deep/10 bg-ivory p-8 shadow-chunky lg:col-span-5">
          <h3 className="font-serif text-2xl font-semibold text-navy-deep">What IMU CET covers</h3>
          <ul className="mt-5 divide-y divide-navy-deep/10 border-t border-navy-deep/10">
            {subjects.map((s) => (
              <li key={s} className="flex items-center gap-3 py-3.5 text-[17px] font-medium text-navy-deep">
                <Check className="h-5 w-5 text-goldtext" aria-hidden="true" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
