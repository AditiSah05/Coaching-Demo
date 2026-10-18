"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { request } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../shared/schema';
import { Button, Card, PageHeader, FieldShell, useFeedback, fmtDate, focus } from '../../components/admin/ui';

const input = `w-full rounded-xl border border-navy-deep/20 bg-white px-3.5 py-2.5 text-sm ${focus}`;

export const AdminProfile = () => {
  const { user, refresh } = useAuth();
  const { toast } = useFeedback();
  const router = useRouter();
  const [f, setF] = useState({ current: '', next: '', again: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (f.next !== f.again) { setError('The two new passwords do not match.'); return; }
    setSaving(true);
    try {
      await request('/api/admin/password', { method: 'POST', body: { current: f.current, next: f.next } });
      toast('Password changed.'); setF({ current: '', next: '', again: '' });
      const was = user.mustChangePassword; await refresh(); if (was) router.replace('/admin');
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="My account" />
      <Card>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-ink/55">Name</dt><dd className="font-semibold text-navy-deep">{user.name}</dd></div>
          <div><dt className="text-ink/55">Email</dt><dd className="font-semibold text-navy-deep">{user.email}</dd></div>
          <div><dt className="text-ink/55">Role</dt><dd className="font-semibold text-navy-deep">{ROLES[user.role]?.label}</dd></div>
          <div><dt className="text-ink/55">Last sign-in</dt><dd className="font-semibold text-navy-deep">{user.lastLoginAt ? fmtDate(user.lastLoginAt, true) : 'This is your first'}</dd></div>
        </dl>
      </Card>
      <Card>
        <h2 className="font-serif text-xl font-semibold text-navy-deep">Change password</h2>
        <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
          <FieldShell id="p-cur" label="Current password" required><input id="p-cur" type="password" autoComplete="current-password" className={input} value={f.current} onChange={set('current')} /></FieldShell>
          <FieldShell id="p-new" label="New password" required help="At least 8 characters, with letters and numbers."><input id="p-new" type="password" autoComplete="new-password" className={input} value={f.next} onChange={set('next')} /></FieldShell>
          <FieldShell id="p-again" label="New password again" required><input id="p-again" type="password" autoComplete="new-password" className={input} value={f.again} onChange={set('again')} /></FieldShell>
          {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
          <Button type="submit" loading={saving}>Change password</Button>
        </form>
      </Card>
    </div>
  );
};
