"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Star, X, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const input = `w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-navy-deep focus:outline-none ${focusRing}`;
const empty = { name: '', role: 'Student', rating: 5, text: '', website: '' };

// Lets a visitor write a review on the site. It is saved as "pending" and appears only after an admin approves it.
export const ReviewModal = ({ onClose }) => {
  const { api } = useData();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState(0);
  const first = useRef(null);

  useEffect(() => {
    first.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (form.text.trim().length < 15) next.text = 'Please write a little more (at least 15 characters).';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    try {
      await api.submitReview(form);
      setDone(true);
    } catch (err) {
      setErrors(err.fields || {});
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const shown = hover || form.rating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-dark/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="review-title" onClick={onClose}>
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl sm:p-9" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className={`absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ivory text-navy-deep transition-colors hover:bg-gold-light ${focusRing}`}><X className="h-5 w-5" /></button>

        {done ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-deep text-gold"><Check className="h-7 w-7" /></span>
            <h2 id="review-title" className="mt-5 font-serif text-3xl font-semibold text-navy-deep">Thank you, {form.name.trim().split(' ')[0]}.</h2>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink/70">Your review has been received. It will appear on the website once our team has approved it.</p>
            <button onClick={onClose} className={`mt-7 min-h-[48px] cursor-pointer rounded-full bg-navy-deep px-8 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 id="review-title" className="pr-10 font-serif text-3xl font-semibold text-navy-deep">Write a review</h2>
            <p className="mt-2 text-[15px] text-ink/65">Tell others about your experience at Pacific Marine Academy.</p>

            <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-semibold text-navy-deep">Your rating</legend>
              <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    onMouseEnter={() => setHover(n)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    aria-pressed={form.rating === n}
                    className={`cursor-pointer rounded p-1 ${focusRing}`}
                  >
                    <Star className={`h-8 w-8 transition-colors ${n <= shown ? 'fill-gold text-gold' : 'text-navy-deep/25'}`} />
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="rv-name" className="mb-1.5 block text-sm font-semibold text-navy-deep">Your name *</label>
                <input ref={first} id="rv-name" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} className={`${input} ${errors.name ? 'border-red-600' : 'border-navy-deep/20'}`} />
                {errors.name && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="rv-role" className="mb-1.5 block text-sm font-semibold text-navy-deep">You are a</label>
                <select id="rv-role" value={form.role} onChange={set('role')} className={`${input} border-navy-deep/20`}>
                  {['Student', 'Parent', 'Alumni'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="rv-text" className="mb-1.5 block text-sm font-semibold text-navy-deep">Your review *</label>
              <textarea id="rv-text" rows="5" maxLength={1200} value={form.text} onChange={set('text')} aria-invalid={!!errors.text} placeholder="What did you like? How did the academy help you?" className={`${input} ${errors.text ? 'border-red-600' : 'border-navy-deep/20'}`} />
              {errors.text && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.text}</p>}
            </div>

            {error && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}
            <p className="mt-4 text-xs text-ink/55">Reviews are checked by our team before they are shown.</p>
            <button type="submit" disabled={sending} className={`mt-5 min-h-[52px] w-full cursor-pointer rounded-full bg-navy-deep text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-wait disabled:opacity-60 ${focusRing}`}>
              {sending ? 'Sending…' : 'Submit review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
