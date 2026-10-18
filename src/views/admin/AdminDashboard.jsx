"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, UserCheck, Star, Newspaper, ArrowRight, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { request } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, PageHeader, Spinner, Badge, statusTone, ago, focus, useFeedback } from '../../components/admin/ui';

const Stat = ({ icon: Icon, label, value, sub, href, delta }) => (
  <Link href={href} className={`group block rounded-2xl border border-navy-deep/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-chunky ${focus}`}>
    <div className="flex items-start justify-between">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-light text-goldtext"><Icon className="h-5 w-5" /></span>
      {delta != null && delta !== 0 && (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${delta > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
          {delta > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{Math.abs(delta)} vs last week
        </span>
      )}
    </div>
    <p className="mt-4 font-serif text-4xl font-semibold text-navy-deep">{value}</p>
    <p className="mt-1 text-sm font-semibold text-navy-deep">{label}</p>
    {sub && <p className="text-xs text-ink/55">{sub}</p>}
  </Link>
);

const List = ({ title, href, items, render, empty }) => (
  <Card>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-serif text-xl font-semibold text-navy-deep">{title}</h2>
      <Link href={href} className={`inline-flex items-center gap-1 text-xs font-semibold text-navy-deep underline decoration-gold underline-offset-2 ${focus}`}>View all <ArrowRight className="h-3 w-3" /></Link>
    </div>
    {items?.length ? <ul className="divide-y divide-navy-deep/10">{items.map(render)}</ul> : <p className="py-6 text-center text-sm text-ink/50">{empty}</p>}
  </Card>
);

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useFeedback();
  const [d, setD] = useState(null);

  useEffect(() => { request('/api/admin/dashboard').then(setD).catch((e) => toast(e.message, 'error')); }, [toast]);
  if (!d) return <Spinner />;
  const c = d.counts;
  const hasChart = c.enquiries || c.admissions;

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="What is happening at the academy, and what needs you." />

      {d.attention.length > 0 ? (
        <Card className="border-gold/50 bg-gold-light/40">
          <h2 className="mb-2 flex items-center gap-2 font-serif text-xl font-semibold text-navy-deep"><AlertTriangle className="h-5 w-5 text-goldtext" /> Needs your attention</h2>
          <ul className="flex flex-wrap gap-2">
            {d.attention.map((a) => <li key={a.text}><Link href={a.link} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${focus} ${a.urgent ? 'bg-red-600 text-white' : 'bg-white text-navy-deep hover:bg-navy-deep hover:text-white'}`}>{a.text} <ArrowRight className="h-3.5 w-3.5" /></Link></li>)}
          </ul>
        </Card>
      ) : (
        <Card className="flex items-center gap-3 text-sm text-ink/70"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Everything is up to date. Nothing is waiting for you.</Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {c.enquiries && <Stat icon={MessageSquare} label="Enquiries" value={c.enquiries.total} sub={`${c.enquiries.open} new, ${c.enquiries.week} this week`} href="/admin/enquiries" delta={c.enquiries.week - c.enquiries.prevWeek} />}
        {c.admissions && <Stat icon={UserCheck} label="Admission applications" value={c.admissions.total} sub={`${c.admissions.open} pending, ${c.admissions.week} this week`} href="/admin/admissions" delta={c.admissions.week - c.admissions.prevWeek} />}
        {c.reviews && <Stat icon={Star} label="Reviews" value={c.reviews.approved} sub={`${c.reviews.open} waiting for approval`} href="/admin/reviews" />}
        {c.blogs && <Stat icon={Newspaper} label="Blog posts" value={c.blogs.total} sub={`${c.blogs.drafts} draft${c.blogs.drafts === 1 ? '' : 's'}`} href="/admin/blogs" />}
      </div>

      {hasChart && (
        <Card>
          <h2 className="font-serif text-xl font-semibold text-navy-deep">Last 14 days</h2>
          <p className="mb-3 text-xs text-ink/55">New enquiries and admission applications per day.</p>
          <div className="h-64" role="img" aria-label="Line chart of enquiries and admissions over the last 14 days">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.series} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,21,39,0.08)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#3A3A3A' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#3A3A3A' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(2,21,39,0.1)', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {c.enquiries && <Area type="monotone" dataKey="enquiries" name="Enquiries" stroke="#BFA888" fill="#BFA888" fillOpacity={0.25} strokeWidth={2} />}
                {c.admissions && <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#021527" fill="#021527" fillOpacity={0.12} strokeWidth={2} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {d.recent.enquiries && <List title="Latest enquiries" href="/admin/enquiries" items={d.recent.enquiries} empty="No enquiries yet." render={(e) => (
          <li key={e.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-navy-deep">{e.name}</p><p className="truncate text-xs text-ink/55">{e.course || 'General'} · {e.phone}</p></div><div className="shrink-0 text-right"><Badge tone={statusTone(e.status)}>{e.status}</Badge><p className="mt-1 text-[11px] text-ink/45">{ago(e.createdAt)}</p></div></li>
        )} />}
        {d.recent.admissions && <List title="Latest applications" href="/admin/admissions" items={d.recent.admissions} empty="No applications yet." render={(a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-navy-deep">{a.fullName}</p><p className="truncate text-xs text-ink/55">{a.courseName} · {a.phone}</p></div><div className="shrink-0 text-right"><Badge tone={statusTone(a.status)}>{a.status}</Badge><p className="mt-1 text-[11px] text-ink/45">{ago(a.createdAt)}</p></div></li>
        )} />}
        {d.recent.reviews && <List title="Reviews to approve" href="/admin/reviews" items={d.recent.reviews} empty="No reviews waiting." render={(r) => (
          <li key={r.id} className="py-3"><p className="text-sm font-semibold text-navy-deep">{r.name} <span className="text-goldtext">{'★'.repeat(r.rating)}</span></p><p className="line-clamp-2 text-xs text-ink/65">{r.text}</p></li>
        )} />}
        {d.health.length > 0 && (
          <Card>
            <h2 className="mb-3 font-serif text-xl font-semibold text-navy-deep">Site checklist</h2>
            <ul className="space-y-2">{d.health.map((h) => <li key={h.text}><Link href={h.link} className={`flex items-center justify-between gap-3 rounded-lg bg-ivory px-3.5 py-2.5 text-sm text-navy-deep hover:bg-gold-light ${focus}`}>{h.text} <ArrowRight className="h-4 w-4 shrink-0" /></Link></li>)}</ul>
          </Card>
        )}
      </div>
    </div>
  );
};
