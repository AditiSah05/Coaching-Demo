"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { request } from '../../services/api';
import { ROLES } from '../../shared/schema';
import { Button, Badge, PageHeader, Spinner, Modal, FieldShell, useFeedback, fmtDate, focus } from '../../components/admin/ui';
import { useAuth } from '../../context/AuthContext';

const input = `w-full rounded-xl border border-navy-deep/20 bg-white px-3.5 py-2.5 text-sm ${focus}`;

export const AdminUsers = () => {
  const { user: me } = useAuth();
  const { toast, confirm } = useFeedback();
  const [users, setUsers] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => { try { setUsers((await request('/api/admin/users')).users); } catch (e) { toast(e.message, 'error'); setUsers([]); } }, [toast]);
  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing.id) await request(`/api/admin/users/${editing.id}`, { method: 'PUT', body: editing });
      else await request('/api/admin/users', { method: 'POST', body: editing });
      toast(editing.id ? 'User updated.' : 'User added. They must change the password at first sign-in.'); setEditing(null); load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  const remove = async (u) => {
    if (!(await confirm({ title: 'Delete this user?', message: `${u.name} will no longer be able to sign in.` }))) return;
    try { await request(`/api/admin/users/${u.id}`, { method: 'DELETE' }); toast('Deleted.'); load(); } catch (e) { toast(e.message, 'error'); }
  };
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  return (
    <div>
      <PageHeader title="Users" subtitle="People who can sign in to this admin panel, and what each may do." actions={<Button onClick={() => { setError(''); setEditing({ name: '', email: '', role: 'editor', password: '', active: true }); }}><Plus className="h-4 w-4" /> Add user</Button>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {Object.entries(ROLES).map(([k, r]) => (
          <div key={k} className="rounded-xl border border-navy-deep/10 bg-white p-4 text-sm">
            <p className="font-semibold text-navy-deep">{r.label}</p>
            <p className="mt-1 text-xs text-ink/60">{k === 'superadmin' ? 'Everything, including users, settings and backups.' : k === 'editor' ? 'Courses, blog, gallery, videos, materials, forms, results, team, FAQs, announcement bar, media and reviews.' : 'Enquiries, admissions and reviews only.'}</p>
          </div>
        ))}
      </div>
      {users === null ? <Spinner /> : (
        <div className="overflow-x-auto rounded-2xl border border-navy-deep/10 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wider text-ink/60"><tr><th className="px-4 py-3 font-semibold">Name</th><th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Last sign-in</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-navy-deep/10">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3"><p className="font-semibold text-navy-deep">{u.name}{u.id === me.id && <span className="ml-2 text-xs font-normal text-ink/50">(you)</span>}</p><p className="text-xs text-ink/55">{u.email}</p></td>
                  <td className="px-4 py-3">{ROLES[u.role]?.label}</td>
                  <td className="px-4 py-3">{u.active ? <Badge tone="green">Active</Badge> : <Badge tone="gray">Off</Badge>}</td>
                  <td className="px-4 py-3 text-ink/65">{u.lastLoginAt ? fmtDate(u.lastLoginAt, true) : 'Never'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button onClick={() => { setError(''); setEditing({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, password: '' }); }} aria-label={`Edit ${u.name}`} className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-navy-deep/8 ${focus}`}><Pencil className="h-4 w-4" /></button>
                    {u.id !== me.id && <button onClick={() => remove(u)} aria-label={`Delete ${u.name}`} className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-red-600 hover:bg-red-50 ${focus}`}><Trash2 className="h-4 w-4" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'Edit user' : 'Add user'} onClose={() => setEditing(null)} narrow footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} loading={saving}>{editing.id ? 'Save changes' : 'Add user'}</Button></>}>
          <form onSubmit={save} className="space-y-4" noValidate>
            <FieldShell id="u-name" label="Name" required><input id="u-name" className={input} value={editing.name} onChange={set('name')} /></FieldShell>
            <FieldShell id="u-email" label="Email" required><input id="u-email" type="email" className={input} value={editing.email} onChange={set('email')} disabled={!!editing.id} /></FieldShell>
            <FieldShell id="u-role" label="Role"><select id="u-role" className={input} value={editing.role} onChange={set('role')}>{Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}</select></FieldShell>
            <FieldShell id="u-pass" label={editing.id ? 'New password (leave empty to keep)' : 'Starting password'} required={!editing.id} help="At least 8 characters with letters and numbers. They will be asked to change it."><input id="u-pass" type="password" autoComplete="new-password" className={input} value={editing.password} onChange={set('password')} /></FieldShell>
            {editing.id && <label className="flex items-center gap-2 text-sm font-semibold text-navy-deep"><input type="checkbox" checked={editing.active} onChange={set('active')} className="h-4 w-4 accent-navy-deep" /> Account is active</label>}
            {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
            <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
          </form>
        </Modal>
      )}
    </div>
  );
};
