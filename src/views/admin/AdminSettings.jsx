"use client";

import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminSettings = () => {
  const { settings, api } = useData();
  const [formData, setFormData] = useState({
    instituteName: settings?.instituteName || '',
    tagline: settings?.tagline || '',
    phonePrimary: settings?.phonePrimary || '',
    phoneSecondary: settings?.phoneSecondary || '',
    whatsapp: settings?.whatsapp || '',
    email: settings?.email || '',
    address: settings?.address || '',
    mapEmbedUrl: settings?.mapEmbedUrl || '',
    heroHeading: settings?.heroHeading || '',
    heroSubheading: settings?.heroSubheading || '',
    stats: {
      studentsTrained: settings?.stats?.studentsTrained || 5400,
      selections: settings?.stats?.selections || 5120,
      yearsExperience: settings?.stats?.yearsExperience || 16,
      partnerSponsors: settings?.stats?.partnerSponsors || 34
    }
  });

  const [toast, setToast] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.updateSettings(formData);
    setToast('Site settings updated live across website!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="bg-seagreen text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-deep">Site Settings & Contact Config</h1>
        <p className="text-xs text-ink/70">Update institute name, phone numbers, map link, and landing page headlines.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border-2 border-navy-deep/10 shadow-chunky space-y-4 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-navy-deep mb-1">Institute Name</label>
            <input type="text" value={formData.instituteName} onChange={e => setFormData({ ...formData, instituteName: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-navy-deep mb-1">Tagline</label>
            <input type="text" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-navy-deep mb-1">Primary Helpline Phone</label>
            <input type="text" value={formData.phonePrimary} onChange={e => setFormData({ ...formData, phonePrimary: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-navy-deep mb-1">WhatsApp Number</label>
            <input type="text" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-navy-deep mb-1">Admissions Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-navy-deep mb-1">Students Trained Stat</label>
            <input type="number" value={formData.stats.studentsTrained} onChange={e => setFormData({ ...formData, stats: { ...formData.stats, studentsTrained: parseInt(e.target.value) || 0 } })} className="w-full p-2.5 border rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block font-bold text-navy-deep mb-1">Physical Address</label>
          <textarea rows="2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2.5 border rounded-xl"></textarea>
        </div>

        <div>
          <label className="block font-bold text-navy-deep mb-1">Hero Main Headline</label>
          <input type="text" value={formData.heroHeading} onChange={e => setFormData({ ...formData, heroHeading: e.target.value })} className="w-full p-2.5 border rounded-xl font-bold" />
        </div>

        <div>
          <label className="block font-bold text-navy-deep mb-1">Hero Subheading</label>
          <textarea rows="2" value={formData.heroSubheading} onChange={e => setFormData({ ...formData, heroSubheading: e.target.value })} className="w-full p-2.5 border rounded-xl"></textarea>
        </div>

        <button type="submit" className="bg-terracotta text-white font-bold px-6 py-3 rounded-xl uppercase shadow-terracotta flex items-center gap-2">
          <Save className="w-4 h-4" /> Save All Settings
        </button>

      </form>
    </div>
  );
};
