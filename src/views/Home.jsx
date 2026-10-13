"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Anchor, Compass, Award, Users, BookOpen, ShieldCheck, ArrowRight, CheckCircle2, Star, Phone, Download, ChevronDown, ChevronUp, Sparkles, Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AvatarInitials } from '../components/common/ImageWithFallback';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { SponsoredCadets } from '../components/home/SponsoredCadets';
import { CoursesShowcase } from '../components/home/CoursesShowcase';
import { StatsBand } from '../components/home/StatsBand';
import { HeroPhoto } from '../components/common/HeroPhoto';
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
      <section className="relative bg-navy-deep text-ivory pt-28 pb-32 lg:pt-24 lg:pb-44 lg:min-h-[100svh] lg:flex lg:items-center overflow-hidden">

        <VideoBackground />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 text-center lg:text-left">

              {/* Word-by-word Animated Headline */}
              <h1 className="max-w-[16ch] mx-auto lg:mx-0 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-semibold leading-[1.08] text-white tracking-tight">
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

              <p className="mt-7 max-w-xl mx-auto lg:mx-0 text-base leading-[1.8] text-white/75">
                {settings?.heroSubheading}
              </p>

              {/* Hero Action CTAs */}
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/admission"
                  className="w-full sm:w-auto bg-terracotta text-navy-deep font-bold px-8 py-4 rounded-2xl hover:shadow-[0_14px_30px_-6px_rgba(191,168,136,0.6)] active:shadow-[0_14px_30px_-6px_rgba(191,168,136,0.6)] flex items-center justify-center gap-3 transition-shadow duration-300 text-sm uppercase tracking-wider"
                >
                  <Anchor className="w-5 h-5" />
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/study-materials"
                  className="w-full sm:w-auto border border-white/30 hover:border-gold hover:text-gold text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-colors text-sm"
                >
                  <Download className="w-5 h-5" />
                  <span>Free Study Materials</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 max-w-xl mx-auto lg:mx-0 pt-8 border-t border-white/15 grid grid-cols-3 text-center lg:text-left">
                {[
                  { Icon: Users, value: '354', label: 'Google Reviews' },
                  { Icon: GraduationCap, value: 'AIR 33', label: 'IMU CET 2026' },
                  { Icon: MapPin, value: 'Sikar', label: 'Offline Campus' },
                ].map(({ Icon, value, label }, i) => (
                  <div key={label} className={i > 0 ? 'border-l border-white/15 pl-4 sm:pl-6' : 'pr-4 sm:pr-6'}>
                    <Icon className="w-5 h-5 text-gold/80 mx-auto lg:mx-0 mb-2" />
                    <span className="block font-serif text-2xl sm:text-3xl font-bold text-gold leading-none">{value}</span>
                    <span className="mt-2 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">{label}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Hero Right: photo cut to a prow-and-wave shape (shallow corner cut so faces stay in frame) */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <HeroPhoto />
            </div>

          </div>
        </div>

        {/* Announcement + wave sit on the hero video */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <AnnouncementBar />
          <ScallopedBorder fillColor="#F4F2ED" />
        </div>
      </section>

      {/* --- WELCOME --- */}
      <section className="py-20 bg-ivory text-ink">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge-solid bg-terracotta/10 text-goldtext !text-sm !px-7 !py-2.5 !tracking-[0.25em]">Welcome to</span>
          <h2 className="mt-7 font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-navy-deep tracking-tight">
            Pacific Marine Academy – Your Gateway to the <span className="text-goldtext">Merchant Navy</span>
          </h2>
          <span className="mx-auto mt-8 block h-px w-16 bg-gold" aria-hidden="true" />
          <div className="mt-8 space-y-4">
            <p className="text-base sm:text-lg text-ink/70 leading-relaxed">
              At Pacific Marine Academy, we help aspiring cadets achieve their dream of joining the Merchant Navy with confidence. As one of the best IMU-CET coaching institutes in India, we offer a structured curriculum, expert faculty guidance, and personal mentorship to prepare you for IMU-CET, DNS sponsorship exams, and Merchant Navy interviews.
            </p>
            <p className="text-base sm:text-lg text-ink/70 leading-relaxed">
              With our result-oriented approach, modern classrooms, and consistent record of high selection and sponsorship success rates, we ensure you are fully prepared to start your maritime career. Join the hundreds of successful students who trusted Pacific Marine Academy to launch their future at sea.
            </p>
          </div>
        </div>
      </section>

      <StatsBand />

      {/* --- WHY CHOOSE US --- */}
      <section className="py-24 bg-ivory text-ink relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">

          {/* Intro: sticks while the cards scroll on desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 text-center lg:text-left">
            <span className="badge-solid text-goldtext mb-6 !text-sm !px-6 !py-2 !tracking-[0.25em]">
              <Compass className="w-4 h-4" /> Why Us
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-bold text-navy-deep tracking-tight">
              Why choose <span className="text-goldtext">Pacific Marine</span> Academy?
            </h2>
            <span className="mt-8 mb-6 block h-px w-16 bg-gold mx-auto lg:mx-0" aria-hidden="true" />
            <p className="text-base sm:text-lg text-ink/70 leading-relaxed max-w-md mx-auto lg:mx-0">
              Expert faculty, structured study materials and regular mock tests to prepare you for IMU-CET, DNS courses and sponsorship interviews.
            </p>
            <Link
              href="/admission"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-navy-deep px-8 py-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy-light"
            >
              Start Your Journey <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>

          {/* Numbered feature cards, second column dropped for a staggered rhythm */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { Icon: Award, title: "India's Best IMU-CET Coaching", text: "Known for producing top IMU-CET rankers and sponsored candidates every year." },
              { Icon: Anchor, title: "Expert & Experienced Faculty", text: "Learn from Merchant Navy professionals and subject experts who guide you step by step." },
              { Icon: Compass, title: "Years of Maritime Coaching Experience", text: "Covers IMU-CET syllabus, DNS Sponsorship, Interview Training & Personality Development." },
              { Icon: BookOpen, title: "Structured Curriculum & Complete Preparation", text: "Well-planned study schedule covering IMU-CET syllabus, DNS Sponsorship, Interview Training & Personality Development." },
            ].map(({ Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.12 }}
                className={`group relative overflow-hidden rounded-3xl border border-navy-deep/10 bg-white p-8 shadow-chunky transition-colors duration-300 hover:border-gold hover:bg-gold-light hover:shadow-chunky-lg ${i % 2 === 1 ? 'sm:mt-10' : ''}`}
              >
                <span className="absolute right-6 top-4 select-none font-serif text-6xl font-bold leading-none text-gold/35 transition-colors duration-300 group-hover:text-gold/70">
                  0{i + 1}
                </span>
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-goldtext ring-1 ring-gold/40 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 pr-6 font-serif text-xl font-bold leading-snug text-navy-deep">{title}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{text}</p>
                <span className="mt-6 block h-0.5 w-10 rounded-full bg-gold transition-all duration-300 group-hover:w-20" />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <CoursesShowcase courses={courses} />

      {/* --- OUR TEAM --- */}
      <section className="relative py-16 bg-ivory text-ink overflow-hidden">
        {/* Nautical chart backdrop: faint grid + compass rose */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(191,168,136,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(191,168,136,0.16)_1px,transparent_1px)] bg-[size:56px_56px]"
          style={{ maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)' }}
          aria-hidden="true"
        />
        <svg viewBox="0 0 200 200" className="pointer-events-none absolute left-1/2 top-[58%] w-[52rem] max-w-none -translate-x-1/2 -translate-y-1/2" fill="none" stroke="#BFA888" strokeOpacity="0.3" strokeWidth="0.6" aria-hidden="true">
          <circle cx="100" cy="100" r="96" /><circle cx="100" cy="100" r="82" strokeDasharray="1.5 3" /><circle cx="100" cy="100" r="62" />
          <path d="M100,4 L111,89 L196,100 L111,111 L100,196 L89,111 L4,100 L89,89 Z" />
          <path d="M100,4 L111,89 L196,100 L111,111 L100,196 L89,111 L4,100 L89,89 Z" transform="rotate(45 100 100) scale(0.62) translate(61.3 61.3)" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-bold text-navy-deep tracking-tight">
              Meet The <span className="text-goldtext">Founders</span>
            </h2>
            <span className="mx-auto mt-5 block h-px w-16 bg-gold" aria-hidden="true" />
          </div>

          <div className="relative">
            {/* Charted course between the two portholes */}
            <div className="pointer-events-none absolute left-1/2 z-0 hidden h-16 w-[26%] -translate-x-1/2 sm:block sm:top-[8rem] lg:top-[11.5rem]" aria-hidden="true">
              <svg viewBox="0 0 200 60" className="h-full w-full" fill="none" stroke="#BFA888" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7">
                <path d="M0,38 C40,0 80,60 100,30 S160,6 200,26" />
              </svg>
              <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-white text-goldtext shadow-chunky">
                <Anchor className="h-5 w-5" />
              </span>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 justify-items-center items-start">
              {[
                { img: '/images/home-image-11-hd.jpg', pos: '50% 6%', zoom: 1, filter: 'saturate(0.75)', name: 'Capt. Shubkaran Choudhary', tag: 'Co-Founder', line: 'Pacific Marine Academy' },
                { img: '/images/home-image-12.webp', pos: '48% 4%', zoom: 1.2, filter: 'none', name: 'Mahipal Singh Jhuriya', tag: 'Founder', line: '2nd Engineer • Pacific Marine Academy' },
              ].map((m) => (
                <div key={m.name} className="group flex w-full max-w-lg flex-col items-center">
                  <div className="relative aspect-square w-72 sm:w-80 lg:w-[27rem] drop-shadow-[0_18px_18px_rgba(2,21,39,0.35)]">
                    {/* rope: strands shaded so each twist reads as rounded */}
                    <div
                      className="absolute inset-0 rounded-full transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{
                        background: 'repeating-conic-gradient(from 3deg, #EADBBB 0deg, #BBA172 2.5deg, #6F5C3B 5deg, #BBA172 7.5deg, #EADBBB 10deg)',
                        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.55), inset 0 2px 3px rgba(255,255,255,0.4)',
                      }}
                    >
                      {/* machined brass flange: brushed-metal sheen + bevel */}
                      <div
                        className="absolute inset-[4.5%] rounded-full p-[5%]"
                        style={{
                          background: 'conic-gradient(from 200deg, #6E5A38, #E6D2A4, #FBF3DC, #B89C6C, #6A5636, #CFB586, #F6EACB, #8C7449, #6E5A38)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.5), inset 0 3px 4px rgba(255,255,255,0.7), inset 0 -4px 6px rgba(0,0,0,0.5)',
                        }}
                      >
                        {/* dark rubber gasket */}
                        <div
                          className="h-full w-full rounded-full p-[2%]"
                          style={{
                            background: 'linear-gradient(145deg, #3a342b, #14110d)',
                            boxShadow: 'inset 0 3px 5px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.5)',
                          }}
                        >
                          {/* glass */}
                          <div className="relative h-full w-full overflow-hidden rounded-full bg-gold-light">
                            <img
                              src={m.img}
                              alt={m.name}
                              className="absolute inset-0 h-full w-full object-cover"
                              style={{ objectPosition: m.pos, filter: m.filter, transform: `scale(${m.zoom})`, transformOrigin: '50% 12%' }}
                            />
                            <div className="absolute inset-0 bg-[rgba(190,215,235,0.07)]" />
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.38)_0%,rgba(255,255,255,0.08)_28%,transparent_42%)]" />
                            <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 34px rgba(0,0,0,0.55), inset 0 0 3px rgba(0,0,0,0.9)' }} />
                            <div className="absolute left-[16%] top-[9%] h-[14%] w-[34%] -rotate-[28deg] rounded-full bg-white/25 blur-[3px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* hex bolt heads on the flange, each with its own highlight and shadow */}
                    {[...Array(12)].map((_, k) => {
                      const ang = (k / 12) * Math.PI * 2 - Math.PI / 2;
                      return (
                        <span
                          key={k}
                          className="absolute h-[3.4%] w-[3.4%] min-h-2 min-w-2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1.5px_1.2px_rgba(0,0,0,0.65)]"
                          style={{ left: `${(50 + 43.2 * Math.cos(ang)).toFixed(2)}%`, top: `${(50 + 43.2 * Math.sin(ang)).toFixed(2)}%` }}
                          aria-hidden="true"
                        >
                          <span
                            className="block h-full w-full"
                            style={{
                              clipPath: 'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%)',
                              background: 'radial-gradient(circle at 32% 28%, #FFF8E0 0%, #CDB283 38%, #6A5636 100%)',
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>

                  {/* engraved brass plate with four screws */}
                  <div
                    className="relative -mt-3 flex min-h-[8.25rem] w-full max-w-md flex-col justify-center rounded-lg px-10 py-5 text-center transition-transform duration-300 group-hover:-translate-y-1"
                    style={{
                      background: 'linear-gradient(170deg, #F4E8C8 0%, #CDB384 38%, #E9D8AE 62%, #B89C6C 100%)',
                      boxShadow: '0 8px 16px rgba(2,21,39,0.35), inset 0 2px 2px rgba(255,255,255,0.75), inset 0 -2px 3px rgba(0,0,0,0.35), 0 0 0 1px #8F7A58',
                    }}
                  >
                    {['left-3 top-3', 'right-3 top-3', 'left-3 bottom-3', 'right-3 bottom-3'].map((pos) => (
                      <span
                        key={pos}
                        className={`absolute ${pos} h-2.5 w-2.5 rounded-full`}
                        style={{ background: 'radial-gradient(circle at 30% 28%, #FFF6DA, #9C845A 60%, #5C4A2C)', boxShadow: '0 1px 1px rgba(0,0,0,0.5)' }}
                        aria-hidden="true"
                      >
                        <span className="absolute left-1/2 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/55" />
                      </span>
                    ))}
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: '#5A4524', textShadow: '0 1px 0 rgba(255,255,255,0.55)' }}>{m.tag}</p>
                    <h3 className="mt-1.5 font-serif text-xl font-bold leading-snug sm:whitespace-nowrap" style={{ color: '#2A2112', textShadow: '0 1px 0 rgba(255,255,255,0.55)' }}>{m.name}</h3>
                    <p className="mt-1.5 text-xs font-semibold" style={{ color: '#4A3A1E', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>{m.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SponsoredCadets />

      {/* --- 5-STEP ADMISSION PROCESS JOURNEY --- */}
      <section className="py-20 bg-ivory text-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-solid bg-gold/20 text-ink mb-2">Your Path</span>
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
              <div key={idx} className="bg-white p-6 rounded-3xl border border-navy-deep/10 relative text-center shadow-chunky">
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
      <section className="py-20 bg-white text-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-solid text-goldtext mb-2">Excellent • Based on 354 Google reviews</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-deep">
              Student's Feedback
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-ivory p-8 rounded-3xl border border-navy-light/10 shadow-chunky relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-gold mb-4">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-ink/75 italic leading-relaxed mb-6">"{item.text}"</p>
                </div>

                <div className="pt-4 border-t border-navy-light/10 flex items-center gap-3">
                  <AvatarInitials initials={item.name.substring(0, 2)} color="bg-terracotta" size="w-10 h-10 text-xs" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-navy-deep">{item.name}</h4>
                    <span className="text-[10px] text-goldtext block">{item.role}</span>
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
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sea-blue/30 shadow-chunky flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="badge-solid bg-seagreen/20 text-seagreen">Free Material</span>
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
            <span className="badge-solid bg-navy-deep/10 text-navy-deep mb-2">FAQ</span>
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
      <section className="py-20 bg-ivory-dark text-ink text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-white text-goldtext mx-auto flex items-center justify-center border border-gold shadow-chunky">
            <Anchor className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-navy-deep">
            Ready To Set Sail On Your Merchant Navy Career?
          </h2>
          <p className="text-base text-ink/70 max-w-2xl mx-auto leading-relaxed">
            Register for the course you are interested in, or call us today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/admission"
              className="bg-navy-deep hover:bg-navy-light text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-colors text-xs uppercase tracking-wider"
            >
              Fill Online Admission Form
            </Link>
            <a
              href={`tel:${settings?.phonePrimary}`}
              className="bg-white text-navy-deep hover:border-gold font-bold px-7 py-4 rounded-2xl border border-navy-light/20 text-xs flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-goldtext" />
              <span>Call Helpline: {settings?.phonePrimary}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
