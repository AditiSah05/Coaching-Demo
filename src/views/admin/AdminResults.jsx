"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Award, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminResults = () => {
  const { toppers, results, api } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', rank: 'AIR 05', score: '190/200', selection: '', batch: '2025 Batch', year: '2025', photo: 'AB', quote: ''
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', rank: 'AIR 05', score: '190/200', selection: '', batch: '2025 Batch', year: '2025', photo: 'AB', quote: '' });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.saveTopper({ ...formData, color: 'bg-terracotta' });
    setModalOpen(false);
  };

  const handleDeleteTopper = (id) => {
    if (window.confirm('Delete topper record?')) {
      api.deleteTopper(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Results & All-India Toppers</h1>
          <p className="text-xs text-ink/70">Manage published rankers and merit list records.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-terracotta text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 uppercase"
        >
          <Plus className="w-4 h-4" /> Add Topper
        </button>
      </div>

      <div className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden p-6">
        <h3 className="font-serif text-lg font-bold text-navy-deep mb-4">All-India Rank Toppers List</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toppers.map((top) => (
            <div key={top.id} className="bg-ivory p-4 rounded-2xl border flex items-center justify-between">
              <div>
                <span className="bg-gold text-navy-deep font-bold px-2 py-0.5 rounded text-[10px]">{top.rank}</span>
                <h4 className="font-serif font-bold text-sm text-navy-deep mt-1">{top.name}</h4>
                <p className="text-[10px] text-sea-blue font-semibold">{top.selection}</p>
              </div>
              <button
                onClick={() => handleDeleteTopper(top.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-navy-deep shadow-2xl relative space-y-4">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <h3 className="font-serif text-lg font-bold text-navy-deep">Add New All-India Topper</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" required placeholder="Cadet Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Rank (e.g. AIR 05)" value={formData.rank} onChange={e => setFormData({ ...formData, rank: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Score (e.g. 190/200)" value={formData.score} onChange={e => setFormData({ ...formData, score: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Company Sponsorship / Academy" value={formData.selection} onChange={e => setFormData({ ...formData, selection: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="text" required placeholder="Initials (e.g. RS)" value={formData.photo} onChange={e => setFormData({ ...formData, photo: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <button type="submit" className="w-full bg-terracotta text-white font-bold py-3 rounded-xl uppercase">Save Topper</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
