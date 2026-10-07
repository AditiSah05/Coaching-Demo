import React from 'react';
import { Download, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminLeads = () => {
  const { leads } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-deep">Study Material Download Leads</h1>
        <p className="text-xs text-ink/70">Cadet phone & name captured from unlocked free handbooks.</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-navy-deep/10 shadow-chunky overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-deep text-white text-xs font-serif uppercase tracking-wider">
                <th className="p-4">Unlocked Date</th>
                <th className="p-4">Cadet Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
                <th className="p-4">Unlocked Handbook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-deep/10 text-xs">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-ivory transition-colors">
                  <td className="p-4 text-ink/50">{new Date(lead.downloadedAt).toLocaleString()}</td>
                  <td className="p-4 font-bold text-navy-deep">{lead.name}</td>
                  <td className="p-4 font-bold text-terracotta">{lead.phone}</td>
                  <td className="p-4 text-sea-blue">{lead.email || 'N/A'}</td>
                  <td className="p-4 font-semibold text-navy-deep">{lead.materialTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
