"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { MapPin, Phone, Mail, Navigation, MessageCircle, Facebook, Instagram, Youtube, ArrowUpRight, ArrowUp } from 'lucide-react';
import { useData } from '../../context/DataContext';

const explore = [
  { label: 'About Academy', path: '/about' },
  { label: 'Our Courses', path: '/courses' },
  { label: 'Admission Form', path: '/admission' },
  { label: 'Results & Toppers', path: '/results' },
  { label: 'Study Materials', path: '/study-materials' },
  { label: 'Company Sponsorship Forms', path: '/forms' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact Us', path: '/contact' },
];

const programs = [
  { label: 'IMU CET Preparation', path: '/courses/imu-cet-preparation' },
  { label: 'Diploma in Nautical Science (DNS)', path: '/courses/diploma-in-nautical-science' },
  { label: 'BSC Nautical Science', path: '/courses/bsc-nautical-science' },
  { label: 'B.Tech Marine Engineering', path: '/courses/btech-marine-engineering' },
];

const FooterLink = ({ href, children }) => (
  <Link
    href={href}
    className="group relative inline-flex items-center text-sm text-white/65 hover:text-gold transition-colors"
  >
    <span className="relative">
      {children}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
    </span>
  </Link>
);

const Heading = ({ children }) => (
  <h4 className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
    <span className="h-px w-6 bg-gold/60" />
    {children}
  </h4>
);

const ContactRow = ({ Icon, href, children, external }) => {
  const body = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/25 transition-colors group-hover:bg-gold group-hover:text-navy-deep">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm leading-relaxed text-white/75 transition-colors group-hover:text-white break-words min-w-0">{children}</span>
    </>
  );
  const cls = "group flex items-start gap-3";
  return href ? (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{body}</a>
  ) : (
    <div className={cls}>{body}</div>
  );
};

export const Footer = () => {
  const { settings } = useData();
  // On the Contact page a full-width map sits above the footer; let the wave rise over it.
  const overMap = usePathname() === '/contact';
  const phone = settings?.phonePrimary;
  const address = settings?.address;
  const links = settings?.socialLinks || {};
  const socials = [
    { key: 'whatsapp', Icon: MessageCircle, label: 'WhatsApp', hover: 'hover:bg-seagreen hover:border-seagreen' },
    { key: 'instagram', Icon: Instagram, label: 'Instagram', hover: 'hover:bg-terracotta hover:border-terracotta' },
    { key: 'facebook', Icon: Facebook, label: 'Facebook', hover: 'hover:bg-[#1877F2] hover:border-[#1877F2]' },
    { key: 'youtube', Icon: Youtube, label: 'YouTube', hover: 'hover:bg-red-600 hover:border-red-600' },
  ].filter((s) => links[s.key]);

  return (
    <footer className="relative text-white print:hidden">
      {/* Wave rising from the page into the footer */}
      <div className={overMap ? 'pointer-events-none relative z-10 -mt-12 leading-none md:-mt-20' : 'leading-none bg-ivory'} aria-hidden="true">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block w-full h-12 md:h-20">
          <path d="M0,50 C240,100 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z" fill="#0B2C4A" />
          <path d="M0,62 C260,20 500,90 760,56 C1000,24 1220,80 1440,48 L1440,90 L0,90 Z" fill="#021527" />
        </svg>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-b from-navy-deep to-navy-dark">
        {/* ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[70%] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          {/* Main grid */}
          <div className="grid grid-cols-1 gap-12 pb-14 pt-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">

            {/* Brand */}
            <div className="space-y-6 lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-4">
                <img src="/logo.png" alt="Pacific Marine Academy" className="h-16 w-16 shrink-0 rounded-full bg-white ring-2 ring-gold/70 ring-offset-4 ring-offset-navy-deep" />
                <div>
                  <h3 className="font-serif text-2xl font-bold leading-none tracking-tight">
                    PACIFIC <span className="text-gold">MARINE</span>
                  </h3>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">Academy • Sikar</p>
                </div>
              </Link>

              <p className="max-w-sm text-sm leading-relaxed text-white/65">
                India's premier Merchant Navy entrance coaching institute. Expert Master Mariners guiding young cadets through IMU-CET, DNS sponsorship and shipping-company interviews.
              </p>

              <Link
                href="/admission"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-navy-deep transition-colors hover:bg-gold-hover"
              >
                Enrol Now
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              {socials.length > 0 && (
                <div className="flex items-center gap-2.5 pt-1">
                  {socials.map(({ key, Icon, label, hover }) => (
                    <a
                      key={key}
                      href={links[key]}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:text-white ${hover}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Explore */}
            <div className="lg:col-span-2">
              <Heading>Explore</Heading>
              <ul className="space-y-3.5">
                {explore.map((l) => <li key={l.path}><FooterLink href={l.path}>{l.label}</FooterLink></li>)}
              </ul>
            </div>

            {/* Programs */}
            <div className="lg:col-span-3">
              <Heading>Programs</Heading>
              <ul className="space-y-3.5">
                {programs.map((l) => <li key={l.path}><FooterLink href={l.path}>{l.label}</FooterLink></li>)}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <Heading>Visit Us</Heading>
              <div className="space-y-5">
                {address && <ContactRow Icon={MapPin}>{address}</ContactRow>}
                {phone && (
                  <ContactRow Icon={Phone} href={`tel:${phone.replace(/\s/g, '')}`}>
                    {[phone, settings?.phoneSecondary].filter(Boolean).join(' / ')}
                  </ContactRow>
                )}
                {settings?.email && (
                  <ContactRow Icon={Mail} href={`mailto:${settings.email}`}>{settings.email}</ContactRow>
                )}
                {address && (
                  <ContactRow
                    Icon={Navigation}
                    href={settings?.mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    external
                  >
                    Get directions
                  </ContactRow>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative border-t border-transparent pb-8 pt-6 [border-image:linear-gradient(to_right,transparent,rgba(191,168,136,0.5),transparent)_1]">
            <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/50 md:flex-row">
              <p className="text-center md:text-left">
                © {new Date().getFullYear()} {settings?.instituteName}. All Rights Reserved. Developed by{' '}
                <a href="https://westmere.io" target="_blank" rel="noreferrer" className="text-white/70 underline underline-offset-2 transition-colors hover:text-gold">westmere</a>.
              </p>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gold">Sikar, Rajasthan</span>
                <a
                  href="#top"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  aria-label="Back to top"
                  className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-navy-deep"
                >
                  <ArrowUp className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
