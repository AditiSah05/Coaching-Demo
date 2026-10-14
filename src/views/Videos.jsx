"use client";

import React from 'react';
import { useData } from '../context/DataContext';
import { YouTubeShorts } from '../components/home/YouTubeShorts';

export const Videos = () => {
  const { settings } = useData();
  const shorts = settings?.youtubeShorts || [];

  return (
    <div className="min-h-[60vh] bg-ivory">
      <section className="bg-navy-deep py-16 text-center text-white">
        <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Videos</h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-sm text-white/70">Watch Pacific Marine Academy on YouTube.</p>
      </section>
      {shorts.length ? (
        <YouTubeShorts shorts={shorts} channelUrl={settings?.youtubeChannelUrl} variant="grid" />
      ) : (
        <p className="py-24 text-center text-sm text-ink/60">Videos are coming soon.</p>
      )}
    </div>
  );
};
