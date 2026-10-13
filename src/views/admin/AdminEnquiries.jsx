"use client";

import React from 'react';
import { Trash2, CheckCircle2, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminEnquiries = () => {
  const { enquiries, api } = useData();

  const handleStatus = (id, status) => {
    api.updateEnquiryStatus(id, status);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete enquiry?')) {
      api.deleteEnquiry(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-deep">Contact Enquiries Desk</h1>
        <p className="text-xs text-ink/70">Manage incoming lead messages from the public Contact page.</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-deep text-white text-xs font-serif uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Course</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-deep/10 text-xs">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-ivory transition-colors">
                  <td className="p-4 text-ink/50 whitespace-nowrap">{enq.date}</td>
                  <td className="p-4 font-bold text-navy-deep">{enq.name}</td>
                  <td className="p-4 text-sea-blue font-semibold">{enq.phone} | {enq.email}</td>
                  <td className="p-4">{enq.course}</td>
                  <td className="p-4 text-ink/70 max-w-xs">{enq.message}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleStatus(enq.id, enq.status === 'Contacted' ? 'Unread' : 'Contacted')}
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        enq.status === 'Contacted' ? 'bg-seagreen text-white' : 'bg-gold text-navy-deep'
                      }`}
                    >
                      {enq.status}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(enq.id)}
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
    </div>
  );
};
