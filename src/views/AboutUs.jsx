"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const paragraphs = (t = '') => t.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export const AboutUs = () => {
  const { settings, faculty } = useData();
  const about = settings?.about || {};

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="border-b border-navy-deep/10">
        <div className="mx-auto grid max-w-7xl items-end gap-8 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-goldtext">About the academy</p>
            <h1 className="mt-4 text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-navy-deep sm:text-6xl lg:text-7xl">
              Your gateway to the Merchant Navy.
            </h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-ink/70 lg:col-span-4">{settings?.tagline}</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {about.story && (
          <section className="grid gap-6 border-b border-navy-deep/15 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold text-navy-deep lg:col-span-3">Our story</h2>
            <div className="space-y-5 text-[17px] leading-[1.85] text-ink/80 lg:col-span-8">
              {paragraphs(about.story).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {(about.mission || about.vision) && (
          <section className="grid gap-10 border-b border-navy-deep/15 py-14 md:grid-cols-2 lg:py-20">
            {about.mission && (
              <div>
                <h2 className="font-serif text-3xl font-semibold text-navy-deep">Our mission</h2>
                <p className="mt-4 text-[17px] leading-[1.85] text-ink/80">{about.mission}</p>
              </div>
            )}
            {about.vision && (
              <div>
                <h2 className="font-serif text-3xl font-semibold text-navy-deep">Our vision</h2>
                <p className="mt-4 text-[17px] leading-[1.85] text-ink/80">{about.vision}</p>
              </div>
            )}
          </section>
        )}

        {faculty.length > 0 && (
          <section className="py-14 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">The people behind the academy</h2>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {faculty.map((p) => (
                <li key={p.id}>
                  {p.image && (
                    <span className="block aspect-[4/5] overflow-hidden rounded-2xl border border-navy-deep/10 bg-ivory-dark">
                      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover object-top" />
                    </span>
                  )}
                  <h3 className="mt-5 font-serif text-2xl font-semibold text-navy-deep">{p.name}</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-goldtext">{p.role}</p>
                  {p.qualification && <p className="mt-1 text-sm text-ink/60">{p.qualification}</p>}
                  {p.bio && <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{p.bio}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-16 grid items-center gap-6 rounded-3xl bg-navy-deep p-8 text-white sm:p-10 lg:mb-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">Visit us in Sikar.</h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/70">{settings?.address}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link href="/contact" className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gold px-7 text-sm font-extrabold uppercase tracking-wider text-navy-deep transition hover:brightness-110 ${focusRing}`}>
              Contact us <ArrowUpRight className="h-4 w-4" />
            </Link>
            {settings?.phonePrimary && (
              <a href={`tel:${settings.phonePrimary.replace(/\s/g, '')}`} className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold ${focusRing}`}>
                <Phone className="h-4 w-4" /> {settings.phonePrimary}
              </a>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
