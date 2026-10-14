"use client";

import React from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { FileText, ArrowUpRight, Download } from 'lucide-react';

// The free PDFs listed on the academy's study-materials page.
const materials = [
  { title: 'IMUCET Sunday Mock Test', tag: 'Mock Test' },
  { title: 'IMUCET 2024 Paper', tag: 'Past Paper' },
  { title: 'IMUCET Syllabus', tag: 'Syllabus' },
  { title: 'Seas, Rivers & Straits', tag: 'General Knowledge' },
  { title: 'Countries, Capitals & Currencies', tag: 'General Knowledge' },
  { title: 'Ports & Shipping', tag: 'General Knowledge' },
  { title: 'DNS / BSc / B.Tech', tag: 'Course Notes' },
];

export const FreeMaterials = () => (
  <section className="bg-ivory py-24 text-ink">
    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
      {/* Pitch */}
      <div className="lg:col-span-4">
        <span className="badge-solid text-goldtext">Free Material</span>
        <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-navy-deep sm:text-5xl">
          Free study <span className="text-goldtext">material</span>
        </h2>
        <span className="mt-6 block h-px w-16 bg-gold" aria-hidden="true" />
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
          Mock tests, past papers and notes for IMU CET and DNS preparation, from Pacific Marine Academy.
        </p>
        <Link
          href="/study-materials"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-deep px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-navy-light"
        >
          <Download className="h-4 w-4" /> Open the study hub
        </Link>
      </div>

      {/* Resource list */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
        {materials.map(({ title, tag }, i) => (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: (i % 2) * 0.06 + Math.floor(i / 2) * 0.05 }}
            className={i === materials.length - 1 && materials.length % 2 ? 'sm:col-span-2' : ''}
          >
            <Link
              href="/study-materials"
              className="group flex items-center gap-4 rounded-2xl border border-navy-deep/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-chunky"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-light text-goldtext transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                <FileText className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-lg font-semibold leading-snug text-navy-deep">{title}</span>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{tag} · PDF</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy-deep" />
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);
