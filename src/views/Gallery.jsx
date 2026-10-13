"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Compass } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const Gallery = () => {
  const { gallery } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Simulator', 'Classroom', 'Events', 'Ship Visits', 'Campus'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    setLightboxIndex(prev => (prev === 0 ? filteredGallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setLightboxIndex(prev => (prev === filteredGallery.length - 1 ? 0 : prev + 1));
  };

  // Keyboard Navigation & ESC handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredGallery.length]);

  return (
    <div className="bg-ivory text-ink min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-deep text-ivory py-16 relative bg-maritime-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-solid bg-gold/20 text-gold mb-3">Galleria Fotografica</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Life At Pacific Marine Academy
          </h1>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Glance through our bridge simulators, marine workshops, passing-out parades, and industrial ship visits.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#F4F2ED" />
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-white border-b border-navy-deep/10 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy-deep text-gold shadow-md scale-105'
                    : 'bg-ivory text-ink/70 hover:bg-sea-blue/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Image Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredGallery.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="break-inside-avoid bg-white rounded-3xl overflow-hidden border border-navy-deep/10 shadow-chunky cursor-pointer group relative"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    aspectRatio="aspect-auto"
                    className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-navy-dark/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                    <Maximize2 className="w-8 h-8 text-gold mb-2" />
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <span className="bg-terracotta text-navy-deep text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-navy-deep mt-1">{item.title}</h3>
                  <p className="text-xs text-ink/70 mt-1 line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LIGHTBOX MODAL WITH KEYBOARD NAV */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-navy-dark/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
          
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full bg-navy-light text-white hover:text-gold transition-colors"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav Controls */}
          <button
            onClick={prevImage}
            className="absolute left-4 p-3 rounded-full bg-navy-light text-white hover:text-gold transition-colors"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 p-3 rounded-full bg-navy-light text-white hover:text-gold transition-colors"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Main Lightbox Content */}
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="arch-image overflow-hidden border-4 border-gold shadow-2xl max-h-[70vh]">
              <ImageWithFallback
                src={filteredGallery[lightboxIndex].image}
                alt={filteredGallery[lightboxIndex].title}
                aspectRatio="aspect-auto"
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="mt-4 text-center text-white space-y-1 max-w-xl">
              <span className="bg-sea-blue text-navy-deep font-bold text-[10px] px-3 py-1 rounded-full uppercase">
                {filteredGallery[lightboxIndex].category}
              </span>
              <h3 className="font-serif text-xl font-bold text-gold">
                {filteredGallery[lightboxIndex].title}
              </h3>
              <p className="text-xs text-ivory/80">
                {filteredGallery[lightboxIndex].caption}
              </p>
              <span className="text-[10px] text-sea-blue block pt-2">
                Image {lightboxIndex + 1} of {filteredGallery.length}
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
