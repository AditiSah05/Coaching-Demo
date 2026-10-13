"use client";

import React from 'react';
import Link from "next/link";
import { Clock, BookOpen, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { NotFound } from './NotFound';

export const CourseDetail = ({ slug }) => {
  const { courses } = useData();
  const course = courses.find((c) => c.slug === slug || c.id === slug);
  if (!course) return <NotFound />;

  return (
    <div className="bg-ivory text-ink min-h-screen">
      <section className="bg-navy-deep text-ivory py-14 bg-maritime-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="text-xs font-bold text-sea-blue hover:text-gold inline-flex items-center gap-1 mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> All Courses
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {course.badge && <span className="bg-terracotta text-navy-deep text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{course.badge}</span>}
            <span className="bg-sea-blue/20 text-sea-blue text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{course.category}</span>
            {course.duration && <span className="text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> {course.duration}</span>}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">{course.title}</h1>
          <p className="text-sm text-ivory/80 mt-2">Best coaching in Sikar, Rajasthan • Pacific Marine Academy</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {course.image && (
              <img src={course.image} alt={course.title} className="w-full rounded-3xl border-2 border-navy-deep/10 shadow-chunky object-cover max-h-80" />
            )}
            <p className="text-sm text-ink/80 leading-relaxed">{course.description}</p>

            {course.syllabus?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-navy-deep mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-goldtext" /> What You Study</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {course.syllabus.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-navy-deep/10">
                      <CheckCircle2 className="w-4 h-4 text-sea-blue shrink-0 mt-0.5" /><span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.highlights?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-navy-deep mb-3">How We Prepare You</h2>
                <ul className="space-y-2 text-xs">
                  {course.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-seagreen shrink-0 mt-0.5" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-navy-deep text-white p-6 rounded-2xl space-y-5 lg:sticky lg:top-28">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sea-blue font-bold block mb-1">Eligibility</span>
                <span className="text-xs text-ivory/90">{course.eligibility}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sea-blue font-bold block mb-1">Target Exam / Goal</span>
                <span className="text-xs text-gold font-semibold">{course.targetExam}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sea-blue font-bold block mb-1">Course Fee</span>
                <span className="text-xs text-ivory/90">{course.fee}</span>
              </div>
              <Link
                href={`/admission?course=${encodeURIComponent(course.title)}`}
                className="w-full bg-terracotta hover:bg-terracotta-hover text-navy-deep font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <span>Register Now</span><ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
