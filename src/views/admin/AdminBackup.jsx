"use client";

import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { request } from '../../services/api';
import { Button, Card, PageHeader, useFeedback } from '../../components/admin/ui';

const sections = [
  ['courses', 'Courses'], ['blogs', 'Blog posts'], ['gallery', 'Photo gallery'], ['videos', 'Video gallery'], ['studyMaterials', 'Study materials'],
  ['forms', 'Exam forms'], ['resultPosters', 'Result posters'], ['faculty', 'Team'], ['faqs', 'FAQs'], ['banners', 'Announcement bar'], ['settings', 'Site settings'],
];

export const AdminBackup = () => {
  const { toast, confirm } = useFeedback();
  const file = useRef(null);
  const [busy, setBusy] = useState(false);

  const restore = async (f) => {
    if (!f) return;
    let parsed;
    try { parsed = JSON.parse(await f.text()); } catch { toast('That file is not a valid backup.', 'error'); return; }
    if (!(await confirm({ title: 'Restore this backup?', message: 'The sections in the file will replace what is on the site now. Download a fresh backup first if you may want to go back.', confirmLabel: 'Restore', danger: false }))) { file.current.value = ''; return; }
    setBusy(true);
    try { const r = await request('/api/admin/backup', { method: 'POST', body: parsed }); toast(`Restored: ${r.restored.join(', ')}.`); } catch (e) { toast(e.message, 'error'); } finally { setBusy(false); file.current.value = ''; }
  };

  const reset = async ([key, label]) => {
    if (!(await confirm({ title: `Reset "${label}"?`, message: `Everything in ${label} goes back to how it was when the site was first set up. Your changes to it are lost.`, confirmLabel: 'Reset' }))) return;
    try { await request('/api/admin/reset', { method: 'POST', body: { collection: key } }); toast(`${label} reset.`); } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Backup and restore" subtitle="Keep a copy of your content, or go back to an earlier one." />
      <Card>
        <h2 className="font-serif text-xl font-semibold text-navy-deep">Download a backup</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink/65">One file with all your content, enquiries, admissions and reviews. It does not include user accounts or passwords, and uploaded images stay in the media library.</p>
        <a href="/api/admin/backup" className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-full bg-navy-deep px-5 text-sm font-semibold text-white hover:bg-navy-light"><Download className="h-4 w-4" /> Download backup</a>
      </Card>
      <Card>
        <h2 className="font-serif text-xl font-semibold text-navy-deep">Restore from a backup</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink/65">Choose a backup file you downloaded earlier. The sections inside it replace the current ones. User accounts are never changed.</p>
        <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={(e) => restore(e.target.files?.[0])} />
        <Button variant="ghost" className="mt-4" loading={busy} onClick={() => file.current?.click()}><Upload className="h-4 w-4" /> Choose backup file</Button>
      </Card>
      <Card>
        <h2 className="font-serif text-xl font-semibold text-navy-deep">Reset a section to its starting content</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink/65">Use this if a section got into a mess. Enquiries, admissions and reviews cannot be reset here.</p>
        <ul className="mt-4 flex flex-wrap gap-2">{sections.map((s) => <li key={s[0]}><Button variant="ghost" onClick={() => reset(s)}><RotateCcw className="h-3.5 w-3.5" /> {s[1]}</Button></li>)}</ul>
      </Card>
    </div>
  );
};
