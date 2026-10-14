"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Phone, MessageCircle } from 'lucide-react';

export const Faq = ({ faqs = [], phone = '', whatsapp = '' }) => {
  const [open, setOpen] = useState(0);
  if (!faqs.length) return null;
  const wa = (whatsapp || phone).replace(/[^0-9]/g, '');

  return (
    <section className="bg-white py-24 text-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        {/* Heading + contact, stays in view while the answers open */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="badge-solid text-goldtext">FAQ</span>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-navy-deep sm:text-5xl">
              Questions, <span className="text-goldtext">answered</span>
            </h2>
            <span className="mt-6 block h-px w-16 bg-gold" aria-hidden="true" />

            <div className="mt-8 rounded-3xl border border-navy-deep/10 bg-ivory p-6">
              <p className="font-serif text-lg font-semibold text-navy-deep">Still have a question?</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">Talk to us directly. We are happy to help.</p>
              <div className="mt-5 flex flex-col gap-3">
                {phone && (
                  <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-deep px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-navy-light">
                    <Phone className="h-4 w-4" /> Call {phone}
                  </a>
                )}
                {wa && (
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-deep/20 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-deep transition-colors hover:border-gold hover:bg-gold-light">
                    <MessageCircle className="h-4 w-4" /> WhatsApp us
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <ul className="lg:col-span-8">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <li key={faq.id} className="border-t border-navy-deep/10 last:border-b">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${faq.id}`}
                  className="group flex w-full items-start gap-5 py-6 text-left sm:gap-8"
                >
                  <span className={`w-10 shrink-0 pt-0.5 font-serif text-2xl font-semibold leading-none transition-colors duration-300 sm:w-14 sm:text-3xl ${isOpen ? 'text-gold' : 'text-navy-deep/25 group-hover:text-gold'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`flex-1 font-serif text-lg font-semibold leading-snug transition-colors sm:text-xl ${isOpen ? 'text-navy-deep' : 'text-navy-deep/85'}`}>
                    {faq.question}
                  </span>
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? 'rotate-45 border-gold bg-gold text-navy-deep' : 'border-navy-deep/20 text-navy-deep group-hover:border-gold'}`}>
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${faq.id}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 pl-[3.75rem] pr-4 text-[15px] leading-relaxed text-ink/75 sm:pl-[5.5rem]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
