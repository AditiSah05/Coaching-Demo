"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Anchor, Compass, Award, Users, BookOpen, ShieldCheck, ArrowRight, CheckCircle2, Star, Phone, Download, ChevronDown, ChevronUp, Sparkles, Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AvatarInitials } from '../components/common/ImageWithFallback';
import { VideoBackground } from '../components/common/VideoBackground';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const Home = () => {
  const { settings, courses, testimonials, faqs } = useData();
  const [openFaq, setOpenFaq] = useState(0);

  // Hero Headline Word Reveal
  const heroWords = (settings?.heroHeading || "Steer Your Future Towards High Seas Glory").split(" ");

  return (
    <div className="overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-navy-deep text-ivory pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">

        <VideoBackground />

        {/* Floating Rotating Ship Wheel Motif */}
        <div className="absolute right-[-80px] top-[10%] opacity-10 text-sea-blue pointer-events-none">
          <Compass className="w-[450px] h-[450px] animate-spin-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Word-by-word Animated Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white tracking-tight">
                {heroWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className={['merchant','navy'].includes(word.toLowerCase()) ? 'text-gold' : ''}
                  >
                    {word}{' '}
                  </motion.span>
                ))}
              </h1>

              <p className="text-sm sm:text-base text-ivory/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {settings?.heroSubheading}
              </p>

              {/* Hero Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/admission"
                  className="w-full sm:w-auto bg-terracotta hover:bg-terracotta-hover text-navy-deep font-bold px-8 py-4 rounded-2xl shadow-terracotta flex items-center justify-center gap-3 transition-transform active:scale-95 text-sm uppercase tracking-wider"
                >
                  <Anchor className="w-5 h-5" />
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/study-materials"
                  className="w-full sm:w-auto border-2 border-sea-blue/70 hover:bg-sea-blue/10 text-ivory font-bold px-7 py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm"
                >
                  <Download className="w-5 h-5" />
                  <span>Free Study Materials</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-sea-blue/20 grid grid-cols-3 gap-4 text-center lg:text-left">
                {[
                  { Icon: Users, value: '354', label: 'Google Reviews', color: 'text-gold' },
                  { Icon: GraduationCap, value: 'AIR 33', label: 'IMU CET 2026', color: 'text-sea-blue' },
                  { Icon: MapPin, value: 'Sikar', label: 'Offline Campus', color: 'text-gold' },
                ].map(({ Icon, value, label, color }, i) => (
                  <div key={label} className={i > 0 ? 'lg:border-l lg:border-sea-blue/20 lg:pl-5' : ''}>
                    <span className={`text-xl sm:text-2xl font-serif font-bold ${color} flex items-center justify-center lg:justify-start gap-2`}>
                      <Icon className="w-5 h-5" /> {value}
                    </span>
                    <span className="text-[11px] text-ivory/70 uppercase font-semibold">{label}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Hero Right Image & Badge Stack */}
            <div className="lg:col-span-5 relative">
              
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Arch-masked Hero Image */}
                <div className="arch-image-lg overflow-hidden border-4 border-gold shadow-2xl bg-navy-dark">
                  <img
                    src="/images/about-academy-image-01.png"
                    alt="Pacific Marine Academy cadets"
                    className="w-full aspect-[4/5] object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Drifting Wave Bottom SVG */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#F8F5ED" />
        </div>
      </section>

      {/* --- WELCOME --- */}
      <section className="py-16 bg-ivory text-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="badge-solid bg-terracotta/10 text-goldtext">Welcome to</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-deep">
            Pacific Marine Academy – Your Gateway to the Merchant Navy
          </h2>
          <p className="text-sm text-ink/70 leading-relaxed">
            At Pacific Marine Academy, we help aspiring cadets achieve their dream of joining the Merchant Navy with confidence. As one of the best IMU-CET coaching institutes in India, we offer a structured curriculum, expert faculty guidance, and personal mentorship to prepare you for IMU-CET, DNS sponsorship exams, and Merchant Navy interviews.
          </p>
          <p className="text-sm text-ink/70 leading-relaxed">
            With our result-oriented approach, modern classrooms, and consistent record of high selection and sponsorship success rates, we ensure you are fully prepared to start your maritime career. Join the hundreds of successful students who trusted Pacific Marine Academy to launch their future at sea.
          </p>
        </div>
      </section>

      {/* --- WHY CHOOSE US (Italian Tile Cards) --- */}
      <section className="py-20 bg-ivory text-ink relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-solid bg-terracotta/10 text-goldtext mb-3">
              <Compass className="w-3.5 h-3.5" /> Perché Scegliere Noi
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-deep tracking-tight mb-4">
              Why choose Pacific Marine Academy?
            </h2>
            <p className="text-sm text-ink/70 leading-relaxed">
              Expert faculty, structured study materials and regular mock tests to prepare you for IMU-CET, DNS courses and sponsorship interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { Icon: Award, color: 'bg-terracotta text-white', title: "India's Best IMU-CET Coaching", text: "Known for producing top IMU-CET rankers and sponsored candidates every year." },
              { Icon: Anchor, color: 'bg-sea-blue text-navy-deep', title: "Expert & Experienced Faculty", text: "Learn from Merchant Navy professionals and subject experts who guide you step by step." },
              { Icon: Compass, color: 'bg-gold text-navy-deep', title: "Years of Maritime Coaching Experience", text: "Covers IMU-CET syllabus, DNS Sponsorship, Interview Training & Personality Development." },
              { Icon: BookOpen, color: 'bg-navy-deep text-gold', title: "Structured Curriculum & Complete Preparation", text: "Well-planned study schedule covering IMU-CET syllabus, DNS Sponsorship, Interview Training & Personality Development." },
            ].map(({ Icon, color, title, text }) => (
              <div key={title} className="bg-white p-8 rounded-3xl border-2 border-navy-deep/10 shadow-chunky hover:-translate-y-2 transition-transform duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-deep mb-3">{title}</h3>
                <p className="text-xs text-ink/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- COURSES PREVIEW SECTION --- */}
      <section className="py-20 bg-navy-deep text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="badge-solid bg-sea-blue/20 text-sea-blue mb-2">
                Programmi Formativi
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Our Courses
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-gold font-bold text-sm hover:underline"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-navy-light/50 rounded-3xl p-6 border border-sea-blue/20 flex flex-col justify-between hover:border-gold transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {course.badge && (
                      <span className="bg-terracotta text-navy-deep text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {course.badge}
                      </span>
                    )}
                    <span className="text-xs font-bold text-gold">{course.duration}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-xs text-ivory/70 line-clamp-3 mb-4 leading-relaxed">{course.description}</p>
                  
                  <div className="space-y-1.5 text-xs text-sea-blue mb-6">
                    <p>✓ Target: {course.targetExam}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-sea-blue/20 flex items-center justify-between gap-3">
                  <Link
                    href={`/courses/${course.slug || course.id}`}
                    className="text-gold text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/admission?course=${encodeURIComponent(course.title)}`}
                    className="bg-sea-blue hover:bg-sea-dark text-navy-deep text-xs font-bold px-4 py-2.5 rounded-xl transition-transform active:scale-95"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- OUR TEAM --- */}
      <section className="py-20 bg-ivory text-ink">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge-solid bg-gold/20 text-ink mb-2">Our Team</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-deep">Meet The Founders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { img: '/images/home-image-11.jpg', name: 'Capt. Shubkaran Choudhary', role: 'Co-Founder of Pacific Marine Academy' },
              { img: '/images/home-image-12.webp', name: 'Mahipal Singh Jhuriya', role: '2nd Engineer • Founder of Pacific Marine Academy' },
            ].map((m) => (
              <div key={m.name} className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden">
                <img src={m.img} alt={m.name} className="w-full aspect-[4/5] object-cover object-top" />
                <div className="p-6 text-center">
                  <h3 className="font-serif text-xl font-bold text-navy-deep">{m.name}</h3>
                  <p className="text-xs text-goldtext font-semibold mt-1">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SPONSORED CADETS & AWARDS --- */}
      <section className="py-20 bg-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div>
            <div className="text-center mb-10">
              <span className="badge-solid bg-sea-blue/20 text-sea-blue mb-2">Sponsored</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Our Sponsored Cadets</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[16, 15, 14, 13, 12, 11, 10, 9, 8].map((n) => (
                <img key={n} src={`/images/pacifc-sporands-photos-24-${n}.jpeg`} alt="Pacific Marine Academy sponsored cadet" loading="lazy" className="w-full aspect-square object-cover rounded-2xl border border-sea-blue/20" />
              ))}
            </div>
          </div>
          <div>
            <div className="text-center mb-10">
              <span className="badge-solid bg-gold/20 text-gold mb-2">Recognition</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">All Winning Awards</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[13, 14, 15].map((n) => (
                <img key={n} src={`/images/home-image-${n}.jpeg`} alt="Pacific Marine Academy award" loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl border border-gold/30" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 5-STEP ADMISSION PROCESS JOURNEY --- */}
      <section className="py-20 bg-ivory text-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-solid bg-gold/20 text-ink mb-2">Il Tuo Percorso</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-deep">
              5 Steps To Join The Merchant Navy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: "01", title: "Free Counselling", desc: "Speak with Master Mariners & evaluate eligibility (Age, PCM %, Vision)." },
              { step: "02", title: "Submit Application", desc: "Fill online admission form and upload academic marksheets." },
              { step: "03", title: "Entrance Prep", desc: "Join classroom/online batch for IMU-CET & Company Sponsorship." },
              { step: "04", title: "Sponsorship & CET", desc: "Crack All-India entrance exam & secure shipping company sponsorship." },
              { step: "05", title: "Pre-Sea & Placement", desc: "Join DG Approved academy & sail on international merchant ships!" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 relative text-center shadow-chunky">
                <span className="w-10 h-10 rounded-full bg-navy-deep text-gold font-serif font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </span>
                <h3 className="font-serif text-base font-bold text-navy-deep mb-2">{item.title}</h3>
                <p className="text-xs text-ink/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- TESTIMONIALS SLIDER --- */}
      <section className="py-20 bg-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-solid bg-gold/20 text-gold mb-2">Excellent • Based on 354 Google reviews</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Student's Feedback
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-navy-light/40 p-8 rounded-3xl border border-sea-blue/20 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-gold mb-4">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-ivory/80 italic leading-relaxed mb-6">"{item.text}"</p>
                </div>

                <div className="pt-4 border-t border-sea-blue/20 flex items-center gap-3">
                  <AvatarInitials initials={item.name.substring(0, 2)} color="bg-terracotta" size="w-10 h-10 text-xs" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">{item.name}</h4>
                    <span className="text-[10px] text-sea-blue block">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- FREE STUDY MATERIAL TEASER --- */}
      <section className="py-16 bg-ivory text-ink border-t border-b border-navy-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-sea-blue/30 shadow-chunky flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="badge-solid bg-seagreen/20 text-seagreen">Materiale Gratuito</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-deep">
                Download Free IMU-CET Study Materials
              </h2>
              <p className="text-xs text-ink/70 max-w-xl">
                Sunday mock test, IMUCET 2024 paper, syllabus, seas/rivers/straits, countries/capitals/currencies, ports and shipping, and DNS/BSC/B.Tech notes.
              </p>
            </div>
            <Link
              href="/study-materials"
              className="bg-terracotta hover:bg-terracotta-hover text-navy-deep font-bold px-8 py-4 rounded-2xl shadow-terracotta shrink-0 flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <Download className="w-4 h-4" />
              <span>Access Study Hub</span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FAQ ACCORDION --- */}
      <section className="py-20 bg-ivory text-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="badge-solid bg-navy-deep/10 text-navy-deep mb-2">Domande Frequenti</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-deep">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.id} className="bg-white rounded-2xl border border-navy-deep/10 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 font-serif text-sm sm:text-base font-bold text-navy-deep flex items-center justify-between gap-4"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-goldtext shrink-0" /> : <ChevronDown className="w-5 h-5 text-sea-blue shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-ink/80 leading-relaxed border-t border-navy-deep/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- FINAL CTA BANNER --- */}
      <section className="py-20 bg-navy-deep text-white text-center relative overflow-hidden bg-maritime-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-terracotta/20 text-goldtext mx-auto flex items-center justify-center border-2 border-terracotta">
            <Anchor className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Ready To Set Sail On Your Merchant Navy Career?
          </h2>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Register for the course you are interested in, or call us today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/admission"
              className="bg-gold hover:bg-gold-hover text-ink font-bold px-8 py-4 rounded-2xl shadow-lg text-xs uppercase tracking-wider"
            >
              Fill Online Admission Form
            </Link>
            <a
              href={`tel:${settings?.phonePrimary}`}
              className="bg-navy-light text-white font-bold px-7 py-4 rounded-2xl border border-sea-blue/40 text-xs flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>Call Helpline: {settings?.phonePrimary}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
