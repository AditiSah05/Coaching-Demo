"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Anchor, Compass, Award, BookOpen, GraduationCap, ArrowRight, ArrowUpRight, Clock, Target } from 'lucide-react';

const icons = [Compass, Anchor, Award, GraduationCap, BookOpen];

// Course explorer: pick a course on the left, read its details on the right.
export const CoursesShowcase = ({ courses = [] }) => {
  const [active, setActive] = useState(0);
  if (!courses.length) return null;
  const course = courses[Math.min(active, courses.length - 1)];
  const Icon = icons[active % icons.length];

  return (
    <section className="py-24 bg-white text-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 text-center md:text-left">
          <div>
            <span className="badge-solid text-goldtext mb-5 !text-sm !px-6 !py-2 !tracking-[0.25em]">Programmes</span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-bold text-navy-deep tracking-tight">
              Our <span className="text-goldtext">Courses</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-ink/65 leading-relaxed mx-auto md:mx-0">
              Pick a programme to see what it covers, how long it runs and what it prepares you for.
            </p>
          </div>
          <Link
            href="/courses"
            className="group inline-flex items-center justify-center gap-2 self-center md:self-auto rounded-full border border-navy-deep/20 px-6 py-3 text-sm font-bold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light"
          >
            View All Courses
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[2rem] border border-navy-deep/10 bg-ivory shadow-chunky-lg">

          {/* Course list */}
          <div role="tablist" aria-label="Courses" className="lg:col-span-5 p-3 sm:p-4 lg:p-5 space-y-1.5">
            {courses.map((c, i) => {
              const on = i === active;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group relative flex w-full items-center gap-4 rounded-2xl px-4 py-4 sm:px-5 text-left transition-colors duration-300 ${on ? 'bg-white shadow-chunky' : 'hover:bg-white/60'}`}
                >
                  <span className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gold transition-opacity ${on ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                  <span className={`font-serif text-2xl font-bold tabular-nums transition-colors ${on ? 'text-goldtext' : 'text-gold/60'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-serif text-lg font-bold leading-snug transition-colors ${on ? 'text-navy-deep' : 'text-navy-deep/75'}`}>{c.title}</span>
                    {c.duration && <span className="mt-0.5 block text-xs font-medium text-ink/55">{c.duration}</span>}
                  </span>
                  <ArrowRight className={`h-5 w-5 shrink-0 text-goldtext transition-all duration-300 ${on ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7 relative bg-gradient-to-br from-white via-white to-gold-light p-7 sm:p-10 lg:p-12 lg:border-l border-navy-deep/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={course.id}
                role="tabpanel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex h-full min-h-[22rem] flex-col"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-deep text-gold shadow-chunky">
                    <Icon className="h-7 w-7" />
                  </span>
                  {course.badge && (
                    <span className="whitespace-nowrap rounded-full bg-terracotta px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-navy-deep">
                      {course.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-navy-deep">{course.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-ink/70 line-clamp-5">{course.description}</p>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.duration && (
                    <div className="flex items-start gap-3 rounded-2xl border border-navy-deep/10 bg-white/80 p-4">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-goldtext" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/50">Duration</p>
                        <p className="mt-1 text-sm font-semibold text-navy-deep">{course.duration}</p>
                      </div>
                    </div>
                  )}
                  {course.targetExam && (
                    <div className="flex items-start gap-3 rounded-2xl border border-navy-deep/10 bg-white/80 p-4">
                      <Target className="mt-0.5 h-5 w-5 shrink-0 text-goldtext" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/50">Prepares you for</p>
                        <p className="mt-1 text-sm font-semibold text-navy-deep">{course.targetExam}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  <Link
                    href={`/admission?course=${encodeURIComponent(course.title)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-navy-deep px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy-light"
                  >
                    Register Now <ArrowUpRight className="h-4 w-4 text-gold" />
                  </Link>
                  <Link
                    href={`/courses/${course.slug || course.id}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-navy-deep/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-deep transition-colors hover:border-gold hover:bg-gold-light"
                  >
                    Full Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};
