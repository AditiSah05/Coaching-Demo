"use client";

import React from 'react';
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Clock, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { NotFound } from './NotFound';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const List = ({ items, columns = false }) => (
  <ul className={columns ? 'grid gap-x-10 gap-y-3 sm:grid-cols-2' : 'space-y-3'}>
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

const Block = ({ title, children }) => (
  <section className="border-t border-navy-deep/15 py-10 first:border-t-0 first:pt-0">
    <h2 className="font-serif text-2xl font-semibold text-navy-deep sm:text-3xl">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
);

export const CourseDetail = ({ slug }) => {
  const { courses, settings } = useData();
  const course = courses.find((c) => c.slug === slug || c.id === slug);
  if (!course) return <NotFound />;

  const others = courses.filter((c) => c.id !== course.id);
  const enrol = `/admission?course=${encodeURIComponent(course.title)}`;
  const phone = settings?.phonePrimary;

  return (
    <div className="min-h-screen bg-ivory text-ink">
      {/* Header */}
      <header className="border-b border-navy-deep/10">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-16">
          <Link href="/courses" className={`inline-flex items-center gap-2 text-sm font-semibold text-ink/65 transition-colors hover:text-navy-deep ${focusRing}`}>
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>

          <div className="mt-8 grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {course.category && <p className="text-sm font-semibold text-goldtext">{course.category}</p>}
              <h1 className="mt-2 font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-navy-deep sm:text-6xl lg:text-7xl">
                {course.title}
              </h1>
              <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[15px] text-ink/70">
                {course.duration && (
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-goldtext" />{course.duration}</span>
                )}
                {course.mode && (
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-goldtext" />{course.mode} classes in Sikar</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link href={enrol} className={`rounded-full bg-navy-deep px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}>
                Enrol in this course
              </Link>
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className={`rounded-full border border-navy-deep/25 px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}>
                  Call {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
          {/* At a glance */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl font-semibold text-navy-deep">At a glance</h2>
              <dl className="mt-5 space-y-5 border-t border-navy-deep/15 pt-6">
                {course.duration && <Fact label="Duration">{course.duration}</Fact>}
                {course.eligibility && <Fact label="Who can join">{course.eligibility}</Fact>}
                {course.targetExam && <Fact label="Prepares you for">{course.targetExam}</Fact>}
                {course.mode && <Fact label="Classes">{course.mode}, in Sikar</Fact>}
                {course.fee && <Fact label="Fee">{course.fee}</Fact>}
              </dl>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9">
            <div className="border-t border-navy-deep/15 pt-10 lg:border-t-0 lg:pt-0">
              <Block title="About this course">
                <p className="max-w-3xl text-[17px] leading-[1.85] text-ink/80">{course.description}</p>
                {course.image && (
                  <img src={course.image} alt={course.title} className="mt-8 h-[300px] w-full rounded-2xl object-cover sm:h-[380px]" />
                )}
              </Block>

              {course.syllabus?.length > 0 && (
                <Block title="What you study">
                  <List items={course.syllabus} columns />
                </Block>
              )}

              {course.highlights?.length > 0 && (
                <Block title="What you get">
                  <List items={course.highlights} />
                </Block>
              )}
            </div>
          </div>
        </div>

        {/* Other courses */}
        {others.length > 0 && (
          <section className="grid gap-6 border-t border-navy-deep/15 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
            <h2 className="font-serif text-3xl font-semibold text-navy-deep lg:col-span-3">Other courses</h2>
            <ul className="border-t border-navy-deep/15 lg:col-span-9">
              {others.map((c) => (
                <li key={c.id} className="border-b border-navy-deep/15">
                  <Link
                    href={`/courses/${c.slug || c.id}`}
                    className={`group flex items-center justify-between gap-4 px-2 py-5 transition-colors hover:bg-white sm:px-4 ${focusRing}`}
                  >
                    <span>
                      <span className="block font-serif text-xl font-semibold text-navy-deep sm:text-2xl">{c.title}</span>
                      {c.duration && <span className="mt-1 block text-sm text-ink/60">{c.duration}</span>}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy-deep/25 text-navy-deep transition-colors group-hover:border-gold group-hover:bg-gold-light">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Closing call to action */}
        <section className="grid items-center gap-8 border-t border-navy-deep/15 py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">Ready to start {course.title}?</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
              Send your details through the admission form, or call us and we will guide you through the next steps.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link href={enrol} className={`rounded-full bg-navy-deep px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}>
              Enrol in this course
            </Link>
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, '')}`} className={`rounded-full border border-navy-deep/25 px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}>
                Call {phone}
              </a>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
