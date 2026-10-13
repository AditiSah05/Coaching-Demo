"use client";

import React, { useState } from 'react';
import { Download, Search, Lock, Play, FileText, CheckCircle2, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const StudyMaterials = () => {
  const { studyMaterials, api } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lead Capture Modal State
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' });
  const [leadUnlocked, setLeadUnlocked] = useState(false);

  const categories = ['All', 'Notes', 'Previous Papers', 'Practice Sets', 'Videos'];

  const filteredMaterials = studyMaterials.filter(m => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.previewText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownloadClick = (item) => {
    setActiveMaterial(item);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (leadForm.name && leadForm.phone) {
      api.submitLead({
        name: leadForm.name,
        phone: leadForm.phone,
        email: leadForm.email,
        materialTitle: activeMaterial?.title || 'Study Material'
      });
      setLeadUnlocked(true);
    }
  };

  return (
    <div className="bg-ivory text-ink min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-deep text-ivory py-16 relative bg-maritime-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-solid bg-gold/20 text-gold mb-3">Centro Di Studio</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Free IMU-CET Study Material Hub
          </h1>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Download solved sample papers, physics formula handbooks, and interview viva guides prepared by Master Mariners.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#F8F5ED" />
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-8 bg-white border-b border-navy-deep/10 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-terracotta text-navy-deep shadow-terracotta scale-105'
                    : 'bg-ivory text-ink/70 hover:bg-sea-blue/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink/50 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search handbooks, papers..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
            />
          </div>

        </div>
      </section>

      {/* Study Material Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border-2 border-navy-deep/10 shadow-chunky flex flex-col justify-between hover:border-sea-blue transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-navy-deep text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-ink/60 font-semibold">{item.size}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-navy-deep leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink/70 leading-relaxed">
                    {item.previewText}
                  </p>

                  {item.category === 'Videos' && item.downloadUrl.includes('youtube') && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-black border">
                      <iframe
                        src={item.downloadUrl}
                        title={item.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-navy-deep/10 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-ink/60 font-semibold">
                    {item.downloadsCount ? `${item.downloadsCount}+ Downloads` : 'Free Download'}
                  </span>
                  
                  <button
                    onClick={() => handleDownloadClick(item)}
                    className="bg-terracotta hover:bg-terracotta-hover text-navy-deep text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-terracotta transition-transform active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Material</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LEAD CAPTURE GATE MODAL */}
      {activeMaterial && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-4 border-sea-blue shadow-2xl relative">
            <button
              onClick={() => { setActiveMaterial(null); setLeadUnlocked(false); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-ivory text-navy-deep hover:bg-navy-light hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!leadUnlocked ? (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-terracotta/20 text-goldtext flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sea-blue">Free Lead Access</span>
                  <h3 className="font-serif text-xl font-bold text-navy-deep">
                    Unlock "{activeMaterial.title}"
                  </h3>
                  <p className="text-xs text-ink/70 mt-1">
                    Enter your name and mobile number to instantly receive the PDF download link.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Your Full Name*</label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Mobile Number (WhatsApp)*</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-terracotta hover:bg-terracotta-hover text-navy-deep font-bold py-3.5 rounded-xl shadow-terracotta text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unlock & Download Now</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="w-16 h-16 text-seagreen mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-navy-deep">Material Unlocked!</h3>
                <p className="text-xs text-ink/70">
                  Thank you {leadForm.name}! Your free material link is ready below.
                </p>
                <a
                  href="#download-ready"
                  onClick={() => alert(`Starting download for ${activeMaterial.title}`)}
                  className="inline-block bg-seagreen text-white font-bold px-6 py-3 rounded-xl text-xs uppercase shadow-md"
                >
                  Download File ({activeMaterial.size})
                </a>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
