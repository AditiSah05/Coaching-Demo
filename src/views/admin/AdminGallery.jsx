"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminGallery = () => {
  const { gallery, api } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Felicitation', image: '', caption: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.saveGalleryItem(formData);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete photo from gallery?')) api.deleteGalleryItem(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Photo & Video Gallery Manager</h1>
          <p className="text-xs text-ink/70">Upload photos via URL or base64 file upload.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-terracotta text-navy-deep font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 uppercase">
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border p-4 shadow space-y-2">
            <img src={item.image} alt={item.title} className="h-40 w-full object-cover rounded-xl" />
            <div className="flex items-center justify-between">
              <div>
                <span className="bg-gold text-navy-deep text-[10px] font-bold px-2 py-0.5 rounded">{item.category}</span>
                <h4 className="font-serif font-bold text-sm text-navy-deep mt-1">{item.title}</h4>
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-navy-deep shadow-2xl relative space-y-3">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <h3 className="font-serif text-lg font-bold text-navy-deep">Add Gallery Image</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" required placeholder="Photo Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border rounded-xl">
                <option value="Felicitation">Felicitation</option>
                <option value="Classrooms">Classrooms</option>
                <option value="Mentors & Counselling">Mentors &amp; Counselling</option>
              </select>

              <div>
                <label className="block text-[10px] font-bold mb-1">Image URL or File Upload</label>
                <input type="text" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-2.5 border rounded-xl mb-2" />
                <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-xs" />
              </div>

              {formData.image && (
                <img src={formData.image} alt="Preview" className="h-24 mx-auto rounded object-cover border" />
              )}

              <input type="text" placeholder="Caption / Description" value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <button type="submit" className="w-full bg-terracotta text-navy-deep font-bold py-3 rounded-xl uppercase">Upload Image</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
