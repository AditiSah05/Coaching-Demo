import React, { useState } from 'react';
import { Megaphone, Save, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminBanners = () => {
  const { banners, api } = useData();
  const [formData, setFormData] = useState({
    admissionOpen: banners?.admissionOpen ?? true,
    bannerText: banners?.bannerText || '',
    secondaryNotice: banners?.secondaryNotice || ''
  });
  const [toast, setToast] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.updateBanners(formData);
    setToast('Banners updated live!');
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
        <h1 className="font-serif text-2xl font-bold text-navy-deep">Banner & Ribbon Announcements</h1>
        <p className="text-xs text-ink/70">Control top website announcement ribbon and urgent batch alerts.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border-2 border-navy-deep/10 shadow-chunky max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex items-center gap-3 bg-ivory p-4 rounded-2xl border">
            <input
              type="checkbox"
              id="admissionOpen"
              checked={formData.admissionOpen}
              onChange={(e) => setFormData({ ...formData, admissionOpen: e.target.checked })}
              className="w-5 h-5 text-terracotta rounded"
            />
            <label htmlFor="admissionOpen" className="font-bold text-navy-deep">
              Show Urgent Top Announcement Ribbon (Admission Open 2026-27)
            </label>
          </div>

          <div>
            <label className="block font-bold text-navy-deep mb-1">Top Ribbon Text</label>
            <input
              type="text"
              value={formData.bannerText}
              onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-navy-deep mb-1">Secondary Notice Alert</label>
            <input
              type="text"
              value={formData.secondaryNotice}
              onChange={(e) => setFormData({ ...formData, secondaryNotice: e.target.value })}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="bg-terracotta text-white font-bold px-6 py-3 rounded-xl uppercase shadow-terracotta flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Announcement Settings
          </button>
        </form>
      </div>
    </div>
  );
};
