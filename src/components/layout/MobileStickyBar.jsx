"use client";

import React from 'react';
import Link from "next/link";
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const MobileStickyBar = () => {
  const { settings } = useData();

  const whatsappClean = (settings?.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="print:hidden md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-dark/95 backdrop-blur-md border-t-2 border-sea-blue/30 p-2 shadow-2xl">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <a
          href={`tel:${settings?.phonePrimary}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-navy-light text-white font-bold text-[11px] shadow hover:bg-navy-light/80 active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 text-gold mb-0.5" />
          <span>Call Now</span>
        </a>

        <a
          href={`https://wa.me/${whatsappClean}?text=Hello%20Pacific%20Marine%20Academy,%20I%20want%20information%20about%20Merchant%20Navy%20Coaching.`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-seagreen text-white font-bold text-[11px] shadow hover:bg-seagreen/90 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="/admission"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-terracotta text-navy-deep font-bold text-[11px] shadow-terracotta hover:bg-terracotta-hover active:scale-95 transition-transform"
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Apply Online</span>
        </Link>
      </div>
    </div>
  );
};
