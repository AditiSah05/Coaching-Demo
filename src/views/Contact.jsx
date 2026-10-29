"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Check, ArrowUpRight, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const fieldBase = `w-full rounded-xl border bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink/40 transition-colors focus:outline-none ${focusRing}`;
const fieldOk = 'border-navy-deep/20 focus:border-navy-deep';
const fieldBad = 'border-red-600 focus:border-red-600';

const emptyForm = { name: '', phone: '', email: '', course: '', message: '' };

// Indian mobile: 10 digits starting 6-9, optional +91 / 0 prefix, spaces or dashes allowed.
const validPhone = (v) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''));

const steps = [
  { title: 'You send your details', text: 'A few lines about you and the course you are considering.' },
  { title: 'A counsellor calls you back', text: 'On the number you gave us, to talk through your situation.' },
  { title: 'You get clear guidance', text: 'Eligibility, the right course, sponsorship and how to apply.' },
];

const Field = ({ id, label, error, hint, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-deep">{label}{hint && <span className="ml-1 font-normal text-ink/50">{hint}</span>}</label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {error}
      </p>
    )}
  </div>
);

const Quick = ({ Icon, label, value, href, external }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className={`group flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border border-navy-deep/10 bg-white px-4 py-3 transition-colors hover:border-gold ${focusRing}`}
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-light text-goldtext transition-colors group-hover:bg-gold group-hover:text-navy-deep">
      <Icon className="h-5 w-5" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">{label}</span>
      <span className="block break-words text-[15px] font-semibold text-navy-deep">{value}</span>
    </span>
    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/30 transition-colors group-hover:text-navy-deep" aria-hidden="true" />
  </a>
);

export const Contact = () => {
  const { settings, courses, api } = useData();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.phone.trim()) next.phone = 'Please enter your mobile number.';
    else if (!validPhone(form.phone)) next.phone = 'Enter a valid 10-digit mobile number.';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(next.name ? 'c-name' : 'c-phone')?.focus();
      return;
    }
    setSending(true);
    try {
      await api.submitEnquiry({ ...form, name: form.name.trim(), course: form.course || 'General guidance' });
      setSent(true);
    } catch (err) {
      setErrors(err.fields || {});
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  };

  const phone = settings?.phonePrimary;
  const tel = phone ? phone.replace(/\s/g, '') : '';
  const wa = (settings?.whatsapp || phone || '').replace(/[^0-9]/g, '');
  const directions = settings?.mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.address || '')}`;

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Title, what happens next, quick contact */}
          <div className="min-w-0 lg:col-span-5">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-goldtext">Contact</p>
              <h1 className="mt-4 text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-navy-deep">
                Let's talk about your Merchant Navy career.
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">
                Ask about eligibility, sponsorship or which course suits you. Tell us a little about yourself and we will take it from there.
              </p>
            </header>

          <aside className="mt-12" aria-label="How we work with you">
            <h2 className="font-serif text-2xl font-semibold text-navy-deep">What happens next</h2>
            <ol className="relative mt-6 space-y-7 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-px before:bg-navy-deep/15">
              {steps.map((s, i) => (
                <li key={s.title} className="relative flex gap-5">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold bg-ivory font-serif text-lg font-semibold text-navy-deep">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <p className="font-semibold text-navy-deep">{s.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink/70">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 font-serif text-2xl font-semibold text-navy-deep">Prefer to reach us directly?</h2>
            <div className="mt-5 space-y-3">
              {phone && <Quick Icon={Phone} label="Call" value={phone} href={`tel:${tel}`} />}
              {wa && <Quick Icon={MessageCircle} label="WhatsApp" value="Message a counsellor" href={`https://wa.me/${wa}?text=${encodeURIComponent('Hello Pacific Marine Academy, I want some information.')}`} external />}
              {settings?.email && <Quick Icon={Mail} label="Email" value={settings.email} href={`mailto:${settings.email}`} />}
            </div>
          </aside>
          </div>

          {/* Enquiry form, with where to find us just below */}
          <div className="min-w-0 lg:col-span-7">
          <section aria-labelledby="enquiry-heading">
            <div className="overflow-hidden rounded-3xl border border-navy-deep/10 bg-white shadow-chunky-lg">
              <div className="h-1.5 bg-gold" aria-hidden="true" />
              <div className="p-7 sm:p-10">
                <h2 id="enquiry-heading" className="font-serif text-3xl font-semibold text-navy-deep">Send an enquiry</h2>
                <p className="mt-2 text-[15px] text-ink/65">Fields marked with * are required.</p>

                <div aria-live="polite">
                  {sent ? (
                    <div className="py-10">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-deep text-gold">
                        <Check className="h-7 w-7" />
                      </span>
                      <h3 className="mt-6 font-serif text-3xl font-semibold text-navy-deep">Thank you, {form.name.trim().split(' ')[0]}.</h3>
                      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/75">
                        We have your enquiry. A counsellor will call you on <strong className="text-navy-deep">{form.phone.trim()}</strong>. If it is urgent, you can also call us on {phone}.
                      </p>
                      <button
                        onClick={() => { setSent(false); setForm(emptyForm); setErrors({}); }}
                        className={`mt-7 min-h-[48px] cursor-pointer rounded-full border border-navy-deep/25 px-7 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}
                      >
                        Send another enquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submit} noValidate className="mt-8 space-y-5">
                      {/* hidden trap field: people never see it, spam bots fill it */}
                      <input type="text" name="website" value={form.website || ''} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                      <Field id="c-name" label="Your name *" error={errors.name}>
                        <input
                          id="c-name" autoComplete="name" value={form.name} onChange={set('name')}
                          aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-error' : undefined}
                          className={`${fieldBase} ${errors.name ? fieldBad : fieldOk}`}
                        />
                      </Field>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Field id="c-phone" label="Mobile number *" error={errors.phone}>
                          <input
                            id="c-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')}
                            aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'c-phone-error' : undefined}
                            placeholder="10-digit number"
                            className={`${fieldBase} ${errors.phone ? fieldBad : fieldOk}`}
                          />
                        </Field>
                        <Field id="c-email" label="Email" hint="(optional)">
                          <input id="c-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className={`${fieldBase} ${fieldOk}`} />
                        </Field>
                      </div>

                      <Field id="c-course" label="Course you are interested in">
                        <select id="c-course" value={form.course} onChange={set('course')} className={`${fieldBase} ${fieldOk}`}>
                          <option value="">Not sure yet / general guidance</option>
                          {courses.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
                        </select>
                      </Field>

                      <Field id="c-msg" label="Your question" hint="(optional)">
                        <textarea id="c-msg" rows="4" value={form.message} onChange={set('message')} placeholder="For example, your 12th PCM percentage and what you would like to know." className={`${fieldBase} ${fieldOk}`} />
                      </Field>

                      {formError && <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-700"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {formError}</p>}
                      <button type="submit" disabled={sending} className={`min-h-[52px] w-full cursor-pointer disabled:cursor-wait disabled:opacity-60 rounded-full bg-navy-deep px-9 text-sm font-semibold text-white transition-colors hover:bg-navy-light sm:w-auto ${focusRing}`}>
                        {sending ? 'Sending…' : 'Send enquiry'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Visit the academy" className="mt-10 border-t border-navy-deep/15 pt-8">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <div className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-goldtext" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-navy-deep">Address</h2>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/75">{settings?.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-goldtext" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-navy-deep">Opening hours</h2>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/75">{(settings?.hours?.length ? settings.hours : ['Please call to check the opening hours.']).map((h, i) => <React.Fragment key={i}>{i > 0 && <br />}{h}</React.Fragment>)}</p>
                </div>
              </div>
            </div>
            <a href={directions} target="_blank" rel="noopener noreferrer" className={`mt-7 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border border-navy-deep/25 px-7 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}>
              Get directions <ArrowUpRight className="h-4 w-4" />
            </a>
          </section>
          </div>
        </div>
      </main>

      {/* Full-width map, edge to edge, directly above the footer */}
      <section aria-label="Map showing the academy" className="h-[400px] w-full border-t border-navy-deep/15 bg-ivory-dark sm:h-[460px]">
        {settings?.mapEmbedUrl && (
          <iframe
            src={settings.mapEmbedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            title="Pacific Marine Academy on Google Maps"
          />
        )}
      </section>
    </div>
  );
};
