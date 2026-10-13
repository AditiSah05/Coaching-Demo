"use client";

import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminTestimonials = () => {
  const { testimonials, api } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', text: '', rating: 5, location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.saveTestimonial(formData);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete testimonial?')) api.deleteTestimonial(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Student & Parent Reviews</h1>
          <p className="text-xs text-ink/70">Manage testimonials displayed on the homepage slider.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-terracotta text-white font-bold px-4 py-2 rounded-xl text-xs uppercase">
          <Plus className="w-4 h-4 inline" /> Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-2xl border flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-navy-deep text-sm">{t.name}</h4>
              <span className="text-[10px] text-terracotta font-semibold">{t.role}</span>
              <p className="text-xs text-ink/70 italic mt-2">"{t.text}"</p>
            </div>
            <div className="mt-4 pt-2 border-t flex justify-end">
              <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-navy-deep shadow-2xl relative space-y-3 text-xs">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <h3 className="font-serif text-lg font-bold text-navy-deep">Add Testimonial</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" required placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Role (e.g. DNS Cadet at Anglo-Eastern)" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <textarea rows="3" required placeholder="Review Text" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} className="w-full p-2.5 border rounded-xl"></textarea>
              <button type="submit" className="w-full bg-terracotta text-white font-bold py-3 rounded-xl uppercase">Save Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
