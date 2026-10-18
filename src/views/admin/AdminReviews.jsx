"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Check, X, Star, Pencil, Trash2, MessageSquareReply, Globe, Info } from 'lucide-react';
import { request } from '../../services/api';
import { Button, Badge, statusTone, PageHeader, Empty, Spinner, Modal, SchemaField, useFeedback, fmtDate, ago, focus } from '../../components/admin/ui';
import { COLLECTIONS } from '../../shared/schema';

const def = COLLECTIONS.reviews;
const tabs = ['pending', 'approved', 'rejected', 'all'];

const Stars = ({ n }) => <span className="text-goldtext" aria-label={`${n} out of 5`}>{'★'.repeat(n)}<span className="text-navy-deep/20">{'★'.repeat(5 - n)}</span></span>;

// Reviews written on the website wait here. Only the ones approved here are shown to visitors.
export const AdminReviews = () => {
  const { toast, confirm } = useFeedback();
  const [list, setList] = useState(null);
  const [tab, setTab] = useState('pending');
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { try { setList((await request('/api/admin/c/reviews')).records); } catch (e) { toast(e.message, 'error'); setList([]); } }, [toast]);
  useEffect(() => { load(); }, [load]);

  const patch = async (r, body, msg) => {
    try { await request(`/api/admin/c/reviews/${r.id}`, { method: 'PUT', body }); toast(msg); load(); } catch (e) { toast(e.message, 'error'); }
  };
  const remove = async (r) => {
    if (!(await confirm({ title: 'Delete this review?', message: `The review by ${r.name} will be deleted permanently.` }))) return;
    try { await request(`/api/admin/c/reviews/${r.id}`, { method: 'DELETE' }); toast('Deleted.'); load(); } catch (e) { toast(e.message, 'error'); }
  };
  const save = async () => {
    setSaving(true); setErrors({});
    try { await request(`/api/admin/c/reviews/${editing.id}`, { method: 'PUT', body: editing.draft }); toast('Changes saved.'); setEditing(null); load(); } catch (e) { setErrors(e.fields || {}); toast(e.message, 'error'); } finally { setSaving(false); }
  };

  const count = (s) => (s === 'all' ? list.length : list.filter((r) => r.status === s).length);
  const shown = list ? list.filter((r) => tab === 'all' || r.status === tab) : [];

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Reviews written on your website wait here. A review is shown to visitors only after you approve it." />
      <p className="mb-5 flex items-start gap-2 rounded-xl bg-ivory px-4 py-3 text-sm text-ink/70"><Info className="mt-0.5 h-4 w-4 shrink-0 text-goldtext" /> The website shows approved reviews of 4 stars and above. Lower ratings can be approved or kept here for your own records.</p>

      {list && (
        <div role="tablist" aria-label="Review status" className="mb-5 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold capitalize ${focus} ${tab === t ? 'border-navy-deep bg-navy-deep text-white' : 'border-navy-deep/20 bg-white text-navy-deep hover:border-gold'}`}>
              {t} <span className={`text-xs tabular-nums ${tab === t ? 'text-gold' : 'text-ink/45'}`}>{count(t)}</span>
            </button>
          ))}
        </div>
      )}

      {list === null ? <Spinner /> : shown.length === 0 ? <Empty title={tab === 'pending' ? 'No reviews are waiting' : `No ${tab} reviews`}>{tab === 'pending' ? 'When a visitor writes a review on the website, you will be notified and it will appear here.' : 'Nothing to show here yet.'}</Empty> : (
        <ul className="space-y-4">
          {shown.map((r) => (
            <li key={r.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${r.status === 'pending' ? 'border-gold/60' : 'border-navy-deep/10'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-navy-deep">{r.name}
                    {r.role && <span className="text-sm font-normal text-ink/55">{r.role}</span>}
                    <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                    {r.source === 'google' ? <Badge tone="blue"><Globe className="mr-1 h-3 w-3" />Google</Badge> : <Badge tone="gold">Website</Badge>}
                    {r.featured && <Badge tone="gold">Featured</Badge>}
                  </p>
                  <p className="mt-1 text-sm"><Stars n={r.rating} /> <span className="ml-2 text-xs text-ink/45" title={fmtDate(r.createdAt, true)}>{ago(r.createdAt)}</span></p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.status !== 'approved' && <Button onClick={() => patch(r, { status: 'approved' }, 'Approved. It is now on the website.')}><Check className="h-4 w-4" /> Approve</Button>}
                  {r.status !== 'rejected' && <Button variant="ghost" onClick={() => patch(r, { status: 'rejected' }, 'Rejected. It will not be shown.')}><X className="h-4 w-4" /> Reject</Button>}
                  {r.status === 'approved' && <Button variant="ghost" onClick={() => patch(r, { featured: !r.featured }, r.featured ? 'Unfeatured.' : 'Featured. It shows first.')}><Star className={`h-4 w-4 ${r.featured ? 'fill-gold text-gold' : ''}`} /> {r.featured ? 'Unfeature' : 'Feature'}</Button>}
                  <Button variant="quiet" aria-label={`Edit review by ${r.name}`} onClick={async () => { setErrors({}); const { record } = await request(`/api/admin/c/reviews/${r.id}`); setEditing({ id: r.id, draft: record }); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="quiet" className="text-red-600" aria-label={`Delete review by ${r.name}`} onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{r.text}</p>
              {r.reply && <p className="mt-3 flex gap-2 rounded-lg bg-ivory p-3 text-sm text-ink/75"><MessageSquareReply className="mt-0.5 h-4 w-4 shrink-0 text-goldtext" /> <span><strong className="text-navy-deep">Academy reply:</strong> {r.reply}</span></p>}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Modal title="Edit review" onClose={() => setEditing(null)} footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} loading={saving}>Save changes</Button></>}>
          <div className="grid gap-5 sm:grid-cols-2">
            {def.fields.map((f) => (
              <div key={f.key} className={['textarea'].includes(f.type) ? 'sm:col-span-2' : ''}>
                <SchemaField field={f} value={editing.draft[f.key]} onChange={(v) => setEditing((s) => ({ ...s, draft: { ...s.draft, [f.key]: v } }))} error={errors[f.key]} idPrefix="rev" />
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};
