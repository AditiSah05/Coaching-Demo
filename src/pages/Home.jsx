import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor, Compass, Award, Users, BookOpen, ShieldCheck, ArrowRight, CheckCircle2, Star, Phone, Download, ChevronDown, ChevronUp, Sparkles, Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCounter } from '../hooks/useCounter';
import { ImageWithFallback, AvatarInitials } from '../components/common/ImageWithFallback';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const Home = () => {
  const { settings, courses, toppers, testimonials, faqs, studyMaterials } = useData();
  const [openFaq, setOpenFaq] = useState(0);

  // Counter Triggers
  const statsReveal = useScrollReveal();
  const countTrained = useCounter(settings?.stats?.studentsTrained || 5400, 2000, statsReveal.isInView);
  const countSelections = useCounter(settings?.stats?.selections || 5120, 2000, statsReveal.isInView);
  const countYears = useCounter(settings?.stats?.yearsExperience || 16, 1500, statsReveal.isInView);
  const countSponsors = useCounter(settings?.stats?.partnerSponsors || 34, 1500, statsReveal.isInView);

  // Hero Headline Word Reveal
  const heroWords = (settings?.heroHeading || "Steer Your Future Towards High Seas Glory").split(" ");

  return (
    <div className="overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-navy-deep text-ivory pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden bg-maritime-pattern">
        
        {/* Floating Rotating Ship Wheel Motif */}
        <div className="absolute right-[-80px] top-[10%] opacity-10 text-sea-blue pointer-events-none">
          <Compass className="w-[450px] h-[450px] animate-spin-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-navy-light/80 border border-sea-blue/40 px-4 py-2 rounded-full text-xs font-bold text-gold uppercase tracking-widest shadow-inner"
              >
                <Award className="w-4 h-4 text-terracotta" />
                <span>#1 Merchant Navy Coaching Institute In India</span>
              </motion.div>

              {/* Word-by-word Animated Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white tracking-tight">
                {heroWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className={word.toLowerCase().includes('seas') || word.toLowerCase().includes('future') ? 'text-sea-blue italic' : ''}
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
                  to="/admission"
                  className="w-full sm:w-auto bg-terracotta hover:bg-terracotta-hover text-white font-bold px-8 py-4 rounded-2xl shadow-terracotta flex items-center justify-center gap-3 transition-transform active:scale-95 text-sm uppercase tracking-wider"
                >
                  <Anchor className="w-5 h-5" />
                  <span>Apply For 2026 Batch</span>
                </Link>

                <Link
                  to="/study-materials"
                  className="w-full sm:w-auto bg-sea-blue hover:bg-sea-dark text-navy-deep font-bold px-7 py-4 rounded-2xl shadow-sea flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Free Prospectus</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-sea-blue/20 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-serif font-bold text-gold block">98.4%</span>
                  <span className="text-[11px] text-ivory/70 uppercase font-semibold">Selection Rate</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-serif font-bold text-sea-blue block">DG Approved</span>
                  <span className="text-[11px] text-ivory/70 uppercase font-semibold">Academy Partners</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-serif font-bold text-terracotta block">100%</span>
                  <span className="text-[11px] text-ivory/70 uppercase font-semibold">Placement Support</span>
                </div>
              </div>

            </div>

            {/* Hero Right Image & Badge Stack */}
            <div className="lg:col-span-5 relative">
              
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Arch-masked Hero Image */}
                <div className="arch-image-lg overflow-hidden border-4 border-gold shadow-2xl bg-navy-dark">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
                    alt="Merchant Navy Officer Bridge Training"
                    aspectRatio="aspect-[4/5]"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Italian Ticket Badge 1 */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 bg-ivory text-navy-deep p-4 rounded-2xl shadow-2xl border-2 border-sea-blue hidden sm:flex items-center gap-3 max-w-[220px]"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">
                    <Star className="w-6 h-6 fill-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-navy-deep">AIR 04 Secured</span>
                    <span className="text-[10px] text-ink/70">IMU-CET 2025 All-India Topper</span>
                  </div>
                </motion.div>

                {/* Floating Badge 2 */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-6 bg-terracotta text-white p-4 rounded-2xl shadow-terracotta flex items-center gap-3 border-2 border-white max-w-[220px]"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Anchor className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Next Batch Starting</span>
                    <span className="text-[10px] text-white/90">Seats Filling Fast • Enrol Now</span>
                  </div>
                </motion.div>
              </div>

            </div>

          </div>
        </div>

        {/* Drifting Wave Bottom SVG */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#FBF6EC" />
        </div>
      </section>

      {/* --- TOPPERS & ACHIEVERS MARQUEE TICKER --- */}
      <section className="bg-ivory py-6 border-b border-navy-light/10">
        <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> All-India Toppers & Merchant Navy Selections
          </span>
        </div>
        
        <div className="overflow-hidden whitespace-nowrap flex no-scrollbar bg-navy-deep py-4 text-white">
          <div className="inline-flex animate-[marquee_25s_linear_infinite] gap-8 px-4">
            {toppers.concat(toppers).map((top, idx) => (
              <div key={idx} className="inline-flex items-center gap-3 bg-navy-light/60 px-5 py-2.5 rounded-2xl border border-sea-blue/30 shrink-0">
                <AvatarInitials initials={top.photo} name={top.name} color={top.color} size="w-9 h-9 text-xs" />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-serif font-bold text-white">{top.name}</span>
                    <span className="bg-gold text-ink text-[10px] font-bold px-1.5 py-0.5 rounded">{top.rank}</span>
                  </div>
                  <span className="text-[11px] text-sea-blue font-semibold block">{top.selection}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LIVE STAT COUNTERS SECTION --- */}
      <section ref={statsReveal.ref} className="py-16 bg-navy-deep text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="bg-navy-light/40 border-2 border-sea-blue/30 p-6 rounded-3xl relative overflow-hidden">
              <span className="font-serif text-4xl sm:text-5xl font-extrabold text-gold block mb-1">
                {countTrained.toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-wider text-ivory/80 font-bold block">
                Cadets Trained
              </span>
              <span className="text-[10px] text-sea-blue mt-1 block">Since 2010</span>
            </div>

            <div className="bg-navy-light/40 border-2 border-terracotta/30 p-6 rounded-3xl relative overflow-hidden">
              <span className="font-serif text-4xl sm:text-5xl font-extrabold text-terracotta block mb-1">
                {countSelections.toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-wider text-ivory/80 font-bold block">
                Selections & Sponsorships
              </span>
              <span className="text-[10px] text-gold mt-1 block">98.4% Success Rate</span>
            </div>

            <div className="bg-navy-light/40 border-2 border-sea-blue/30 p-6 rounded-3xl relative overflow-hidden">
              <span className="font-serif text-4xl sm:text-5xl font-extrabold text-sea-blue block mb-1">
                {countYears}+
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-wider text-ivory/80 font-bold block">
                Years of Excellence
              </span>
              <span className="text-[10px] text-ivory/60 mt-1 block">Master Mariner Led</span>
            </div>

            <div className="bg-navy-light/40 border-2 border-gold/30 p-6 rounded-3xl relative overflow-hidden">
              <span className="font-serif text-4xl sm:text-5xl font-extrabold text-gold block mb-1">
                {countSponsors}+
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-wider text-ivory/80 font-bold block">
                Partner Shipping Companies
              </span>
              <span className="text-[10px] text-terracotta mt-1 block">Anglo, Synergy, Fleet & MSC</span>
            </div>

          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US (Italian Tile Cards) --- */}
      <section className="py-20 bg-ivory text-ink relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-solid bg-terracotta/10 text-terracotta mb-3">
              <Compass className="w-3.5 h-3.5" /> Perché Scegliere Noi
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-deep tracking-tight mb-4">
              Why Pacific Marine Academy Stand Out
            </h2>
            <p className="text-sm text-ink/70 leading-relaxed">
              We do not just teach textbooks; we groom future Captains and Chief Engineers under authentic maritime discipline and world-class bridge simulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border-2 border-navy-deep/10 shadow-chunky hover:-translate-y-2 transition-transform duration-300 relative group">
              <div className="w-14 h-14 rounded-2xl bg-terracotta text-white flex items-center justify-center mb-6 shadow-terracotta group-hover:rotate-6 transition-transform">
                <Anchor className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy-deep mb-3">
                Master Mariner Faculty
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Direct instruction from experienced Captains and Chief Engineers who have navigated international waters for decades.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border-2 border-sea-blue/30 shadow-chunky hover:-translate-y-2 transition-transform duration-300 relative group">
              <div className="w-14 h-14 rounded-2xl bg-sea-blue text-navy-deep flex items-center justify-center mb-6 shadow-sea group-hover:rotate-6 transition-transform">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy-deep mb-3">
                Bridge & Engine Simulator
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Hands-on practical exposure in our full-mission RADAR, ECDIS, and marine diesel engine overhaul workshop.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border-2 border-gold/40 shadow-chunky hover:-translate-y-2 transition-transform duration-300 relative group">
              <div className="w-14 h-14 rounded-2xl bg-gold text-navy-deep flex items-center justify-center mb-6 shadow-md group-hover:rotate-6 transition-transform">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy-deep mb-3">
                100% Sponsorship Guidance
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Dedicated psychometric test series and mock interview panels mimicking top shipping lines like Anglo-Eastern and Synergy.
              </p>
            </div>

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
                Featured Merchant Navy Batches
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-gold font-bold text-sm hover:underline"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="bg-navy-light/50 rounded-3xl p-6 border border-sea-blue/20 flex flex-col justify-between hover:border-gold transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-terracotta text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.badge}
                    </span>
                    <span className="text-xs font-bold text-gold">{course.duration}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-xs text-ivory/70 line-clamp-3 mb-4 leading-relaxed">{course.description}</p>
                  
                  <div className="space-y-1.5 text-xs text-sea-blue mb-6">
                    <p>✓ Mode: {course.mode}</p>
                    <p>✓ Target: {course.targetExam}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-sea-blue/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-ivory/60 block">Course Fee</span>
                    <span className="font-serif text-xl font-bold text-gold">{course.fee}</span>
                  </div>
                  <Link
                    to={`/admission?course=${encodeURIComponent(course.title)}`}
                    className="bg-sea-blue hover:bg-sea-dark text-navy-deep text-xs font-bold px-4 py-2.5 rounded-xl transition-transform active:scale-95"
                  >
                    Enrol Now
                  </Link>
                </div>
              </div>
            ))}
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
            <span className="badge-solid bg-gold/20 text-gold mb-2">Testimonianze</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              What Cadets & Parents Say
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
                Download Free IMU-CET Handbooks & Past Papers
              </h2>
              <p className="text-xs text-ink/70 max-w-xl">
                Get instant access to solved previous year papers, physics formula handbooks, and sponsorship interview questions.
              </p>
            </div>
            <Link
              to="/study-materials"
              className="bg-terracotta hover:bg-terracotta-hover text-white font-bold px-8 py-4 rounded-2xl shadow-terracotta shrink-0 flex items-center gap-2 text-xs uppercase tracking-wider"
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
                    {isOpen ? <ChevronUp className="w-5 h-5 text-terracotta shrink-0" /> : <ChevronDown className="w-5 h-5 text-sea-blue shrink-0" />}
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
          <div className="w-16 h-16 rounded-full bg-terracotta/20 text-terracotta mx-auto flex items-center justify-center border-2 border-terracotta">
            <Anchor className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Ready To Set Sail On Your Merchant Navy Career?
          </h2>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Admissions open for upcoming batches. Speak to our Master Mariner counsellors or apply online today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/admission"
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
