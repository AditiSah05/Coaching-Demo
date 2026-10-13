"use client";

import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminFaculty = () => {
  const { faculty, api } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', qualification: '', specialization: '', image: '', experience: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.saveFaculty(formData);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete faculty member?')) api.deleteFaculty(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Faculty Roster Manager</h1>
          <p className="text-xs text-ink/70">Manage teaching Captains and Marine Engineers.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-terracotta text-white font-bold px-4 py-2 rounded-xl text-xs uppercase">
          <Plus className="w-4 h-4 inline" /> Add Faculty
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculty.map((f) => (
          <div key={f.id} className="bg-white p-4 rounded-2xl border flex justify-between items-start">
            <div>
              <h4 className="font-serif font-bold text-navy-deep text-sm">{f.name}</h4>
              <span className="text-xs text-terracotta font-semibold block">{f.role}</span>
              <p className="text-[11px] text-ink/60 mt-1">{f.specialization}</p>
            </div>
            <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-navy-deep shadow-2xl relative space-y-3 text-xs">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <h3 className="font-serif text-lg font-bold text-navy-deep">Add Faculty Member</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" required placeholder="Name (e.g. Capt. R. Salunkhe)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Role (e.g. Principal Instructor)" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Qualification (e.g. Master Mariner FG)" value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Specialization" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" placeholder="Image Unsplash URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <button type="submit" className="w-full bg-terracotta text-white font-bold py-3 rounded-xl uppercase">Save Faculty</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
