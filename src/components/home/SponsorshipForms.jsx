"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, GraduationCap } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { examForms } from '../../data/examForms';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const fmt = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const Fact = ({ label, children }) => (
  <div className="flex items-baseline justify-between gap-4 py-3">
    <dt className="text-[15px] text-ink/55">{label}</dt>
    <dd className="text-right text-[15px] font-semibold text-navy-deep">{children}</dd>
  </div>
);

// Right under the hero: the two forms most visitors come for.
export const SponsorshipForms = () => {
  const { forms } = useData();
  const list = forms?.length ? forms : examForms;
  const imu = list.find((f) => /imucet/i.test(f.name)) || examForms[0];
  const companies = list.filter((f) => f !== imu);
  const names = companies.slice(0, 5).map((f) => f.name).join(', ');

  return (
    <section aria-labelledby="forms-heading" className="bg-ivory pb-4 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="forms-heading" className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">Apply for a form</h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* IMU form */}
          <article className="flex flex-col rounded-[1.75rem] border border-navy-deep/10 bg-white p-8 shadow-chunky transition-shadow duration-300 hover:shadow-chunky-lg">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-deep text-gold"><GraduationCap className="h-7 w-7" /></span>
            <h3 className="mt-6 font-serif text-3xl font-semibold text-navy-deep">IMU form</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/65">
              {imu.name}{imu.course ? `, for ${imu.course}` : ''}. This is the entrance exam for maritime courses.
            </p>
            <dl className="mt-6 divide-y divide-navy-deep/10 border-y border-navy-deep/10">
              <Fact label="Batch">{imu.batch}</Fact>
              <Fact label="Form fee">{(imu.fee || '').split(' / ').map((l) => <span key={l} className="block">{l}</span>)}</Fact>
              {imu.lastDate && <Fact label="Last date">{fmt(imu.lastDate)}</Fact>}
            </dl>
            <a
              href={imu.applyUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy-deep px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing} mt-8`}
            >
              Fill the IMU form <ArrowUpRight className="h-4 w-4" />
            </a>
          </article>

          {/* Company sponsorship forms */}
          <article className="flex flex-col rounded-[1.75rem] border border-gold/50 bg-gradient-to-br from-gold-light via-white to-white p-8 shadow-chunky transition-shadow duration-300 hover:shadow-chunky-lg">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-deep text-gold"><Building2 className="h-7 w-7" /></span>
            <h3 className="mt-6 font-serif text-3xl font-semibold text-navy-deep">Company sponsorship forms</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/65">
              Application forms from {companies.length} shipping companies and maritime institutes, with the fee and last date for each.
            </p>
            {names && <p className="mt-6 border-t border-navy-deep/10 pt-6 text-[15px] leading-relaxed text-ink/70"><span className="font-semibold text-navy-deep">Includes: </span>{names} and more.</p>}
            <Link
              href="/forms"
              className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy-deep px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing} mt-8`}
            >
              See all company forms <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
};
