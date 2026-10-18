import sanitizeHtml from 'sanitize-html';
import { getPath, setPath, slugify } from '../shared/schema';

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (s) => String(s ?? '').replace(CONTROL, '').replace(/\r\n/g, '\n');

export const htmlOptions = {
  allowedTags: ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 'a', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption', 'br', 'hr', 'sup', 'mark'],
  allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt', 'loading'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  transformTags: {
    h1: 'h2',
    b: 'strong',
    i: 'em',
    a: (tag, attribs) => ({ tagName: 'a', attribs: { ...attribs, rel: 'noopener noreferrer' } }),
    img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy' } }),
  },
  exclusiveFilter: (frame) => ['p', 'li', 'h2', 'h3', 'h4'].includes(frame.tag) && !frame.text.trim() && !frame.mediaChildren?.length,
};

export const cleanHtml = (s) => sanitizeHtml(clean(s), htmlOptions);
export const plainText = (html) => sanitizeHtml(String(html || ''), { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();

const okUrl = (v) => /^https?:\/\/[^\s]+$/i.test(v);
const okImage = (v) => okUrl(v) || /^\/(uploads|images)\/[^\s]+$/.test(v);

// Turns what a form or API client sent into a safe record: only known fields, right types, limits applied.
// With `partial`, fields that were not sent are left alone.
export function cleanRecord(fields, input, { partial = false } = {}) {
  const out = {};
  const errors = {};
  for (const fd of fields) {
    const raw = getPath(input, fd.key);
    if (raw === undefined && partial) continue;
    let v = raw;
    const label = fd.label;

    switch (fd.type) {
      case 'bool':
        v = raw === undefined ? fd.default ?? false : v === true || v === 'true' || v === 'on' || v === 1 || v === '1';
        break;
      case 'number': {
        if (v === '' || v == null) { v = fd.default ?? null; break; }
        v = Number(v);
        if (Number.isNaN(v)) { errors[fd.key] = `${label} must be a number.`; continue; }
        if (fd.min != null && v < fd.min) { errors[fd.key] = `${label} must be at least ${fd.min}.`; continue; }
        if (fd.max != null && v > fd.max) { errors[fd.key] = `${label} must be at most ${fd.max}.`; continue; }
        break;
      }
      case 'date':
        v = clean(v).trim();
        if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) { errors[fd.key] = `${label} must be a date.`; continue; }
        break;
      case 'select':
        v = clean(v).trim() || fd.default || '';
        if (fd.options && !fd.options.includes(v)) { errors[fd.key] = `${label} has an unknown value.`; continue; }
        break;
      case 'lines': {
        const arr = Array.isArray(v) ? v : String(v ?? '').split('\n');
        v = arr.map((x) => clean(x).trim()).filter(Boolean).map((x) => x.slice(0, 300));
        if (fd.max && v.length > fd.max) { errors[fd.key] = `${label} can have at most ${fd.max} lines.`; continue; }
        break;
      }
      case 'html':
        v = cleanHtml(v ?? '');
        if (fd.max && v.length > fd.max) { errors[fd.key] = `${label} is too long.`; continue; }
        break;
      case 'url':
      case 'image':
        v = clean(v).trim();
        if (v && !(fd.type === 'image' ? okImage(v) : okUrl(v))) { errors[fd.key] = `${label} must be a full web link starting with https://.`; continue; }
        break;
      default: // text, textarea
        v = fd.type === 'textarea' ? clean(v).trim() : clean(v).replace(/\n/g, ' ').trim();
        if (fd.max && v.length > fd.max) { errors[fd.key] = `${label} is too long (most ${fd.max} characters).`; continue; }
    }

    if (fd.required && (v === '' || v == null || (Array.isArray(v) && !v.length))) { errors[fd.key] = `${label} is required.`; continue; }
    if (v === undefined) continue;
    setPath(out, fd.key, v);
  }
  return { value: out, errors };
}

export { slugify };
