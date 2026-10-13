"use client";

import React from 'react';
import { FileText, Download, Calendar, HardDrive } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const AvailableForms = () => {
  const { availableForms } = useData();

  return (
    <div className="bg-ivory text-ink min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-deep text-ivory py-16 relative bg-maritime-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-solid bg-gold/20 text-gold mb-3">Modulistica Ufficiale</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Downloadable Institute Forms
          </h1>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Official PDF templates for offline admissions, medical fitness formats, hostel rules, and scholarship applications.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#FBF6EC" />
        </div>
      </section>

      {/* Forms List */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-6">
            {availableForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-3xl p-6 border-2 border-navy-deep/10 shadow-chunky flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-sea-blue transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-navy-deep text-gold text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                        {form.category}
                      </span>
                      <span className="text-[10px] text-ink/60 flex items-center gap-1 font-semibold">
                        <HardDrive className="w-3 h-3" /> {form.fileType} • {form.fileSize}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-navy-deep">
                      {form.title}
                    </h3>
                    
                    <p className="text-xs text-ink/70 mt-1">
                      {form.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-navy-deep/5">
                  <span className="text-[10px] text-ink/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Updated: {form.updateDate}
                  </span>
                  
                  <button
                    onClick={() => alert(`Downloading official form: ${form.title}`)}
                    className="bg-sea-blue hover:bg-sea-dark text-navy-deep font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sea transition-transform active:scale-95 ml-auto sm:ml-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
