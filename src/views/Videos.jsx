"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, ArrowDown, ArrowUpRight, ExternalLink, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { youtubeId } from '../lib/youtube';
import { shortsMeta, topicOrder, featuredShort } from '../data/shortsMeta';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const embed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

// Titles from YouTube are often ALL CAPS; show those in normal title case.
const small = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'at', 'by', 'is', 'your', 'you']);
const tidy = (t = '') => {
  const letters = t.replace(/[^A-Za-z]/g, '');
  const caps = letters.replace(/[^A-Z]/g, '').length;
  if (letters.length < 6 || caps / letters.length < 0.6) return t;
  return t.toLowerCase().replace(/\b[a-z][a-z'.]*/g, (w, i) => (i > 0 && small.has(w) ? w : w[0].toUpperCase() + w.slice(1)));
};

// Column settings for the video wall: direction, speed and how it is hidden on small screens.
const wall = [
  { dir: 'reel-up', d: '95s', show: '' },
  { dir: 'reel-down', d: '120s', show: '' },
  { dir: 'reel-up', d: '80s', show: 'hidden sm:flex' },
  { dir: 'reel-down', d: '105s', show: 'hidden lg:flex' },
  { dir: 'reel-up', d: '125s', show: 'hidden lg:flex' },
];

const WallCard = ({ v, onOpen, hidden }) => (
  <button
    tabIndex={hidden ? -1 : undefined}
    onClick={(e) => onOpen(v, e.currentTarget)}
    aria-label={`Play: ${tidy(v.title)}`}
    className={`group relative block aspect-[9/16] w-[190px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-navy-deep shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:z-10 hover:scale-105 hover:border-gold sm:w-[210px] ${focusRing}`}
  >
    <img src={thumb(v.id)} alt="" className="h-full w-full object-cover" />
    <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
    <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-navy-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <Play className="ml-0.5 h-4 w-4 fill-current" />
    </span>
  </button>
);

const RowCard = ({ v, onOpen }) => (
  <button onClick={(e) => onOpen(e.currentTarget)} aria-label={`Play: ${tidy(v.title)}`} className={`group block w-[200px] shrink-0 cursor-pointer snap-start text-left sm:w-[230px] ${focusRing}`}>
    <span className="relative block aspect-[9/16] overflow-hidden rounded-2xl border border-navy-deep/10 bg-navy-deep shadow-chunky transition-shadow duration-300 group-hover:shadow-chunky-lg">
      <img src={thumb(v.id)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
      <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-navy-deep shadow-chunky transition-transform duration-300 group-hover:scale-110">
        <Play className="ml-0.5 h-5 w-5 fill-current" />
      </span>
    </span>
    <span className="mt-3 line-clamp-2 block font-serif text-base font-semibold leading-snug text-navy-deep">{tidy(v.title)}</span>
  </button>
);

export const Videos = () => {
  const { settings } = useData();
  const channel = settings?.youtubeChannelUrl;
  const [topic, setTopic] = useState('All');
  const [open, setOpen] = useState(null);
  const [queue, setQueue] = useState([]);
  const closeBtn = useRef(null);
  const opener = useRef(null);
  const row = useRef(null);

  const all = (settings?.youtubeShorts || [])
    .map(youtubeId)
    .filter(Boolean)
    .map((id) => ({ id, title: shortsMeta[id]?.title || 'YouTube Short', topic: shortsMeta[id]?.topic || 'More videos' }));
  const topics = [...topicOrder.filter((t) => all.some((v) => v.topic === t)), ...(all.some((v) => v.topic === 'More videos') ? ['More videos'] : [])];
  const list = ['All', ...topics];
  const pool = topic === 'All' ? all : all.filter((v) => v.topic === topic);
  const featured = all.find((v) => v.id === featuredShort) || all[0];

  const launch = (items, i, el) => { opener.current = el; setQueue(items); setOpen(i); };
  const close = useCallback(() => { setOpen(null); opener.current?.focus(); }, []);
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + queue.length) % queue.length)), [queue.length]);

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft' && queue.length > 1) step(-1);
      if (e.key === 'ArrowRight' && queue.length > 1) step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close, step, queue.length]);

  useEffect(() => { row.current?.scrollTo({ left: 0 }); }, [topic]);

  const current = open !== null ? queue[open] : null;
  const columns = wall.map((_, c) => all.filter((_, i) => i % wall.length === c));

  if (!all.length) {
    return (
      <div className="min-h-[60vh] bg-ivory px-4 py-24 text-center">
        <h1 className="font-serif text-4xl font-semibold text-navy-deep">Videos</h1>
        <p className="mt-3 text-ink/65">Videos are coming soon.</p>
      </div>
    );
  }

  const words = 'Watch the academy in motion.'.split(' ');

  return (
    <div className="min-h-screen bg-ivory text-ink">
      {/* Live video wall */}
      <section aria-label="Video wall" className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-navy-dark text-white">
        <div className="absolute inset-[-25%] -z-10 flex justify-center gap-4 [transform:rotate(-9deg)] sm:gap-5" aria-hidden={false}>
          {columns.map((col, c) => (
            <div key={c} className={`reel-col ${wall[c].show || 'flex'} flex-col`} style={{ marginTop: c % 2 ? '-6rem' : '0' }}>
              <div className={`${wall[c].dir} flex flex-col gap-4 sm:gap-5`} style={{ '--d': wall[c].d }}>
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex flex-col gap-4 sm:gap-5" aria-hidden={copy === 1 || undefined}>
                    {col.map((v) => <WallCard key={`${copy}-${v.id}`} v={v} hidden={copy === 1} onOpen={(item, el) => launch([item], 0, el)} />)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Soft shade so the headline stays readable over the wall */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(1,14,27,0.95)_0%,rgba(1,14,27,0.82)_32%,rgba(1,14,27,0.25)_70%,rgba(1,14,27,0.6)_100%)]" />

        <div className="pointer-events-none relative px-4 py-16 text-center sm:px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Video gallery</motion.p>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }} className={`inline-block ${i >= 3 ? 'text-gold' : ''}`}>{w}</motion.span>
            )).reduce((acc, el, i) => (i ? [...acc, ' ', el] : [el]), [])}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.9 }} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Mock interviews, mock tests, shipping-company guides and life at the academy. Tap any video to play it.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1 }} className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
            {featured && (
              <button onClick={(e) => launch([featured], 0, e.currentTarget)} className={`inline-flex min-h-[52px] cursor-pointer items-center gap-3 rounded-full bg-gold px-8 text-sm font-extrabold uppercase tracking-wider text-navy-deep transition hover:brightness-110 ${focusRing}`}>
                <Play className="h-4 w-4 fill-current" /> Play featured
              </button>
            )}
            <a href="#topics" className={`inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-gold hover:text-gold ${focusRing}`}>
              Browse by topic <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-4xl font-semibold leading-tight text-navy-deep sm:text-5xl">Pick a topic.</h2>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink/65">Every video, sorted by what you want to learn.</p>
            <div role="tablist" aria-label="Video topics" className="mt-8 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible">
              {list.map((t, i) => {
                const on = t === topic;
                const count = t === 'All' ? all.length : all.filter((v) => v.topic === t).length;
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setTopic(t)}
                    className={`group relative flex min-h-[48px] shrink-0 cursor-pointer items-center gap-4 rounded-full border px-5 text-left transition-colors lg:rounded-none lg:border-0 lg:border-t lg:border-navy-deep/15 lg:px-2 lg:py-4 ${on ? 'border-navy-deep bg-navy-deep text-white lg:bg-transparent lg:text-navy-deep' : 'border-navy-deep/20 bg-white text-navy-deep/70 hover:text-navy-deep lg:bg-transparent'} ${focusRing}`}
                  >
                    {on && <motion.span layoutId="topic-bar" className="absolute inset-y-2 left-0 hidden w-1 rounded-full bg-gold lg:block" />}
                    <span className={`hidden w-8 font-serif text-xl font-semibold tabular-nums lg:block ${on ? 'text-goldtext' : 'text-gold/70'}`}>{String(i).padStart(2, '0')}</span>
                    <span className="flex-1 whitespace-nowrap font-serif text-lg font-semibold lg:whitespace-normal lg:text-xl">{t}</span>
                    <span className={`text-sm tabular-nums ${on ? 'text-gold lg:text-ink/50' : 'text-ink/40'}`}>{count}</span>
                  </button>
                );
              })}
              <div className="hidden border-t border-navy-deep/15 lg:block" />
            </div>
            {channel && (
              <a href={channel} target="_blank" rel="noopener noreferrer" className={`mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-navy-deep/25 px-6 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}>
                Visit our YouTube channel <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="min-w-0 lg:col-span-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-goldtext">{topic === 'All' ? 'All videos' : topic} · {pool.length}</p>
              <div className="hidden gap-2 sm:flex">
                <button onClick={() => row.current?.scrollBy({ left: -480, behavior: 'smooth' })} aria-label="Scroll videos left" className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-navy-deep/20 text-navy-deep transition-colors hover:bg-navy-deep hover:text-white ${focusRing}`}><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => row.current?.scrollBy({ left: 480, behavior: 'smooth' })} aria-label="Scroll videos right" className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-navy-deep/20 text-navy-deep transition-colors hover:bg-navy-deep hover:text-white ${focusRing}`}><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={topic}
                ref={row}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-6 sm:mx-0 sm:px-0"
              >
                {pool.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}>
                    <RowCard v={v} onOpen={(el) => launch(pool, i, el)} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <section aria-label="Follow the academy" className="mt-16 grid items-center gap-6 rounded-3xl bg-navy-deep p-8 text-white sm:p-10 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">Never miss a video.</h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/70">New Shorts go up regularly. Subscribe on YouTube, or join the next batch and learn with us in Sikar.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            {channel && (
              <a href={channel} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gold px-7 text-sm font-extrabold uppercase tracking-wider text-navy-deep transition hover:brightness-110 ${focusRing}`}>
                Subscribe <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <Link href="/admission" className={`inline-flex min-h-[48px] items-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold ${focusRing}`}>
              Enrol now
            </Link>
            {settings?.phonePrimary && (
              <a href={`tel:${settings.phonePrimary.replace(/\s/g, '')}`} className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold ${focusRing}`}>
                <Phone className="h-4 w-4" /> {settings.phonePrimary}
              </a>
            )}
          </div>
        </section>
      </section>

      {current && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-navy-dark/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <div className="flex items-center justify-between px-4 py-4 text-white sm:px-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold tabular-nums text-white/70">{queue.length > 1 ? `${String(open + 1).padStart(2, '0')} / ${String(queue.length).padStart(2, '0')}` : 'Now playing'}</p>
            <button ref={closeBtn} onClick={close} aria-label="Close" className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 ${focusRing}`}><X className="h-5 w-5" /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            {queue.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous video" className={`absolute left-3 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 ${focusRing}`}><ChevronLeft className="h-6 w-6" /></button>
            )}
            <div className="aspect-[9/16] h-full max-h-[78vh] overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <iframe key={current.id} src={embed(current.id)} title={current.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
            </div>
            {queue.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next video" className={`absolute right-3 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 ${focusRing}`}><ChevronRight className="h-6 w-6" /></button>
            )}
          </div>
          <div className="px-4 py-4 text-center text-white sm:px-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{current.topic}</p>
            <p className="mx-auto mt-1 max-w-2xl font-serif text-lg font-semibold">{tidy(current.title)}</p>
            <a href={`https://www.youtube.com/shorts/${current.id}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/65 underline-offset-4 hover:text-gold hover:underline">
              Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
