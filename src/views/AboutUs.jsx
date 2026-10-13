"use client";

import React from 'react';
import { Anchor, Compass, Award, ShieldCheck, Users, CheckCircle2, Building, Flame, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const AboutUs = () => {
  const { faculty, settings } = useData();

  return (
    <div className="bg-ivory text-ink">
      
      {/* Page Header */}
      <section className="bg-navy-deep text-ivory py-16 sm:py-20 relative bg-maritime-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-solid bg-terracotta/20 text-goldtext mb-3">La Nostra Storia</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mb-4">
            About Pacific Marine Academy
          </h1>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            For over 16 years, Pacific Marine Academy has stood as India's premier Merchant Navy entrance coaching institute, bridging ambitious cadets to high seas maritime careers.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#F8F5ED" />
        </div>
      </section>

      {/* Director's Message Card */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-navy-deep/10 shadow-chunky grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4">
              <div className="arch-image overflow-hidden border-4 border-gold shadow-lg bg-navy-dark">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                  alt="Director Capt. Rajeshwar S. Salunkhe"
                  aspectRatio="aspect-[4/5]"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-serif text-lg font-bold text-navy-deep">Capt. Rajeshwar S. Salunkhe</h3>
                <p className="text-xs font-semibold text-goldtext">Founder & Master Mariner (FG)</p>
                <p className="text-[10px] text-ink/60">22 Years At Sea • 14 Years Maritime Educator</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 text-ink/80 text-xs sm:text-sm leading-relaxed">
              <span className="badge-solid bg-navy-deep/10 text-navy-deep">Message From The Director</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-deep">
                "Discipline, Integrity, And Nautical Excellence"
              </h2>
              <p>
                Welcome to Pacific Marine Academy. When I first stepped onto a cargo ship three decades ago as a junior cadet, I realized that seamanship is not just a job—it is a way of life built on absolute discipline, sharp reflexes, and technical perfection.
              </p>
              <p>
                We established PMA to eliminate the confusion and predatory agents surrounding Merchant Navy entry in India. Here, every cadet receives genuine, DG Shipping compliant coaching directly from veteran Master Mariners and Chief Engineers.
              </p>
              <p className="italic text-navy-deep font-semibold">
                "Our promise: We do not sell dreams; we build mariners."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-navy-light/40 p-8 rounded-3xl border border-sea-blue/20">
              <div className="w-12 h-12 rounded-2xl bg-terracotta text-navy-deep flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-xs text-ivory/80 leading-relaxed">
                To empower Indian youth with world-class academic preparation for IMU-CET and shipping company sponsorship tests, ensuring 100% genuine placement pathways into top global fleets.
              </p>
            </div>

            <div className="bg-navy-light/40 p-8 rounded-3xl border border-sea-blue/20">
              <div className="w-12 h-12 rounded-2xl bg-gold text-ink flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-xs text-ivory/80 leading-relaxed">
                To be recognized globally as the gold-standard maritime entrance coaching academy, known for producing disciplined, high-ranking officers who uphold safety and nautical excellence worldwide.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-solid bg-terracotta/10 text-goldtext mb-2">Docenti Esperti</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-deep">
              Learn From Master Mariners & Engineers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl border-2 border-navy-deep/10 p-5 shadow-chunky text-center flex flex-col justify-between">
                <div>
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-sea-blue">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      aspectRatio="aspect-square"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-base font-bold text-navy-deep mb-1">{member.name}</h3>
                  <p className="text-xs font-semibold text-goldtext mb-2">{member.role}</p>
                  <p className="text-[11px] text-ink/70 mb-2">{member.qualification}</p>
                </div>
                <div className="pt-3 border-t border-navy-deep/5 text-[10px] text-sea-blue font-bold">
                  {member.specialization}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-20 bg-navy-deep text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="badge-solid bg-gold/20 text-gold mb-2">I Nostri Traguardi</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              PMA Academy Milestones
            </h2>
          </div>

          <div className="space-y-8 relative before:absolute before:left-4 md:before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-sea-blue/30">
            {[
              { year: "2010", title: "Foundation in Navi Mumbai", desc: "Started with a modest classroom of 25 cadets under Capt. Salunkhe." },
              { year: "2014", title: "First All-India Rank 01", desc: "Cadet achieved AIR 01 in IMU-CET, launching our national reputation." },
              { year: "2018", title: "Simulator Wing Inauguration", desc: "Added state-of-the-art RADAR and Marine Engine simulator labs." },
              { year: "2022", title: "Crossed 4,000 Placed Cadets", desc: "Partnered directly with 30+ leading international shipping companies." },
              { year: "2026", title: "Digital & Residential Expansion", desc: "Launched full hybrid learning platform with smart hostel facility." }
            ].map((milestone, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-terracotta text-navy-deep font-bold text-xs flex items-center justify-center shrink-0 z-10 shadow-terracotta">
                  ⚓
                </div>
                <div className="bg-navy-light/50 p-6 rounded-2xl border border-sea-blue/20 w-full md:w-[45%]">
                  <span className="font-serif text-xl font-bold text-gold block mb-1">{milestone.year}</span>
                  <h4 className="font-serif text-base font-bold text-white mb-1">{milestone.title}</h4>
                  <p className="text-xs text-ivory/70">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
