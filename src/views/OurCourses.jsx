"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Check, Clock, MapPin, Minus, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';

// One-line orientation for each route. Unknown categories (added in admin) simply get no blurb.
const routeNotes = {
  'Entrance Exam': 'The IMU CET is the gateway exam to maritime courses. Start here if you have not cleared it yet.',
  'Deck Cadets': 'Train to become a deck officer, responsible for navigating and running the ship.',
  'Engine Cadets': 'Train to run and maintain the ship’s engines and machinery.',
};

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const List = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/80">
        <Check className="mt-1 h-4 w-4 shrink-0 text-goldtext" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Fact = ({ label, children }) => (
  <div>
    <dt className="text-sm font-semibold text-navy-deep">{label}</dt>
    <dd className="mt-1 text-[15px] leading-relaxed text-ink/75">{children}</dd>
  </div>
);

const CourseRow = ({ course, open, onToggle }) => {
  const panelId = `course-panel-${course.id}`;
  return (
    <article className={`group border-b border-navy-deep/15 transition-colors duration-300 ${open ? 'bg-white' : 'hover:bg-white/60'}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full items-start gap-5 px-5 py-7 text-left sm:px-8 ${focusRing}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-[1.65rem] font-semibold leading-tight text-navy-deep sm:text-[2.1rem]">
            {course.title}
          </span>
          <span className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm text-ink/65">
            {course.duration && (
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-goldtext" />{course.duration}</span>
            )}
            {course.mode && (
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-goldtext" />{course.mode} classes in Sikar</span>
            )}
          </span>
          {!open && course.eligibility && (
            <span className="mt-4 block max-w-2xl text-[15px] leading-relaxed text-ink/70 line-clamp-2">
              <span className="font-semibold text-navy-deep">Eligibility: </span>{course.eligibility}
            </span>
          )}
        </span>

        <span className="flex shrink-0 items-center gap-4 pt-1">
          {course.badge && (
            <span className="hidden rounded-full bg-terracotta px-3.5 py-1.5 text-xs font-semibold text-navy-deep sm:inline-block">{course.badge}</span>
          )}
          <span className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${open ? 'border-navy-deep bg-navy-deep text-white' : 'border-navy-deep/25 text-navy-deep group-hover:border-gold group-hover:bg-gold-light'}`}>
            {open ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </span>
        </span>
      </button>

      <div id={panelId} inert={!open} className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="grid gap-10 px-5 pb-10 pt-2 sm:px-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-[15px] leading-[1.8] text-ink/80">{course.description}</p>
              <dl className="mt-7 space-y-5 border-t border-navy-deep/10 pt-6">
                {course.eligibility && <Fact label="Who can join">{course.eligibility}</Fact>}
                {course.targetExam && <Fact label="Prepares you for">{course.targetExam}</Fact>}
                {course.fee && <Fact label="Fee">{course.fee}</Fact>}
              </dl>
            </div>

            <div className="space-y-8 lg:col-span-3">
              {course.syllabus?.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold text-navy-deep">What you study</h3>
                  <div className="mt-4"><List items={course.syllabus} /></div>
                </div>
              )}
              {course.highlights?.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold text-navy-deep">What you get</h3>
                  <div className="mt-4"><List items={course.highlights} /></div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/admission?course=${encodeURIComponent(course.title)}`}
                  className={`rounded-full bg-navy-deep px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}
                >
                  Enrol in this course
                </Link>
                <Link
                  href={`/courses/${course.slug || course.id}`}
                  className={`rounded-full border border-navy-deep/25 px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}
                >
                  Course page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const OurCourses = () => {
  const { courses, settings } = useData();
  const [openId, setOpenId] = useState(courses[0]?.id ?? null);

  // Group by category, keeping the order in which categories first appear.
  const groups = [];
  courses.forEach((c) => {
    const name = c.category || 'Courses';
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, items: [] }));
    g.items.push(c);
  });

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="border-b border-navy-deep/10">
        <div className="mx-auto grid max-w-7xl items-end gap-8 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-navy-deep sm:text-6xl lg:col-span-7 lg:text-7xl">
            Courses for the Merchant Navy
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-ink/70 lg:col-span-5">
            Coaching planned by master mariners for the IMU CET, DNS sponsorship exams and the degree routes to sea.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {groups.map((g) => (
          <section key={g.name} className="grid gap-6 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <h2 className="font-serif text-3xl font-semibold text-navy-deep">{g.name}</h2>
                {routeNotes[g.name] && <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink/65">{routeNotes[g.name]}</p>}
              </div>
            </div>
            <div className="border-t border-navy-deep/15 lg:col-span-9">
              {g.items.map((c) => (
                <CourseRow key={c.id} course={c} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)} />
              ))}
            </div>
          </section>
        ))}

        <section className="grid items-center gap-8 border-t border-navy-deep/15 py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">Not sure which course fits you?</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
              Call us or send your details through the admission form, and we will help you choose.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            {settings?.phonePrimary && (
              <a
                href={`tel:${settings.phonePrimary.replace(/\s/g, '')}`}
                className={`rounded-full bg-navy-deep px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}
              >
                Call {settings.phonePrimary}
              </a>
            )}
            <Link
              href="/admission"
              className={`rounded-full border border-navy-deep/25 px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}
            >
              Fill the admission form
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
