"use client";

import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminFaqs = () => {
  const { faqs, api } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.saveFaq(formData);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete FAQ item?')) api.deleteFaq(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Frequently Asked Questions Manager</h1>
          <p className="text-xs text-ink/70">Manage FAQ questions displayed on the homepage.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-terracotta text-navy-deep font-bold px-4 py-2 rounded-xl text-xs uppercase">
          <Plus className="w-4 h-4 inline" /> Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white p-4 rounded-2xl border flex items-start justify-between">
            <div>
              <h4 className="font-serif font-bold text-navy-deep text-sm">{f.question}</h4>
              <p className="text-xs text-ink/70 mt-1">{f.answer}</p>
            </div>
            <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded ml-4">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-navy-deep shadow-2xl relative space-y-3 text-xs">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <h3 className="font-serif text-lg font-bold text-navy-deep">Add FAQ Item</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" required placeholder="Question" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <textarea rows="3" required placeholder="Answer" value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full p-2.5 border rounded-xl"></textarea>
              <button type="submit" className="w-full bg-terracotta text-navy-deep font-bold py-3 rounded-xl uppercase">Save FAQ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
