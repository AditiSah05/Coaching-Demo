"use client";

import React from 'react';
import Link from "next/link";
import { Compass, MapPin, Phone, Mail, Award, ArrowUpRight, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Footer = () => {
  const { settings } = useData();

  return (
    <footer className="bg-navy-deep text-ivory relative overflow-hidden pt-16 pb-12 border-t-4 border-terracotta">
      {/* Background Compass Rose Watermark */}
      <div className="absolute right-[-100px] bottom-[-100px] opacity-5 pointer-events-none text-sea-blue">
        <Compass className="w-[500px] h-[500px] animate-spin-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Institute Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Pacific Marine Academy" className="w-12 h-12 rounded-full shrink-0 bg-white" />
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">PACIFIC <span className="text-gold">MARINE</span></h3>
                <p className="text-[11px] font-semibold text-sea-blue tracking-widest uppercase">Academy • Merchant Navy</p>
              </div>
            </div>
            <p className="text-xs text-ivory/80 leading-relaxed">
              India's premier Merchant Navy entrance coaching institute. Empowering young mariners with top-tier IMU-CET, DNS, and Shipping Sponsorship preparation under expert Master Mariners.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 bg-navy-light/60 px-3 py-1.5 rounded-full text-xs font-semibold text-gold border border-gold/30">
                <Award className="w-4 h-4 text-gold" />
                <span>IMU CET • DNS Sponsorship</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold mb-4 pb-2 border-b border-sea-blue/20 flex items-center gap-2">
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'About Our Academy', path: '/about' },
                { label: 'Merchant Navy Courses', path: '/courses' },
                { label: 'Admission Process & Form', path: '/admission' },
                { label: 'All-India Rank Results', path: '/results' },
                { label: 'Free Study Materials', path: '/study-materials' },
                { label: 'Downloadable Forms', path: '/forms' },
                { label: 'Photo & Video Gallery', path: '/gallery' },
                { label: 'Contact & Location', path: '/contact' }
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-ivory/80 hover:text-sea-blue transition-colors flex items-center gap-2"
                  >
                    <span className="text-gold font-bold">›</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Programs & Coaching */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold mb-4 pb-2 border-b border-sea-blue/20">
              Coaching Programs
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/80">
              <li className="flex items-start gap-2">
                <span className="text-sea-blue font-bold">⚓</span>
                <span>IMU-CET Comprehensive Prep (Aug/Dec)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sea-blue font-bold">⚓</span>
                <span>DNS Shipping Sponsorship Coaching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sea-blue font-bold">⚓</span>
                <span>G.P. Rating Entrance & Foundation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sea-blue font-bold">⚓</span>
                <span>Marine Engineering (B.Tech) Entrance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sea-blue font-bold">⚓</span>
                <span>Company Psychometric & Viva Prep</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sea-blue font-bold">⚓</span>
                <span>IMU-CET Super Fast Crash Course</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold mb-4 pb-2 border-b border-sea-blue/20">
              Campus Contact
            </h4>
            <div className="space-y-3 text-xs text-ivory/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{settings?.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sea-blue shrink-0" />
                <span>{[settings?.phonePrimary, settings?.phoneSecondary].filter(Boolean).join(" / ")}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{settings?.email}</span>
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-6 pt-4 border-t border-sea-blue/20">
              <span className="text-[10px] uppercase tracking-wider text-sea-blue font-bold block mb-2">Connect With Us</span>
              <div className="flex items-center gap-2">
                {settings?.socialLinks?.facebook && <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-navy-light/60 hover:bg-sea-blue hover:text-navy-deep flex items-center justify-center text-ivory transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>}
                {settings?.socialLinks?.instagram && <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-navy-light/60 hover:bg-terracotta hover:text-white flex items-center justify-center text-ivory transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>}
                {settings?.socialLinks?.youtube && <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-navy-light/60 hover:bg-red-600 hover:text-white flex items-center justify-center text-ivory transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-sea-blue/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <p>© {new Date().getFullYear()} {settings?.instituteName}. All Rights Reserved. Developed by My Digital Desh.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-gold flex items-center gap-1">
              <span>Admin Portal</span> <ExternalLink className="w-3 h-3" />
            </Link>
            <span>•</span>
            <span className="text-gold font-semibold">Sikar, Rajasthan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
