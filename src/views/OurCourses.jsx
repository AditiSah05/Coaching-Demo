"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Anchor, Clock, BookOpen, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Filter, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const OurCourses = () => {
  const { courses } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openSyllabus, setOpenSyllabus] = useState({});

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const toggleAccordion = (id) => {
    setOpenSyllabus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-ivory text-ink min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-deep text-ivory py-16 relative bg-maritime-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-solid bg-gold/20 text-gold mb-3">Offerta Formativa</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Merchant Navy Entrance Courses
          </h1>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Rigorous coaching programs engineered by Master Mariners for IMU-CET, DNS, G.P. Rating, and Shipping Sponsorships.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#F8F5ED" />
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="py-8 bg-white border-b border-navy-deep/10 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-goldtext flex items-center gap-1 shrink-0 mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy-deep text-gold shadow-md scale-105'
                    : 'bg-ivory text-ink/70 hover:bg-sea-blue/10 hover:text-navy-deep'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Course List Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-8">
            {filteredCourses.map((course) => {
              const isAccordionOpen = !!openSyllabus[course.id];
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden transition-all hover:border-sea-blue"
                >
                  <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Course Details Main */}
                    <div className="lg:col-span-8 space-y-4">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {course.badge && (
                          <span className="bg-terracotta text-navy-deep text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {course.badge}
                          </span>
                        )}
                        <span className="bg-sea-blue/20 text-navy-deep text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {course.category}
                        </span>
                        {course.duration && (
                          <span className="text-xs font-bold text-ink/70 flex items-center gap-1 ml-auto">
                            <Clock className="w-3.5 h-3.5 text-gold" /> {course.duration}
                          </span>
                        )}
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-deep">
                        {course.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-ivory p-4 rounded-2xl border border-navy-deep/5">
                        <div>
                          <span className="font-bold text-navy-deep block">Eligibility Criteria:</span>
                          <span className="text-ink/80">{course.eligibility}</span>
                        </div>
                        <div>
                          <span className="font-bold text-navy-deep block">Target Exam / Goal:</span>
                          <span className="text-sea-blue font-semibold">{course.targetExam}</span>
                        </div>
                      </div>

                    </div>

                    {/* Pricing & CTA */}
                    <div className="lg:col-span-4 bg-navy-deep text-white p-6 rounded-2xl flex flex-col justify-between space-y-6">
                      
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-sea-blue font-bold block mb-1">Course Fee</span>
                        <span className="font-serif text-xl font-bold text-gold block">{course.fee}</span>
                      </div>

                      <div className="space-y-2">
                        <Link
                          href={`/courses/${course.slug || course.id}`}
                          className="w-full bg-navy-light text-white hover:text-gold font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                          <span>View Details</span>
                        </Link>
                        <Link
                          href={`/admission?course=${encodeURIComponent(course.title)}`}
                          className="w-full bg-terracotta hover:bg-terracotta-hover text-navy-deep font-bold py-3 px-4 rounded-xl shadow-terracotta flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-transform active:scale-95"
                        >
                          <span>Enrol In This Batch</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => toggleAccordion(course.id)}
                          className="w-full bg-navy-light text-sea-blue hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>{isAccordionOpen ? 'Hide Full Syllabus' : 'View Detailed Syllabus'}</span>
                          {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* Syllabus Accordion Drawer */}
                  {isAccordionOpen && (
                    <div className="bg-navy-dark text-white p-6 border-t border-sea-blue/20">
                      <h4 className="font-serif text-sm font-bold text-gold mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-goldtext" /> Detailed Module Syllabus:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-ivory/80">
                        {(course.syllabus || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-navy-light/40 p-2.5 rounded-xl border border-sea-blue/10">
                            <CheckCircle2 className="w-4 h-4 text-sea-blue shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};
