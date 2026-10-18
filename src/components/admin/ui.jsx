"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  X, CheckCircle2, AlertCircle, Loader2, ImagePlus, Upload, Trash2, Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Link2, Image as ImageIcon, Eraser, Undo2, Redo2,
} from 'lucide-react';
import { request } from '../../services/api';

export const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

// ---------- toasts and confirm dialogs ----------
const FeedbackContext = createContext(null);
export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [ask, setAsk] = useState(null);

  const toast = useCallback((message, type = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), type === 'error' ? 7000 : 3500);
  }, []);

  const confirm = useCallback((opts) => new Promise((resolve) => setAsk({ ...opts, resolve })), []);
  const answer = (v) => { ask.resolve(v); setAsk(null); };

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[300] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} role={t.type === 'error' ? 'alert' : 'status'} className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-chunky-lg ${t.type === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-navy-deep/10 bg-white text-navy-deep'}`}>
            {t.type === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-goldtext" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
      {ask && (
        <Modal title={ask.title || 'Are you sure?'} onClose={() => answer(false)} narrow
          footer={<>
            <Button variant="ghost" onClick={() => answer(false)}>Cancel</Button>
            <Button variant={ask.danger === false ? 'primary' : 'danger'} onClick={() => answer(true)}>{ask.confirmLabel || 'Delete'}</Button>
          </>}>
          <p className="text-sm leading-relaxed text-ink/75">{ask.message}</p>
        </Modal>
      )}
    </FeedbackContext.Provider>
  );
};

// ---------- small pieces ----------
export const Button = ({ variant = 'primary', loading, className = '', children, ...rest }) => {
  const styles = {
    primary: 'bg-navy-deep text-white hover:bg-navy-light',
    gold: 'bg-gold text-navy-deep hover:brightness-110',
    ghost: 'border border-navy-deep/20 bg-white text-navy-deep hover:border-gold hover:bg-gold-light',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    quiet: 'text-navy-deep hover:bg-navy-deep/5',
  }[variant];
  return (
    <button {...rest} disabled={rest.disabled || loading} className={`inline-flex min-h-[40px] cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${styles} ${focus} ${className}`}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

const tones = {
  gray: 'bg-navy-deep/8 text-navy-deep/80', green: 'bg-emerald-100 text-emerald-800', amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800', blue: 'bg-sky-100 text-sky-800', gold: 'bg-gold-light text-goldtext',
};
export const Badge = ({ tone = 'gray', children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
);
export const statusTone = (s) => ({
  published: 'green', approved: 'green', Enrolled: 'green', Resolved: 'green', Contacted: 'blue', Shortlisted: 'blue',
  draft: 'gray', pending: 'amber', Pending: 'amber', New: 'amber', rejected: 'red', Rejected: 'red',
}[s] || 'gray');

export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="font-serif text-3xl font-semibold text-navy-deep">{title}</h1>
      {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink/65">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card = ({ className = '', children }) => (
  <div className={`rounded-2xl border border-navy-deep/10 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

export const Empty = ({ title, children }) => (
  <div className="rounded-2xl border border-dashed border-navy-deep/20 bg-white/60 px-6 py-14 text-center">
    <p className="font-serif text-xl font-semibold text-navy-deep">{title}</p>
    {children && <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">{children}</p>}
  </div>
);

export const Spinner = ({ label = 'Loading' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink/60" role="status"><Loader2 className="h-5 w-5 animate-spin" /> {label}…</div>
);

export const fmtDate = (iso, time = false) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString('en-IN', time ? { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' });
};
export const ago = (iso) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(iso);
};

// ---------- modal ----------
export const Modal = ({ title, onClose, children, footer, wide, narrow }) => {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-navy-dark/70 p-4 backdrop-blur-sm sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`relative my-4 flex max-h-[calc(100vh-2rem)] w-full flex-col rounded-2xl bg-white shadow-2xl outline-none ${narrow ? 'max-w-md' : wide ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <div className="flex items-center justify-between gap-4 border-b border-navy-deep/10 px-6 py-4">
          <h2 className="font-serif text-xl font-semibold text-navy-deep">{title}</h2>
          <button onClick={onClose} aria-label="Close" className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-navy-deep/5 ${focus}`}><X className="h-5 w-5" /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-navy-deep/10 bg-ivory/60 px-6 py-3.5">{footer}</div>}
      </div>
    </div>
  );
};

// ---------- fields ----------
const inputCls = (err) => `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-navy-deep focus:outline-none ${focus} ${err ? 'border-red-500' : 'border-navy-deep/20'}`;

export const FieldShell = ({ id, label, required, help, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-deep">{label}{required && <span className="text-red-600"> *</span>}</label>
    {children}
    {help && !error && <p className="mt-1 text-xs text-ink/55">{help}</p>}
    {error && <p id={`${id}-err`} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {error}</p>}
  </div>
);

// Draws the right control for one schema field.
export const SchemaField = ({ field, value, onChange, error, suggestions = [], idPrefix = 'f' }) => {
  const id = `${idPrefix}-${field.key.replace(/\./g, '-')}`;
  const common = { id, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-err` : undefined };
  let control;

  switch (field.type) {
    case 'bool':
      return (
        <label className={`flex cursor-pointer items-center gap-3 rounded-xl border border-navy-deep/15 bg-white px-3.5 py-3 text-sm font-semibold text-navy-deep ${focus}`}>
          <input type="checkbox" id={id} checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 cursor-pointer accent-navy-deep" />
          <span>{field.label}{field.help && <span className="block text-xs font-normal text-ink/55">{field.help}</span>}</span>
        </label>
      );
    case 'textarea':
      control = <textarea {...common} rows={field.rows || 4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} maxLength={field.max} className={inputCls(error)} />;
      break;
    case 'lines':
      control = <textarea {...common} rows={field.rows || 5} value={Array.isArray(value) ? value.join('\n') : value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder || 'One item per line'} className={inputCls(error)} />;
      break;
    case 'number':
      control = <input {...common} type="number" min={field.min} max={field.max} value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className={inputCls(error)} />;
      break;
    case 'date':
      control = <input {...common} type="date" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls(error)} />;
      break;
    case 'url':
      control = <input {...common} type="url" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder || 'https://'} className={inputCls(error)} />;
      break;
    case 'select':
      control = (
        <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls(error)}>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    case 'image':
      control = <ImageField id={id} value={value} onChange={onChange} error={error} />;
      break;
    case 'html':
      control = <RichText id={id} value={value} onChange={onChange} />;
      break;
    default: {
      const listId = field.list && suggestions.length ? `${id}-list` : undefined;
      control = (
        <>
          <input {...common} type="text" list={listId} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} maxLength={field.max} className={inputCls(error)} />
          {listId && <datalist id={listId}>{suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
        </>
      );
    }
  }
  return <FieldShell id={id} label={field.label} required={field.required} help={field.help} error={error}>{control}</FieldShell>;
};

// ---------- images: upload, pick from the library, or paste a link ----------
export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  return (await request('/api/admin/upload', { method: 'POST', form })).media;
};

export const MediaPicker = ({ onPick, onClose }) => {
  const [items, setItems] = useState(null);
  const { toast } = useFeedback();
  useEffect(() => { request('/api/admin/media').then((d) => setItems(d.media)).catch((e) => { toast(e.message, 'error'); setItems([]); }); }, [toast]);
  return (
    <Modal title="Choose an image" onClose={onClose} wide>
      {items === null ? <Spinner /> : items.length === 0 ? <Empty title="No images yet">Upload an image first, then it will appear here.</Empty> : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {items.map((m) => (
            <li key={m.id}>
              <button onClick={() => { onPick(m.url); onClose(); }} className={`group block w-full cursor-pointer overflow-hidden rounded-xl border border-navy-deep/10 bg-ivory ${focus}`}>
                <img src={m.url} alt={m.name} loading="lazy" className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />
                <span className="block truncate px-2 py-1.5 text-left text-xs text-ink/65">{m.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export const ImageField = ({ id, value, onChange, error }) => {
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);
  const input = useRef(null);
  const { toast } = useFeedback();

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try { onChange((await uploadImage(file)).url); toast('Image uploaded.'); } catch (e) { toast(e.message, 'error'); } finally { setBusy(false); if (input.current) input.current.value = ''; }
  };

  return (
    <div className={`rounded-xl border p-3 ${error ? 'border-red-500' : 'border-navy-deep/20'} bg-white`}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-navy-deep/10 bg-ivory">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-7 w-7 text-ink/30" aria-hidden="true" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" loading={busy} onClick={() => input.current?.click()}><Upload className="h-4 w-4" /> Upload</Button>
            <Button type="button" variant="ghost" onClick={() => setPicker(true)}><ImagePlus className="h-4 w-4" /> Library</Button>
            {value && <Button type="button" variant="quiet" onClick={() => onChange('')}><Trash2 className="h-4 w-4" /> Remove</Button>}
          </div>
          <input id={id} type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="or paste an image link" aria-label="Image link" className={`w-full rounded-lg border border-navy-deep/15 px-3 py-1.5 text-xs ${focus}`} />
        </div>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      {picker && <MediaPicker onPick={onChange} onClose={() => setPicker(false)} />}
    </div>
  );
};

// ---------- rich text ----------
const Tool = ({ label, onClick, children }) => (
  <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-navy-deep hover:bg-navy-deep/10 ${focus}`}>{children}</button>
);

export const RichText = ({ id, value, onChange }) => {
  const ref = useRef(null);
  const [picker, setPicker] = useState(false);
  const saved = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) ref.current.innerHTML = value || '';
  }, [value]);

  const emit = () => onChange(ref.current.innerHTML);
  const cmd = (name, arg) => { ref.current.focus(); document.execCommand(name, false, arg); emit(); };
  const block = (tag) => cmd('formatBlock', tag);

  const remember = () => { const sel = window.getSelection(); if (sel && sel.rangeCount) saved.current = sel.getRangeAt(0); };
  const restore = () => { const sel = window.getSelection(); if (saved.current) { sel.removeAllRanges(); sel.addRange(saved.current); } };

  const link = () => {
    remember();
    const url = window.prompt('Link address (https://…)');
    if (!url) return;
    restore();
    if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(url)) { window.alert('Please start the link with https://'); return; }
    cmd('createLink', url);
  };
  const addImage = (url) => { restore(); ref.current.focus(); document.execCommand('insertImage', false, url); emit(); };

  // Pasting keeps only plain text, so content from Word or a web page does not bring its own styling.
  const paste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text.split(/\n{2,}/).map((p) => `<p>${p.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).replace(/\n/g, '<br>')}</p>`).join(''));
    emit();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-navy-deep/20 bg-white focus-within:border-navy-deep">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-navy-deep/10 bg-ivory px-2 py-1.5" role="toolbar" aria-label="Text formatting">
        <Tool label="Heading" onClick={() => block('h2')}><Heading2 className="h-4 w-4" /></Tool>
        <Tool label="Sub-heading" onClick={() => block('h3')}><Heading3 className="h-4 w-4" /></Tool>
        <Tool label="Paragraph" onClick={() => block('p')}><span className="text-xs font-bold">P</span></Tool>
        <span className="mx-1 h-5 w-px bg-navy-deep/15" />
        <Tool label="Bold" onClick={() => cmd('bold')}><Bold className="h-4 w-4" /></Tool>
        <Tool label="Italic" onClick={() => cmd('italic')}><Italic className="h-4 w-4" /></Tool>
        <Tool label="Bulleted list" onClick={() => cmd('insertUnorderedList')}><List className="h-4 w-4" /></Tool>
        <Tool label="Numbered list" onClick={() => cmd('insertOrderedList')}><ListOrdered className="h-4 w-4" /></Tool>
        <Tool label="Quote" onClick={() => block('blockquote')}><Quote className="h-4 w-4" /></Tool>
        <Tool label="Link" onClick={link}><Link2 className="h-4 w-4" /></Tool>
        <Tool label="Insert image" onClick={() => { remember(); setPicker(true); }}><ImageIcon className="h-4 w-4" /></Tool>
        <span className="mx-1 h-5 w-px bg-navy-deep/15" />
        <Tool label="Clear formatting" onClick={() => { cmd('removeFormat'); block('p'); }}><Eraser className="h-4 w-4" /></Tool>
        <Tool label="Undo" onClick={() => cmd('undo')}><Undo2 className="h-4 w-4" /></Tool>
        <Tool label="Redo" onClick={() => cmd('redo')}><Redo2 className="h-4 w-4" /></Tool>
      </div>
      <div
        id={id}
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Article text"
        onInput={emit}
        onBlur={emit}
        onPaste={paste}
        className="prose-pma min-h-[320px] max-h-[60vh] overflow-y-auto px-4 py-3 text-base focus:outline-none"
      />
      {picker && <MediaPicker onPick={addImage} onClose={() => setPicker(false)} />}
    </div>
  );
};

// ---------- csv ----------
export const downloadCsv = (filename, rows) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  // Spreadsheets treat a leading = + - @ as a formula; a leading apostrophe keeps it plain text.
  const safe = (v) => (/^[=+\-@]/.test(String(v ?? '')) ? `'${v}` : v);
  const csv = rows.map((r) => r.map((c) => esc(safe(c))).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
