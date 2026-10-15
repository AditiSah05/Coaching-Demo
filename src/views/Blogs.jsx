"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { blogPosts, blogTopics } from '../data/blogIndex';
import { formatDate } from '../lib/blog';
import { PostCover } from '../components/blog/PostCover';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const PAGE = 9;

const Meta = ({ post }) => (
  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
    <span className="text-goldtext">{post.topic}</span>
    <span aria-hidden="true">·</span>
    <time dateTime={post.date}>{formatDate(post.date)}</time>
    <span aria-hidden="true">·</span>
    <span>{post.minutes} min read</span>
  </p>
);

export const Blogs = () => {
  const [topic, setTopic] = useState('All');
  const [limit, setLimit] = useState(PAGE);

  const [lead, ...rest] = blogPosts;
  const pool = topic === 'All' ? rest : blogPosts.filter((p) => p.topic === topic);
  const shown = pool.slice(0, limit);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="border-b border-navy-deep/10">
        <div className="mx-auto grid max-w-7xl items-end gap-8 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-goldtext">Blog</p>
            <h1 className="mt-4 text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-navy-deep sm:text-6xl lg:text-7xl">
              Guides and stories for Merchant Navy aspirants.
            </h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-ink/70 lg:col-span-4">
            IMU CET preparation, sponsorship, careers at sea and life at the academy, written by Pacific Marine Academy. {blogPosts.length} articles.
          </p>
        </div>
      </header>

      {/* Latest */}
      {topic === 'All' && lead && (
        <section aria-label="Latest article" className="border-b border-navy-deep/10 bg-ivory-dark">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:py-16">
            <Link href={`/blogs/${lead.slug}`} aria-hidden="true" tabIndex={-1} className="group relative block aspect-[16/10] overflow-hidden rounded-3xl border border-navy-deep/10 lg:col-span-7">
              <span className="block h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"><PostCover post={lead} /></span>
            </Link>
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-goldtext">Latest</p>
              <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">
                <Link href={`/blogs/${lead.slug}`} className={`hover:text-goldtext ${focusRing}`}>{lead.title}</Link>
              </h2>
              <div className="mt-4"><Meta post={lead} /></div>
              <p className="mt-5 text-[17px] leading-relaxed text-ink/75">{lead.excerpt}</p>
              <Link href={`/blogs/${lead.slug}`} className={`mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-navy-deep px-7 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}>
                Read the article <ArrowUpRight className="h-4 w-4 text-gold" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">{topic === 'All' ? 'All articles' : topic}</h2>
          <div role="tablist" aria-label="Article topics" className="no-scrollbar flex max-w-full gap-2 overflow-x-auto">
            {['All', ...blogTopics].map((t) => {
              const on = t === topic;
              const count = t === 'All' ? blogPosts.length : blogPosts.filter((p) => p.topic === t).length;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={on}
                  onClick={() => { setTopic(t); setLimit(PAGE); }}
                  className={`inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${on ? 'border-navy-deep bg-navy-deep text-white' : 'border-navy-deep/20 bg-white text-navy-deep hover:border-gold hover:bg-gold-light'} ${focusRing}`}
                >
                  {t} <span className={`text-xs tabular-nums ${on ? 'text-gold' : 'text-ink/45'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul
          key={`${topic}-${limit}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((p) => (
            <li key={p.slug}>
              <article className="group relative flex h-full flex-col">
                <span className="block aspect-[16/10] overflow-hidden rounded-2xl border border-navy-deep/10 bg-ivory-dark">
                  <span className="block h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"><PostCover post={p} /></span>
                </span>
                <div className="mt-5"><Meta post={p} /></div>
                <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-navy-deep">
                  <Link href={`/blogs/${p.slug}`} className={`after:absolute after:inset-0 group-hover:text-goldtext ${focusRing}`}>{p.title}</Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink/70">{p.excerpt}</p>
              </article>
            </li>
          ))}
        </motion.ul>

        {limit < pool.length && (
          <div className="mt-14 flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-ink/60">Showing {shown.length} of {pool.length} articles</p>
            <button onClick={() => setLimit(limit + PAGE)} className={`inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border border-navy-deep/25 px-7 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}>
              Show more articles <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
