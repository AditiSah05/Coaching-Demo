"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, CheckCircle2, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminCourses = () => {
  const { courses, api } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Entrance Exam',
    duration: '',
    mode: 'Offline',
    fee: '',
    badge: 'Popular',
    description: '',
    eligibility: '',
    targetExam: '',
    syllabusText: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      category: 'Entrance Exam',
      duration: '',
      mode: 'Offline',
      fee: '',
      badge: 'Popular',
      description: '',
      eligibility: '',
      targetExam: '',
      syllabusText: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      category: course.category || 'Entrance Exam',
      duration: course.duration || '',
      mode: course.mode || 'Offline',
      fee: course.fee || '',
      badge: course.badge || '',
      description: course.description || '',
      eligibility: course.eligibility || '',
      targetExam: course.targetExam || '',
      syllabusText: (course.syllabus || []).join('\n')
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      api.deleteCourse(id);
      showToast('Course deleted successfully!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const syllabusArray = formData.syllabusText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      ...(editingCourse ? { id: editingCourse.id } : {}),
      title: formData.title,
      category: formData.category,
      duration: formData.duration,
      mode: formData.mode,
      fee: formData.fee,
      badge: formData.badge,
      description: formData.description,
      eligibility: formData.eligibility,
      targetExam: formData.targetExam,
      syllabus: syllabusArray
    };

    api.saveCourse(payload);
    setModalOpen(false);
    showToast(editingCourse ? 'Course updated successfully!' : 'New course added!');
  };

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-seagreen text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Courses Management</h1>
          <p className="text-xs text-ink/70">Add, edit, or remove Merchant Navy entrance programs.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-terracotta hover:bg-terracotta-hover text-navy-deep font-bold px-5 py-2.5 rounded-xl shadow-terracotta flex items-center gap-1.5 text-xs uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> <span>Add New Course</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-ink/40 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search course title..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-navy-deep/20 bg-white focus:outline-none"
        />
      </div>

      {/* List Table / Stacked Cards on Mobile */}
      <div className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-deep text-white text-xs font-serif uppercase tracking-wider">
                <th className="p-4">Course Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Badge</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-deep/10 text-xs">
              {filtered.map((course) => (
                <tr key={course.id} className="hover:bg-ivory transition-colors">
                  <td className="p-4 font-bold text-navy-deep">{course.title}</td>
                  <td className="p-4 text-sea-blue font-semibold">{course.category}</td>
                  <td className="p-4">{course.duration}</td>
                  <td className="p-4 font-bold text-goldtext">{course.fee}</td>
                  <td className="p-4">
                    <span className="bg-gold/20 text-navy-deep font-bold px-2 py-0.5 rounded text-[10px]">
                      {course.badge}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-2 rounded-lg bg-sea-blue/10 text-navy-deep hover:bg-sea-blue hover:text-navy-deep"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-4 border-navy-deep shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-ivory text-navy-deep"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-3 mb-4">
              {editingCourse ? 'Edit Course Program' : 'Add New Course Program'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-deep mb-1">Course Title*</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-deep mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                  >
                    <option value="Entrance Exam">Entrance Exam</option>
                    <option value="Deck Cadets">Deck Cadets</option>
                    <option value="Pre-Sea Training">Pre-Sea Training</option>
                    <option value="Engine Cadets">Engine Cadets</option>
                    <option value="Crash Course">Crash Course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-deep mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 6 Months"
                    className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-deep mb-1">Fee</label>
                  <input
                    type="text"
                    required
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    placeholder="e.g. ₹48,000"
                    className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-deep mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Best Seller"
                    className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-deep mb-1">Target Exam</label>
                  <input
                    type="text"
                    value={formData.targetExam}
                    onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                    placeholder="e.g. IMU-CET Aug Cycle"
                    className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deep mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deep mb-1">Syllabus Items (One per line)</label>
                <textarea
                  rows="4"
                  value={formData.syllabusText}
                  onChange={(e) => setFormData({ ...formData, syllabusText: e.target.value })}
                  placeholder="Physics Mechanics&#10;Mathematics Calculus&#10;Chemistry Organic"
                  className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                ></textarea>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-ivory text-ink text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-terracotta text-navy-deep font-bold text-xs uppercase tracking-wider shadow-terracotta"
                >
                  Save Course
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
