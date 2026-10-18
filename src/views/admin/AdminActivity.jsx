"use client";

import React, { useEffect, useState } from 'react';
import { request } from '../../services/api';
import { PageHeader, Spinner, Empty, fmtDate, useFeedback } from '../../components/admin/ui';

export const AdminActivity = () => {
  const { toast } = useFeedback();
  const [rows, setRows] = useState(null);
  useEffect(() => { request('/api/admin/activity').then((d) => setRows(d.activity)).catch((e) => { toast(e.message, 'error'); setRows([]); }); }, [toast]);
  return (
    <div>
      <PageHeader title="Activity log" subtitle="Who changed what, newest first. The last 300 actions are shown." />
      {rows === null ? <Spinner /> : rows.length === 0 ? <Empty title="No activity yet">Changes made in the admin will be listed here.</Empty> : (
        <div className="overflow-x-auto rounded-2xl border border-navy-deep/10 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wider text-ink/60"><tr><th className="px-4 py-3 font-semibold">When</th><th className="px-4 py-3 font-semibold">Who</th><th className="px-4 py-3 font-semibold">Action</th><th className="px-4 py-3 font-semibold">Item</th></tr></thead>
            <tbody className="divide-y divide-navy-deep/10">
              {rows.map((a) => <tr key={a.id}><td className="whitespace-nowrap px-4 py-2.5 text-ink/65">{fmtDate(a.at, true)}</td><td className="px-4 py-2.5 font-semibold text-navy-deep">{a.user}</td><td className="px-4 py-2.5">{a.action}</td><td className="px-4 py-2.5 text-ink/70">{a.target}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
