"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { KeyRound, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

export const AdminLogin = ({ gate = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    const res = await login(email, password, gate);
    setBusy(false);
    if (res.success) router.replace(res.user.mustChangePassword ? '/admin/profile' : '/admin');
    else setError(res.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-dark px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-12 w-12 rounded-full" />
          <div>
            <p className="font-serif text-xl font-semibold text-navy-deep">Pacific Marine Academy</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-goldtext">Admin sign-in</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="a-email" className="mb-1.5 block text-sm font-semibold text-navy-deep">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden="true" />
              <input id="a-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full rounded-xl border border-navy-deep/20 py-3 pl-10 pr-4 text-sm ${focusRing}`} />
            </div>
          </div>
          <div>
            <label htmlFor="a-pass" className="mb-1.5 block text-sm font-semibold text-navy-deep">Password</label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden="true" />
              <input id="a-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full rounded-xl border border-navy-deep/20 py-3 pl-10 pr-4 text-sm ${focusRing}`} />
            </div>
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className={`flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-navy-deep text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-wait disabled:opacity-60 ${focusRing}`}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-ink/50">Only for the academy's team. <a href="/" className="font-semibold text-navy-deep underline decoration-gold underline-offset-2">Back to the website</a></p>
      </div>
    </div>
  );
};
