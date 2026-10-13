"use client";

import React from 'react';
import { Anchor } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Item = ({ text }) => (
  <span className="flex items-center gap-2.5 px-8 shrink-0">
    <Anchor className="w-4 h-4 text-gold shrink-0" />
    <span className="bg-gold text-navy-deep font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
      Urgent
    </span>
    <span>{text}</span>
  </span>
);

export const AnnouncementBar = () => {
  const { banners } = useData();
  if (!banners?.admissionOpen) return null;

  // Two identical groups; the track slides by exactly one group for a seamless loop.
  const group = (hidden) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {[0, 1, 2, 3].map((i) => <Item key={i} text={banners.bannerText} />)}
    </div>
  );

  return (
    <div className="marquee-pause relative text-white py-2.5 text-xs md:text-sm font-medium overflow-hidden">
      <div className="flex w-max animate-marquee">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
};
