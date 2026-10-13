"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, Anchor, ShieldAlert, Award, Compass, ArrowRight, UserCheck, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { settings } = useData();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about', children: [
      { name: 'About Institute', path: '/about' },
    ] },
    { name: 'Our Courses', path: '/courses', children: [
      { name: 'IMU CET Preparation', path: '/courses/imu-cet-preparation' },
      { name: 'DNS Sponsorship', path: '/courses/dns-sponsorship' },
      { name: 'Diploma in Nautical Science', path: '/courses/diploma-in-nautical-science' },
      { name: 'BSC Nautical Science', path: '/courses/bsc-nautical-science' },
      { name: 'B.Tech Marine Engineering', path: '/courses/btech-marine-engineering' },
    ] },
    { name: 'Admission Form', path: '/admission' },
    { name: 'Results', path: '/results' },
    { name: 'Study Materials', path: '/study-materials' },
    { name: 'Available Forms', path: '/forms' },
    { name: 'Gallery', path: '/gallery', children: [
      { name: 'Photo Gallery', path: '/gallery' },
      { name: 'Video Gallery', path: '/videos' },
      { name: 'Blogs', path: '/blogs' },
    ] },
    { name: 'Contact', path: '/contact' },
  ];
  const isActiveLink = (link) =>
    link.path === '/' ? pathname === '/' : pathname === link.path || pathname.startsWith(link.path + '/') ||
    link.children?.some((c) => pathname === c.path || pathname.startsWith(c.path + '/'));


  return (
    <header className="sticky top-0 z-50 bg-navy-deep/95 backdrop-blur-md text-ivory shadow-xl border-b border-gold/20">
      {/* Main Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img src="/logo.png" alt="Pacific Marine Academy" className="w-14 h-14 rounded-full shrink-0 bg-white ring-2 ring-gold/70 ring-offset-2 ring-offset-navy-deep" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  PACIFIC
                </span>
                <span className="text-gold font-serif text-xl sm:text-2xl font-bold">MARINE</span>
              </div>
              <span className="text-[10px] font-medium text-sea-blue uppercase tracking-[0.18em] flex items-center gap-1 mt-0.5">
                ACADEMY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-0.5 2xl:ml-6">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link);
              return (
                <div key={link.path} className="relative group">
                  <Link
                    href={link.path}
                    className={`relative whitespace-nowrap px-2.5 py-2 rounded-full text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors flex items-center gap-1 ${
                      isActive ? 'text-gold bg-gold/10 ring-1 ring-gold/25' : 'text-ivory/85 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {link.children && <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />}
                  </Link>
                  {link.children && (
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity absolute left-0 top-full pt-2 z-50">
                      <div className="min-w-60 bg-navy-dark/95 backdrop-blur border border-gold/20 rounded-2xl shadow-2xl py-2 overflow-hidden">
                        {link.children.map((c) => (
                          <Link
                            key={c.path}
                            href={c.path}
                            className={`block whitespace-nowrap px-5 py-2.5 text-[13px] font-medium transition-colors border-l-2 border-transparent hover:border-gold hover:bg-white/5 hover:text-gold ${
                              pathname === c.path ? 'text-gold border-gold' : 'text-ivory/90'
                            }`}
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 whitespace-nowrap 2xl:pl-3 2xl:border-l 2xl:border-white/10">
            <a
              href={`tel:${settings?.phonePrimary}`}
              className="flex items-center gap-2 text-xs font-bold text-ivory hover:text-gold transition-colors px-3.5 py-2.5 rounded-full border border-gold/40 hover:border-gold hover:bg-gold/5"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>Call Us</span>
            </a>
            
            <Link
              href="/admission"
              className="bg-gradient-to-r from-sea-blue to-[#D4BE9E] hover:brightness-110 text-navy-deep text-xs font-extrabold px-4 py-2.5 rounded-full shadow-sea flex items-center gap-1.5 transition-transform active:scale-95 uppercase tracking-wide"
            >
              <span>Enrol Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/login"
              title="Admin Portal"
              className="p-2.5 rounded-full border border-sea-blue/50 text-sea-blue hover:bg-sea-blue hover:text-navy-deep transition-colors"
            >
              <UserCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 2xl:hidden">
            <Link
              href="/admin/login"
              className="p-2 rounded-lg bg-navy-light text-sea-blue text-xs font-bold"
            >
              Admin
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-navy-light text-ivory hover:text-gold transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="2xl:hidden bg-navy-dark border-t border-sea-blue/20 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-sea-blue uppercase tracking-widest flex items-center gap-2 border-b border-navy-light mb-2">
                <span>Menu</span>
              </div>
              {navLinks.map((link, idx) => {
                const isActive = isActiveLink(link);
                return (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-terracotta text-navy-deep font-bold'
                          : 'text-ivory hover:bg-navy-light/60 hover:text-sea-blue'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <Compass className="w-4 h-4 text-gold animate-spin-slow" />}
                    </Link>
                    {link.children && link.children.length > 1 && (
                      <div className="ml-4 mt-1 mb-1 border-l border-sea-blue/20 pl-3 space-y-1">
                        {link.children.map((c) => (
                          <Link
                            key={c.path}
                            href={c.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-ivory/80 hover:bg-navy-light/60 hover:text-sea-blue"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              <div className="pt-4 border-t border-navy-light grid grid-cols-2 gap-2">
                <a
                  href={`tel:${settings?.phonePrimary}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sea-blue text-navy-deep font-bold text-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Academy</span>
                </a>
                <Link
                  href="/admission"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gold text-ink font-bold text-xs"
                >
                  <span>Admission Form</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
