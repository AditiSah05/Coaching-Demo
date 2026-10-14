"use client";

import React, { useEffect, useState } from 'react';
import { Star, ExternalLink, PenLine } from 'lucide-react';

const MIN_RATING = 4;
const FALLBACK_URL = 'https://www.google.com/maps/place/Pacific+Marine+Academy/@27.6306716,75.1597784,17z';

// Reviews are shown word-for-word; only runs of dots are tidied into a proper ellipsis.
const tidy = (t = '') => t.replace(/\s*\.{2,}\s*/g, '… ').replace(/\s+/g, ' ').trim();

const GoogleG = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

const Stars = ({ n = 5, className = 'h-4 w-4' }) => (
  <span className="flex items-center gap-0.5" aria-label={`${n} out of 5 stars`}>
    {[...Array(n)].map((_, i) => <Star key={i} className={`${className} fill-[#FBBC05] text-[#FBBC05]`} />)}
  </span>
);

const Card = ({ item, url }) => (
  <figure className="flex h-[300px] w-[320px] shrink-0 flex-col rounded-3xl border border-navy-deep/10 bg-ivory p-7 sm:w-[420px]">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep text-sm font-bold uppercase tracking-wide text-gold">
          {item.name.substring(0, 2)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-serif text-base font-semibold text-navy-deep">{item.name}</span>
          <Stars n={item.rating || 5} className="h-4 w-4" />
        </span>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" aria-label="View on Google" className="shrink-0">
        <GoogleG className="h-6 w-6" />
      </a>
    </div>
    <blockquote className="mt-5 flex-1 overflow-hidden text-base leading-relaxed text-ink/80">{tidy(item.text)}</blockquote>
  </figure>
);

export const Testimonials = ({ items = [], reviewsUrl = '', writeUrl = '' }) => {
  const [live, setLive] = useState(null);
  const [links, setLinks] = useState({});

  // Live Google reviews when the API is configured; otherwise the saved ones below.
  useEffect(() => {
    let off = false;
    fetch('/api/google-reviews')
      .then((r) => r.json())
      .then((d) => {
        if (off) return;
        setLinks({ url: d.url, writeUrl: d.writeUrl });
        if (d.source === 'google' && d.reviews?.length) setLive(d);
      })
      .catch(() => {});
    return () => { off = true; };
  }, []);

  const list = (live ? live.reviews : items).filter((r) => (r.rating || 5) >= MIN_RATING);
  if (!list.length) return null;

  const url = reviewsUrl || links.url || FALLBACK_URL;
  const reviewUrl = writeUrl || links.writeUrl || url;

  return (
    <section className="overflow-hidden bg-white py-24 text-ink">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <span className="badge-solid text-goldtext">Student Reviews</span>
        <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-navy-deep sm:text-5xl">
          What our students <span className="text-goldtext">say</span>
        </h2>
        <span className="mx-auto mt-6 block h-px w-16 bg-gold" aria-hidden="true" />
      </div>

      {/* One row. Each review appears once; the set repeats only so the loop is seamless. */}
      <div className="marquee-pause mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
        <div className="flex w-max animate-marquee-slow py-3">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-6 pr-6" aria-hidden={copy === 1 || undefined}>
              {list.map((item) => <Card key={`${copy}-${item.id}`} item={item} url={url} />)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-navy-deep px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-navy-light">
          <PenLine className="h-4 w-4" /> Write a review
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-navy-deep/20 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-deep transition-colors hover:border-gold hover:bg-gold-light">
          Read all reviews on Google <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};
