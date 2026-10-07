import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, MessageSquare, Users, Award, BookOpen, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useData } from '../../context/DataContext';

export const AdminDashboard = () => {
  const { admissions, enquiries, leads, results, courses } = useData();

  // Monthly admissions sample chart dataset
  const monthlyData = [
    { month: 'Oct', admissions: 12 },
    { month: 'Nov', admissions: 18 },
    { month: 'Dec', admissions: 25 },
    { month: 'Jan', admissions: 34 },
    { month: 'Feb', admissions: 42 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-navy-deep">Academy Overview Dashboard</h1>
        <p className="text-xs text-ink/70">Welcome back, Captain Administrator. Here is your institute activity stream.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 shadow-chunky flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink/60 uppercase tracking-wider block">Total Applications</span>
            <span className="font-serif text-3xl font-bold text-navy-deep block mt-1">{admissions.length}</span>
            <span className="text-[10px] text-seagreen font-semibold">Active Portal Logs</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sea-blue/20 text-navy-deep flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 shadow-chunky flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink/60 uppercase tracking-wider block">Direct Enquiries</span>
            <span className="font-serif text-3xl font-bold text-navy-deep block mt-1">{enquiries.length}</span>
            <span className="text-[10px] text-terracotta font-semibold">Leads Pending Call</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-terracotta/20 text-terracotta flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 shadow-chunky flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink/60 uppercase tracking-wider block">Study Hub Leads</span>
            <span className="font-serif text-3xl font-bold text-navy-deep block mt-1">{leads.length}</span>
            <span className="text-[10px] text-seagreen font-semibold">Downloads Unlocked</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/20 text-navy-deep flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 shadow-chunky flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink/60 uppercase tracking-wider block">Published Results</span>
            <span className="font-serif text-3xl font-bold text-navy-deep block mt-1">{results.length}</span>
            <span className="text-[10px] text-sea-blue font-semibold">Rank Merit Records</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-navy-light/20 text-navy-deep flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 shadow-chunky space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-serif text-xl font-bold text-navy-deep">Monthly Cadet Admissions Growth</h2>
          <span className="text-xs text-sea-blue font-bold">2025-26 Session</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#14213D' }} />
              <YAxis tick={{ fontSize: 12, fill: '#14213D' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B2545', color: '#FFF', borderRadius: '12px', border: 'none' }}
              />
              <Bar dataKey="admissions" fill="#E4572E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Admissions */}
        <div className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 shadow-chunky space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif text-lg font-bold text-navy-deep">Recent Admission Forms</h3>
            <Link to="/admin/admissions" className="text-xs text-terracotta font-bold flex items-center gap-1">
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {admissions.slice(0, 4).map((adm) => (
              <div key={adm.id} className="p-3 bg-ivory rounded-2xl flex items-center justify-between text-xs border border-navy-deep/5">
                <div>
                  <span className="font-bold text-navy-deep block">{adm.fullName}</span>
                  <span className="text-[10px] text-ink/60">{adm.courseName}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    adm.status === 'Approved' ? 'bg-seagreen text-white' : 'bg-gold text-navy-deep'
                  }`}>
                    {adm.status}
                  </span>
                  <span className="text-[10px] text-ink/50 block mt-0.5">{adm.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white p-6 rounded-3xl border-2 border-navy-deep/10 shadow-chunky space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif text-lg font-bold text-navy-deep">Recent Contact Enquiries</h3>
            <Link to="/admin/enquiries" className="text-xs text-terracotta font-bold flex items-center gap-1">
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 4).map((enq) => (
              <div key={enq.id} className="p-3 bg-ivory rounded-2xl flex items-center justify-between text-xs border border-navy-deep/5">
                <div>
                  <span className="font-bold text-navy-deep block">{enq.name} ({enq.phone})</span>
                  <span className="text-[10px] text-ink/60 line-clamp-1">{enq.message}</span>
                </div>
                <span className="bg-sea-blue/20 text-navy-deep font-bold px-2 py-0.5 rounded text-[10px] shrink-0">
                  {enq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
