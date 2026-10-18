"use client";

import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { SINGLETONS, allSettingFields, getPath, setPath } from '../../shared/schema';
import { request } from '../../services/api';
import { Button, Card, PageHeader, Spinner, SchemaField, useFeedback } from '../../components/admin/ui';

const toForm = (fields, record) => {
  const v = {};
  fields.forEach((f) => {
    const x = getPath(record, f.key);
    setPath(v, f.key, f.type === 'lines' && Array.isArray(x) ? x.join('\n') : x ?? (f.type === 'bool' ? false : ''));
  });
  return v;
};

// A form for one document (site settings, announcement bar), built from the shared schema.
export const AdminSingleton = ({ name, title, subtitle }) => {
  const def = SINGLETONS[name];
  const groups = def.groups || [{ title: null, fields: def.fields }];
  const fields = name === 'settings' ? allSettingFields() : def.fields;
  const { toast } = useFeedback();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { request(`/api/admin/singleton/${name}`).then((d) => setForm(toForm(fields, d.record))).catch((e) => toast(e.message, 'error')); }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const change = (key) => (v) => { setForm((f) => setPath(structuredClone(f), key, v)); setDirty(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setErrors({});
    try { await request(`/api/admin/singleton/${name}`, { method: 'PUT', body: form }); toast('Saved. The website now shows your changes.'); setDirty(false); } catch (err) { setErrors(err.fields || {}); toast(err.message, 'error'); } finally { setSaving(false); }
  };

  if (!form) return <Spinner />;

  return (
    <form onSubmit={save} noValidate>
      <PageHeader title={title || def.label} subtitle={subtitle} actions={<Button type="submit" loading={saving}><Save className="h-4 w-4" /> Save changes</Button>} />
      <div className="space-y-6">
        {groups.map((g) => (
          <Card key={g.title || 'main'}>
            {g.title && <h2 className="mb-4 font-serif text-xl font-semibold text-navy-deep">{g.title}</h2>}
            <div className="grid gap-5 sm:grid-cols-2">
              {g.fields.map((f) => (
                <div key={f.key} className={['textarea', 'lines'].includes(f.type) || f.key === 'tagline' || f.key.includes('Url') || f.key === 'mapEmbedUrl' ? 'sm:col-span-2' : ''}>
                  <SchemaField field={f} value={getPath(form, f.key)} onChange={change(f.key)} error={errors[f.key]} idPrefix={name} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-navy-deep/10 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <p className="text-sm text-ink/60">{dirty ? 'You have unsaved changes.' : 'All changes are saved.'}</p>
        <Button type="submit" loading={saving}><Save className="h-4 w-4" /> Save changes</Button>
      </div>
    </form>
  );
};
