"use client";

import React from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { Users, FileText, BookOpen, Award, Ship, ArrowRight, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';

const steps = [
  { Icon: Users, title: 'Free Counselling', desc: 'Talk through your goals and check eligibility: age, PCM percentage and vision standards.' },
  { Icon: FileText, title: 'Register', desc: 'Fill the short registration form with your details and 12th PCM percentage.' },
  { Icon: BookOpen, title: 'IMU CET Preparation', desc: 'Classroom sessions, study materials and regular mock tests for the entrance exam.' },
  { Icon: Award, title: 'Sponsorship & Interview', desc: 'Written exam coaching and mock interviews to secure a shipping-company sponsorship.' },
  { Icon: Ship, title: 'Pre-Sea & Onboard', desc: 'Join an approved maritime college, then complete your onboard cadet training.' },
];

export const AdmissionSteps = () => {
  const { settings } = useData();
  const phone = settings?.phonePrimary;

  return (
    <section className="bg-ivory py-24 text-ink lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        {/* Left: pitch, stays in view while the steps scroll */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <span className="badge-solid text-goldtext">Your Path</span>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-navy-deep sm:text-5xl">
              From first call to the <span className="text-goldtext">open sea</span>
            </h2>
            <span className="mt-6 block h-px w-16 bg-gold" aria-hidden="true" />
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
              Five clear steps, with Pacific Marine Academy guiding you through each one.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/admission" className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-deep px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-navy-light">
                Start with step one <ArrowRight className="h-4 w-4" />
              </Link>
              {phone && (
                <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-deep/20 px-7 py-4 text-xs font-bold uppercase tracking-wider text-navy-deep transition-colors hover:border-gold hover:bg-gold-light">
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: the five steps as an editorial list */}
        <ol className="lg:col-span-7">
          {steps.map(({ Icon, title, desc }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group flex items-start gap-5 border-t border-navy-deep/10 py-8 transition-colors last:border-b hover:bg-white sm:gap-8 sm:px-4 lg:-mx-4"
            >
              <span className="w-14 shrink-0 font-serif text-5xl font-semibold leading-none text-gold transition-colors duration-300 group-hover:text-navy-deep sm:w-20 sm:text-6xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl font-semibold text-navy-deep sm:text-2xl">{title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/70">{desc}</p>
              </div>
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-navy-deep/15 text-navy-deep transition-colors duration-300 group-hover:border-gold group-hover:bg-gold sm:flex">
                <Icon className="h-5 w-5" />
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};
