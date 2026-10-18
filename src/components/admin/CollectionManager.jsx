"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Download, ExternalLink, Phone, MessageCircle, Mail, Star, EyeOff } from 'lucide-react';
import { COLLECTIONS } from '../../shared/schema';
import { request } from '../../services/api';
import {
  Button, Modal, Badge, statusTone, PageHeader, Empty, Spinner, SchemaField, useFeedback, fmtDate, downloadCsv, focus,
} from './ui';

const blank = (def) => {
  const v = {};
  for (const f of def.fields) {
    if (f.type === 'bool') v[f.key] = f.default ?? false;
    else if (f.type === 'select') v[f.key] = f.default ?? f.options[0];
    else if (f.type === 'number') v[f.key] = f.default ?? '';
    else if (f.type === 'lines') v[f.key] = '';
    else v[f.key] = '';
  }
  if (def.fields.some((f) => f.key === 'date' && f.type === 'date')) v.date = new Date().toISOString().slice(0, 10);
  return v;
};

const toDraft = (def, rec) => {
  const v = { ...blank(def) };
  for (const f of def.fields) {
    const x = rec[f.key];
    if (x === undefined || x === null) continue;
    v[f.key] = f.type === 'lines' && Array.isArray(x) ? x.join('\n') : x;
  }
  return v;
};

const cell = (def, key, rec, ctx) => {
  const f = def.fields.find((x) => x.key === key);
  const v = rec[key];
  if (key === 'thumb') return rec.ytId ? <img src={`https://i.ytimg.com/vi/${rec.ytId}/default.jpg`} alt="" className="h-12 w-20 rounded-md object-cover" /> : null;
  if (!f) return v ?? '';
  if (f.type === 'image') return v ? <img src={v} alt="" className="h-12 w-16 rounded-md border border-navy-deep/10 bg-white object-cover" /> : <span className="text-ink/30">None</span>;
  if (key === ctx.statusKey) {
    return (
      <select
        value={v || ''}
        aria-label={`${f.label} of ${rec[def.titleField]}`}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => ctx.quickStatus(rec, e.target.value)}
        className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${focus} ${{ green: 'bg-emerald-100 text-emerald-800', amber: 'bg-amber-100 text-amber-800', blue: 'bg-sky-100 text-sky-800', red: 'bg-red-100 text-red-800', gray: 'bg-navy-deep/8 text-navy-deep/80' }[statusTone(v)]}`}
      >
        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (f.type === 'select') return <Badge tone={statusTone(v)}>{v}</Badge>;
  if (f.type === 'bool') return v ? <Badge tone="green">Yes</Badge> : <span className="text-ink/30">No</span>;
  if (f.type === 'date') return v ? fmtDate(v) : <span className="text-ink/30">None</span>;
  if (f.type === 'lines') return Array.isArray(v) && v.length ? `${v.length} item${v.length > 1 ? 's' : ''}` : '';
  if (f.type === 'url') return v ? <a href={v} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-navy-deep underline decoration-gold underline-offset-2">Open <ExternalLink className="h-3 w-3" /></a> : <span className="text-ink/30">None</span>;
  if (key === 'rating') return <span className="font-semibold">{v}★</span>;
  const s = String(v ?? '');
  return s.length > 70 ? `${s.slice(0, 67)}…` : s;
};

// A table and an editor for one kind of record, built entirely from the shared schema.
export const CollectionManager = ({ name, title, subtitle, statusKey, exportCsv, createLabel, previewHref, intro }) => {
  const def = COLLECTIONS[name];
  const { toast, confirm } = useFeedback();
  const [records, setRecords] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [tab, setTab] = useState('All');
  const [editing, setEditing] = useState(null); // { id|null, draft }
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setRecords((await request(`/api/admin/c/${name}`)).records); } catch (e) { toast(e.message, 'error'); setRecords([]); }
  }, [name, toast]);
  useEffect(() => { load(); }, [load]);

  const filterField = def.fields.find((f) => f.list);
  const statusField = statusKey && def.fields.find((f) => f.key === statusKey);
  const options = useMemo(() => (filterField && records ? [...new Set(records.map((r) => r[filterField.key]).filter(Boolean))].sort() : []), [records, filterField]);
  const suggest = (key) => (records ? [...new Set(records.map((r) => r[key]).filter(Boolean))].sort() : []);

  const shown = useMemo(() => {
    if (!records) return [];
    const needle = q.trim().toLowerCase();
    return records.filter((r) =>
      (!filterField || filter === 'All' || r[filterField.key] === filter) &&
      (!statusField || tab === 'All' || r[statusKey] === tab) &&
      (!needle || JSON.stringify(r).toLowerCase().includes(needle)));
  }, [records, q, filter, tab, filterField, statusField, statusKey]);

  const openNew = () => { setErrors({}); setEditing({ id: null, draft: blank(def) }); };
  const openEdit = async (rec) => {
    setErrors({});
    try {
      const { record } = await request(`/api/admin/c/${name}/${rec.id}`);
      setEditing({ id: rec.id, draft: toDraft(def, record), raw: record });
    } catch (e) { toast(e.message, 'error'); }
  };

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true); setErrors({});
    try {
      if (editing.id) await request(`/api/admin/c/${name}/${editing.id}`, { method: 'PUT', body: editing.draft });
      else await request(`/api/admin/c/${name}`, { method: 'POST', body: editing.draft });
      toast(editing.id ? 'Changes saved.' : `${def.singular[0].toUpperCase()}${def.singular.slice(1)} added.`);
      setEditing(null);
      load();
    } catch (err) {
      setErrors(err.fields || {});
      toast(err.message, 'error');
    } finally { setSaving(false); }
  };

  const remove = async (rec) => {
    const label = rec[def.titleField] || def.singular;
    if (!(await confirm({ title: `Delete this ${def.singular}?`, message: `"${label}" will be removed permanently. This cannot be undone.` }))) return;
    try { await request(`/api/admin/c/${name}/${rec.id}`, { method: 'DELETE' }); toast('Deleted.'); setEditing(null); load(); } catch (e) { toast(e.message, 'error'); }
  };

  const quickStatus = async (rec, value) => {
    try { await request(`/api/admin/c/${name}/${rec.id}`, { method: 'PUT', body: { [statusKey]: value } }); setRecords((rs) => rs.map((r) => (r.id === rec.id ? { ...r, [statusKey]: value } : r))); toast('Status updated.'); } catch (e) { toast(e.message, 'error'); }
  };

  const exportAll = () => {
    const fields = def.fields;
    downloadCsv(`${name}-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Received', ...fields.map((f) => f.label)],
      ...shown.map((r) => [fmtDate(r.createdAt, true), ...fields.map((f) => (Array.isArray(r[f.key]) ? r[f.key].join('; ') : r[f.key]))]),
    ]);
  };

  const set = (key) => (v) => {
    setEditing((s) => ({ ...s, draft: { ...s.draft, [key]: v } }));
    // For videos, fill in the title from YouTube as soon as a valid link is pasted.
    if (name === 'videos' && key === 'url' && /(youtu\.be\/|youtube\.com\/)/.test(v)) {
      request(`/api/admin/youtube?url=${encodeURIComponent(v)}`).then((d) => {
        if (d.title) setEditing((s) => (s && !s.draft.title ? { ...s, draft: { ...s.draft, title: d.title } } : s));
      }).catch(() => {});
    }
  };
  const raw = editing?.raw;
  const isInbound = !!def.inbound;
  const isNew = (r) => r[statusKey] === 'New' || r[statusKey] === 'Pending';
  const counts = (v) => records.filter((r) => r[statusKey] === v).length;

  return (
    <div>
      <PageHeader
        title={title || def.label}
        subtitle={subtitle}
        actions={<>
          {exportCsv && <Button variant="ghost" onClick={exportAll} disabled={!shown.length}><Download className="h-4 w-4" /> Export CSV</Button>}
          <Button onClick={openNew}><Plus className="h-4 w-4" /> {createLabel || `Add ${def.singular}`}</Button>
        </>}
      />
      {intro}

      {statusField && records && (
        <div role="tablist" aria-label={`${def.label} status`} className="mb-4 flex flex-wrap gap-2">
          {['All', ...statusField.options].map((o) => (
            <button key={o} role="tab" aria-selected={tab === o} onClick={() => setTab(o)} className={`inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold ${focus} ${tab === o ? 'border-navy-deep bg-navy-deep text-white' : 'border-navy-deep/20 bg-white text-navy-deep hover:border-gold'}`}>
              {o} <span className={`text-xs tabular-nums ${tab === o ? 'text-gold' : 'text-ink/45'}`}>{o === 'All' ? records.length : counts(o)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${def.label.toLowerCase()}`} aria-label={`Search ${def.label}`} className={`w-full rounded-full border border-navy-deep/20 bg-white py-2.5 pl-10 pr-4 text-sm ${focus}`} />
        </div>
        {filterField && options.length > 1 && (
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label={`Filter by ${filterField.label}`} className={`rounded-full border border-navy-deep/20 bg-white px-4 py-2.5 text-sm ${focus}`}>
            <option value="All">All {filterField.label.toLowerCase()}s</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
        {records && <span className="text-sm text-ink/55">{shown.length} of {records.length}</span>}
      </div>

      {records === null ? <Spinner /> : shown.length === 0 ? (
        <Empty title={records.length ? 'Nothing matches your search' : `No ${def.label.toLowerCase()} yet`}>
          {records.length ? 'Try a different word or clear the filters.' : isInbound ? 'They will appear here as soon as visitors send them from the website.' : `Click "${createLabel || `Add ${def.singular}`}" to create the first one.`}
        </Empty>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-deep/10 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wider text-ink/60">
              <tr>
                {isInbound && <th scope="col" className="px-4 py-3 font-semibold">Received</th>}
                {def.columns.map((c) => <th key={c} scope="col" className="px-4 py-3 font-semibold">{c === 'thumb' ? 'Preview' : def.fields.find((f) => f.key === c)?.label || c}</th>)}
                <th scope="col" className="px-4 py-3 text-right font-semibold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-deep/10">
              {shown.map((r) => (
                <tr key={r.id} onClick={() => openEdit(r)} className="cursor-pointer align-middle transition-colors hover:bg-ivory/70">
                  {isInbound && <td className="whitespace-nowrap px-4 py-3 text-ink/65">{isNew(r) && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gold align-middle" aria-label="New" />}{fmtDate(r.createdAt)}</td>}
                  {def.columns.map((c, i) => (
                    <td key={c} className={`px-4 py-3 ${i === 0 ? 'font-semibold text-navy-deep' : 'text-ink/80'}`}>
                      <span className="inline-flex flex-wrap items-center gap-2">
                        {cell(def, c, r, { statusKey, quickStatus })}
                        {i === 0 && r.visible === false && <Badge tone="gray"><EyeOff className="mr-1 h-3 w-3" />Hidden</Badge>}
                        {i === 0 && r.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-label="Featured" />}
                      </span>
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(r); }} aria-label={`Edit ${r[def.titleField] || def.singular}`} className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-navy-deep hover:bg-navy-deep/8 ${focus}`}><Pencil className="h-4 w-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); remove(r); }} aria-label={`Delete ${r[def.titleField] || def.singular}`} className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-red-600 hover:bg-red-50 ${focus}`}><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal
          title={editing.id ? `Edit ${def.singular}` : `New ${def.singular}`}
          onClose={() => setEditing(null)}
          wide={def.fields.some((f) => f.type === 'html')}
          footer={<>
            {editing.id && <Button variant="quiet" className="mr-auto text-red-600" onClick={() => remove({ id: editing.id, ...raw })}><Trash2 className="h-4 w-4" /> Delete</Button>}
            {previewHref && editing.id && raw?.slug && <a href={`${previewHref}${raw.slug}`} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-sm font-semibold text-navy-deep underline decoration-gold underline-offset-4 ${focus}`}>View on site <ExternalLink className="h-3.5 w-3.5" /></a>}
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editing.id ? 'Save changes' : `Add ${def.singular}`}</Button>
          </>}
        >
          {isInbound && editing.id && raw && (
            <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl bg-ivory p-3 text-sm">
              <span className="mr-2 text-ink/60">Received {fmtDate(raw.createdAt, true)}</span>
              {raw.phone && <a href={`tel:${raw.phone}`} className={`inline-flex items-center gap-1.5 rounded-full bg-navy-deep px-3.5 py-1.5 font-semibold text-white ${focus}`}><Phone className="h-3.5 w-3.5" /> Call</a>}
              {raw.phone && <a href={`https://wa.me/${String(raw.phone).replace(/\D/g, '').replace(/^0/, '91').replace(/^(\d{10})$/, '91$1')}`} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 rounded-full border border-navy-deep/25 px-3.5 py-1.5 font-semibold text-navy-deep ${focus}`}><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>}
              {raw.email && <a href={`mailto:${raw.email}`} className={`inline-flex items-center gap-1.5 rounded-full border border-navy-deep/25 px-3.5 py-1.5 font-semibold text-navy-deep ${focus}`}><Mail className="h-3.5 w-3.5" /> Email</a>}
            </div>
          )}
          <form onSubmit={save} noValidate className="grid gap-5 sm:grid-cols-2">
            {def.fields.map((f) => (
              <div key={f.key} className={['textarea', 'lines', 'html', 'image'].includes(f.type) || f.key === 'title' ? 'sm:col-span-2' : ''}>
                <SchemaField field={f} value={editing.draft[f.key]} onChange={set(f.key)} error={errors[f.key]} suggestions={f.list ? suggest(f.key) : []} idPrefix={name} />
              </div>
            ))}
            <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
          </form>
        </Modal>
      )}
    </div>
  );
};
