"use client";

import React, { useState } from 'react';
import { Download, Search, Printer, CheckCircle2, XCircle, Clock, Trash2, Eye, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminAdmissions = () => {
  const { admissions, api } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    api.updateAdmissionStatus(id, newStatus);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete admission record permanently?')) {
      api.deleteAdmission(id);
      if (selectedAdmission?.id === id) setSelectedAdmission(null);
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "FullName", "Email", "Phone", "CourseName", "PCM%", "Status", "SubmittedAt"];
    const rows = admissions.map(a => [
      a.id,
      `"${a.fullName}"`,
      a.email,
      a.phone,
      `"${a.courseName}"`,
      a.pcmPercentage,
      a.status,
      a.submittedAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pma_admissions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = admissions.filter(a => 
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-deep">Admissions Portal Logs</h1>
          <p className="text-xs text-ink/70">Review student registrations, change status, and print receipts.</p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-seagreen hover:bg-seagreen/90 text-white font-bold px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5 text-xs uppercase tracking-wider self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> <span>Export CSV</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-ink/40 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID, Name or Course..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-navy-deep/20 bg-white focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-deep text-white text-xs font-serif uppercase tracking-wider">
                <th className="p-4">Reg ID</th>
                <th className="p-4">Cadet Name</th>
                <th className="p-4">Course</th>
                <th className="p-4">Contact</th>
                <th className="p-4">PCM %</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-deep/10 text-xs">
              {filtered.map((adm) => (
                <tr key={adm.id} className="hover:bg-ivory transition-colors">
                  <td className="p-4 font-mono font-bold text-navy-deep">{adm.id}</td>
                  <td className="p-4 font-bold text-navy-deep">{adm.fullName}</td>
                  <td className="p-4 font-semibold text-sea-blue">{adm.courseName}</td>
                  <td className="p-4 text-ink/70">{adm.phone}</td>
                  <td className="p-4 font-bold">{adm.pcmPercentage}</td>
                  <td className="p-4">
                    <select
                      value={adm.status}
                      onChange={(e) => handleStatusChange(adm.id, e.target.value)}
                      className={`p-1.5 rounded-lg font-bold text-[11px] focus:outline-none ${
                        adm.status === 'Approved' ? 'bg-seagreen text-white' :
                        adm.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-gold text-navy-deep'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedAdmission(adm)}
                      className="p-2 rounded-lg bg-sea-blue/10 text-navy-deep hover:bg-sea-blue hover:text-navy-deep"
                      title="View Detail Modal"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(adm.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                      title="Delete Record"
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

      {/* DETAIL MODAL */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-50 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-4 border-navy-deep shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedAdmission(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-ivory text-navy-deep"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-2">
              Admission Registration Summary
            </h3>

            <div className="space-y-2 text-xs">
              <p><strong>Registration ID:</strong> {selectedAdmission.id}</p>
              <p><strong>Full Name:</strong> {selectedAdmission.fullName}</p>
              <p><strong>Father's Name:</strong> {selectedAdmission.fatherName}</p>
              <p><strong>Contact:</strong> {selectedAdmission.email} | {selectedAdmission.phone}</p>
              <p><strong>Date of Birth:</strong> {selectedAdmission.dob}</p>
              <p><strong>PCM Aggregate:</strong> {selectedAdmission.pcmPercentage} | English: {selectedAdmission.englishPercentage}</p>
              <p><strong>Course Name:</strong> <span className="text-goldtext font-bold">{selectedAdmission.courseName}</span></p>
              <p><strong>Batch Preference:</strong> {selectedAdmission.batchPreference}</p>
              <p><strong>Hostel Required:</strong> {selectedAdmission.hostelRequired}</p>
            </div>

            {selectedAdmission.documentProof && (
              <div className="border p-2 rounded-xl text-center">
                <span className="text-[10px] text-sea-blue font-bold block mb-1">Uploaded Marksheet Document</span>
                {selectedAdmission.documentProof.startsWith('data:image') && (
                  <img src={selectedAdmission.documentProof} alt="Document Proof" className="h-32 mx-auto rounded object-cover" />
                )}
              </div>
            )}

            <div className="pt-4 border-t flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="bg-navy-deep text-gold font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Summary
              </button>
              <button
                onClick={() => setSelectedAdmission(null)}
                className="bg-terracotta text-navy-deep font-bold px-4 py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
