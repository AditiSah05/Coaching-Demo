"use client";

import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ScallopedBorder } from '../common/ScallopedBorder';
import { useCounter } from '../../hooks/useCounter';

const stats = [
  { value: 100, suffix: '%', label: 'Course Completion' },
  { value: 10, suffix: '+', label: 'Years Experienced Teachers' },
  { value: 450, suffix: '+', label: 'Sponsored Cadets in 3 Years' },
  { value: 85, suffix: '%', label: 'IMU-CET Result in 2025' },
];

const Stat = ({ value, suffix, label, run }) => {
  const n = useCounter(value, 1800, run);
  return (
    <div className="group rounded-2xl border border-gold/30 bg-white/[0.04] px-5 py-8 text-center backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:bg-white/[0.08]">
      <p className="font-serif text-5xl font-bold text-gold tabular-nums">
        {n}{suffix}
      </p>
      <span className="mx-auto mt-4 block h-px w-10 bg-gold/50 transition-all duration-300 group-hover:w-16" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{label}</p>
    </div>
  );
};

export const StatsBand = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-ivory" aria-label="Academy achievements">
      <ScallopedBorder fillColor="#021527" />
      <div ref={ref} className="relative -mt-px bg-navy-deep py-14 md:py-20 overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => <Stat key={s.label} {...s} run={inView} />)}
          </div>
        </div>
      </div>
      <ScallopedBorder fillColor="#021527" invert />
    </section>
  );
};
