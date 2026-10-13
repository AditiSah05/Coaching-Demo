"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ShieldAlert, Award, Compass, ArrowRight, UserCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { settings, banners } = useData();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Courses', path: '/courses' },
    { name: 'Admission Form', path: '/admission' },
    { name: 'Results', path: '/results' },
    { name: 'Study Materials', path: '/study-materials' },
    { name: 'Available Forms', path: '/forms' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-deep text-ivory shadow-xl border-b border-sea-blue/20">
      {/* Top Announcement Ribbon */}
      {banners?.admissionOpen && (
        <div className="bg-terracotta text-white py-1.5 px-4 text-xs md:text-sm font-medium flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 mx-auto truncate">
            <span className="bg-gold text-ink font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider animate-pulse">
              Urgent
            </span>
            <span className="truncate">{banners.bannerText}</span>
          </div>
          <Link href="/admission" className="hidden lg:flex items-center gap-1 font-bold underline hover:text-gold text-xs shrink-0">
            Apply Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Pacific Marine Academy" className="w-12 h-12 rounded-full shrink-0 bg-white transition-transform group-hover:rotate-12" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sea-blue transition-colors">
                  PACIFIC
                </span>
                <span className="text-terracotta font-serif text-xl sm:text-2xl font-bold">MARINE</span>
              </div>
              <span className="text-[10px] font-semibold text-sea-blue uppercase tracking-widest flex items-center gap-1">
                <Compass className="w-3 h-3 text-gold animate-spin-slow" /> ACADEMY • MERCHANTS NAVY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-gold font-bold' : 'text-ivory/90 hover:text-sea-blue'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${settings?.phonePrimary}`}
              className="flex items-center gap-1.5 text-xs font-bold text-ivory hover:text-sea-blue transition-colors bg-navy-light/40 px-3 py-2 rounded-xl border border-sea-blue/30"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>Call Us</span>
            </a>
            
            <Link
              href="/admission"
              className="bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-terracotta flex items-center gap-1.5 transition-transform active:scale-95 uppercase tracking-wide"
            >
              <span>Enrol Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/login"
              title="Admin Portal"
              className="p-2 rounded-xl bg-navy-light/40 hover:bg-navy-light text-sea-blue transition-colors border border-sea-blue/30"
            >
              <UserCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 xl:hidden">
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
            className="xl:hidden bg-navy-dark border-t border-sea-blue/20 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-sea-blue uppercase tracking-widest flex items-center gap-2 border-b border-navy-light mb-2">
                <span>Benvenuti A Bordo • Navigation</span>
              </div>
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.path;
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
                          ? 'bg-terracotta text-white font-bold'
                          : 'text-ivory hover:bg-navy-light/60 hover:text-sea-blue'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <Compass className="w-4 h-4 text-gold animate-spin-slow" />}
                    </Link>
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
