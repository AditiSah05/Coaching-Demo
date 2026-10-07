import React, { useState } from 'react';
import { Plus, Trash2, FileText, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminForms = () => {
  const { availableForms, api } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Admission', fileType: 'PDF', fileSize: '1.2 MB', description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.saveAvailableForm(formData);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete form template?')) api.deleteAvailableForm(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Available Forms Manager</h1>
          <p className="text-xs text-ink/70">Manage downloadable offline admission, medical formats, and hostel forms.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-terracotta text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 uppercase">
          <Plus className="w-4 h-4" /> Add New Form
        </button>
      </div>

      <div className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden p-6 space-y-3">
        {availableForms.map((form) => (
          <div key={form.id} className="p-4 bg-ivory rounded-2xl flex items-center justify-between border">
            <div>
              <span className="bg-sea-blue/20 text-navy-deep text-[10px] font-bold px-2 py-0.5 rounded">{form.category}</span>
              <h4 className="font-serif font-bold text-sm text-navy-deep mt-1">{form.title}</h4>
              <p className="text-xs text-ink/60">{form.description}</p>
            </div>
            <button onClick={() => handleDelete(form.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-navy-deep shadow-2xl relative space-y-3">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <h3 className="font-serif text-lg font-bold text-navy-deep">Add Downloadable Form</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" required placeholder="Form Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border rounded-xl">
                <option value="Admission">Admission</option>
                <option value="Medical">Medical</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Hostel">Hostel</option>
              </select>
              <textarea rows="3" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2.5 border rounded-xl"></textarea>
              <button type="submit" className="w-full bg-terracotta text-white font-bold py-3 rounded-xl uppercase">Save Form</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
