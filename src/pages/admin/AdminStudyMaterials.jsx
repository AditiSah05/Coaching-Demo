import React, { useState } from 'react';
import { Plus, Trash2, Edit2, FileText, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminStudyMaterials = () => {
  const { studyMaterials, api } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Notes', type: 'PDF Document', size: '5 MB', downloadUrl: '#', previewText: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.saveStudyMaterial(formData);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete study material?')) api.deleteStudyMaterial(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Free Study Materials Hub</h1>
          <p className="text-xs text-ink/70">Upload or edit downloadable handbooks, past papers and videos.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-terracotta text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 uppercase">
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      <div className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden p-6 space-y-3">
        {studyMaterials.map((item) => (
          <div key={item.id} className="p-4 bg-ivory rounded-2xl flex items-center justify-between border">
            <div>
              <span className="bg-navy-deep text-gold text-[10px] font-bold px-2 py-0.5 rounded">{item.category}</span>
              <h4 className="font-serif font-bold text-sm text-navy-deep mt-1">{item.title}</h4>
              <p className="text-xs text-ink/60">{item.previewText}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-navy-deep shadow-2xl relative space-y-3">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <h3 className="font-serif text-lg font-bold text-navy-deep">Add Study Material</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" required placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border rounded-xl">
                <option value="Notes">Notes</option>
                <option value="Previous Papers">Previous Papers</option>
                <option value="Practice Sets">Practice Sets</option>
                <option value="Videos">Videos</option>
              </select>
              <input type="text" required placeholder="File Size (e.g. 4.8 MB)" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <textarea rows="3" placeholder="Preview Summary" value={formData.previewText} onChange={e => setFormData({ ...formData, previewText: e.target.value })} className="w-full p-2.5 border rounded-xl"></textarea>
              <button type="submit" className="w-full bg-terracotta text-white font-bold py-3 rounded-xl uppercase">Save Material</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
