"use client";

import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const fieldBase = `w-full rounded-xl border bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink/40 transition-colors focus:outline-none ${focusRing}`;
const ok = 'border-navy-deep/20 focus:border-navy-deep';
const bad = 'border-red-600 focus:border-red-600';

// Indian mobile: 10 digits starting 6-9, optional +91 / 0 prefix.
const validPhone = (v) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''));
const empty = { name: '', phone: '', message: '', website: '' };

const Field = ({ id, label, hint, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-deep">{label}{hint && <span className="ml-1 font-normal text-ink/50">{hint}</span>}</label>
    {children}
    {error && <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {error}</p>}
  </div>
);

export const CareerGuidance = () => {
  const { api } = useData();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.phone.trim()) next.phone = 'Please enter your mobile number.';
    else if (!validPhone(form.phone)) next.phone = 'Enter a valid 10-digit mobile number.';
    setErrors(next);
    if (Object.keys(next).length) { document.getElementById(next.name ? 'cg-name' : 'cg-phone')?.focus(); return; }
    setSending(true);
    try {
      await api.submitEnquiry({ name: form.name.trim(), phone: form.phone, message: form.message, website: form.website, course: 'Career guidance form' });
      setSent(true);
    } catch (err) {
      setErrors(err.fields || {});
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby="guidance-heading" className="bg-ivory py-20 text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <h2 id="guidance-heading" className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-navy-deep sm:text-5xl">Career guidance</h2>
          <span className="mt-6 block h-px w-16 bg-gold" aria-hidden="true" />
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            Not sure which Merchant Navy course or route is right for you? Leave your number and a counsellor will call you back.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-navy-deep/10 bg-white p-7 shadow-chunky sm:p-9 lg:col-span-7">
          {sent ? (
            <div role="status" className="py-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-deep text-gold"><Check className="h-7 w-7" /></span>
              <h3 className="mt-5 font-serif text-3xl font-semibold text-navy-deep">We have your details</h3>
              <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink/65">A counsellor will call you on <strong className="text-navy-deep">{form.phone.trim()}</strong>.</p>
              <button onClick={() => { setForm(empty); setSent(false); }} className={`mt-6 rounded-full border border-navy-deep/25 px-6 py-3 text-sm font-semibold text-navy-deep hover:border-gold hover:bg-gold-light ${focusRing}`}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="cg-name" label="Your name *" error={errors.name}>
                  <input id="cg-name" autoComplete="name" value={form.name} onChange={set('name')} aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cg-name-error' : undefined} className={`${fieldBase} ${errors.name ? bad : ok}`} />
                </Field>
                <Field id="cg-phone" label="Mobile number *" error={errors.phone}>
                  <input id="cg-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit number" value={form.phone} onChange={set('phone')} aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'cg-phone-error' : undefined} className={`${fieldBase} ${errors.phone ? bad : ok}`} />
                </Field>
              </div>
              <Field id="cg-msg" label="What would you like guidance on?" hint="(optional)">
                <textarea id="cg-msg" rows="3" value={form.message} onChange={set('message')} placeholder="For example, your class and PCM percentage." className={`${fieldBase} ${ok}`} />
              </Field>
              {formError && <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-700"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {formError}</p>}
              <button type="submit" disabled={sending} className={`min-h-[52px] w-full cursor-pointer rounded-full bg-navy-deep px-9 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-wait disabled:opacity-60 sm:w-auto ${focusRing}`}>
                {sending ? 'Sending…' : 'Request a call back'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
