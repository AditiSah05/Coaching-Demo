import { read, mutate, newId, sortRecords } from './store';
import { cleanRecord, plainText } from './validate';
import { COLLECTIONS, SINGLETONS, allSettingFields, getPath, setPath, slugify, youtubeId } from '../shared/schema';
import { addNotification } from './notify';
import { logActivity } from './auth';

const fail = (status, error, fields) => ({ status, error, fields });
const today = () => new Date().toISOString();
const phoneOk = (v) => /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/.test(String(v).trim());
const emailOk = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const title = (name, rec) => rec[COLLECTIONS[name].titleField] || rec.title || rec.name || rec.id;

// Rules that depend on the collection or on other records. Runs inside `mutate`, so it sees a consistent database.
function prepare(name, rec, db, existing) {
  const def = COLLECTIONS[name];
  const list = db[name];

  for (const fd of def.fields.filter((x) => x.slug)) {
    let s = slugify(rec[fd.key] || rec[def.titleField] || '');
    if (!s) return fail(422, 'A web address could not be made from the title.', { [fd.key]: 'Required.' });
    if (fd.unique) {
      let candidate = s; let n = 1;
      while (list.some((x) => x.id !== existing?.id && x[fd.key] === candidate)) candidate = `${s}-${++n}`;
      s = candidate;
    }
    rec[fd.key] = s;
  }

  if (name === 'videos') {
    const yt = youtubeId(rec.url);
    if (!yt) return fail(422, 'That does not look like a YouTube link.', { url: 'Paste a YouTube Shorts or watch link.' });
    if (list.some((x) => x.id !== existing?.id && x.ytId === yt)) return fail(422, 'That video is already in the gallery.', { url: 'Already added.' });
    rec.ytId = yt;
    rec.url = `https://www.youtube.com/shorts/${yt}`;
  }

  if (name === 'blogs') {
    const text = plainText(rec.content);
    rec.minutes = Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
    if (!rec.excerpt) rec.excerpt = text.length > 180 ? `${text.slice(0, 177).replace(/\s+\S*$/, '')}…` : text;
  }

  if (name === 'reviews' && existing && existing.status !== rec.status) {
    rec.decidedAt = today();
  }

  if ((name === 'gallery' || name === 'videos') && rec.featured) {
    list.forEach((x) => { if (x.id !== existing?.id) x.featured = false; });
  }
  return null;
}

const stripHeavy = (name, rec) => {
  const out = { ...rec };
  for (const fd of COLLECTIONS[name].fields) if (fd.type === 'html') delete out[fd.key];
  return out;
};

export async function listRecords(name, { q = '' } = {}) {
  const def = COLLECTIONS[name];
  let list = (await read([name]))[name].map((r) => stripHeavy(name, r));
  const needle = q.trim().toLowerCase();
  if (needle) list = list.filter((r) => JSON.stringify(r).toLowerCase().includes(needle));
  return sortRecords(list, def.sort);
}

export const getRecord = async (name, id) => (await read([name]))[name].find((r) => r.id === id) || null;

export async function createRecord(name, input, user) {
  const def = COLLECTIONS[name];
  const { value, errors } = cleanRecord(def.fields, input);
  if (Object.keys(errors).length) return fail(422, 'Please fix the highlighted fields.', errors);
  let err = null; let rec;
  await mutate((db) => {
    const id = def.prefix === 'ADM' ? `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : newId(def.prefix);
    rec = { id, ...value, createdAt: today(), updatedAt: today() };
    err = prepare(name, rec, db, null);
    if (err) return;
    if (name === 'videos') rec.id = `vid-${rec.ytId}`;
    db[name].unshift(rec);
    logActivity(db, user, `Added ${def.singular}`, title(name, rec));
  });
  return err || { record: rec };
}

export async function updateRecord(name, id, input, user) {
  const def = COLLECTIONS[name];
  const existing = await getRecord(name, id);
  if (!existing) return fail(404, 'Not found.');
  const { value, errors } = cleanRecord(def.fields, input, { partial: true });
  if (Object.keys(errors).length) return fail(422, 'Please fix the highlighted fields.', errors);
  let err = null; let rec;
  await mutate((db) => {
    const cur = db[name].find((r) => r.id === id);
    if (!cur) { err = fail(404, 'Not found.'); return; }
    rec = { ...cur, ...value, updatedAt: today() };
    for (const fd of def.fields) if (fd.required && (rec[fd.key] === '' || rec[fd.key] == null)) { err = fail(422, 'Please fix the highlighted fields.', { [fd.key]: `${fd.label} is required.` }); return; }
    err = prepare(name, rec, db, cur);
    if (err) return;
    Object.assign(cur, rec);
    logActivity(db, user, `Edited ${def.singular}`, title(name, rec));
  });
  return err || { record: rec };
}

export async function deleteRecord(name, id, user) {
  const def = COLLECTIONS[name];
  let found = false;
  await mutate((db) => {
    const i = db[name].findIndex((r) => r.id === id);
    if (i < 0) return;
    found = true;
    const [gone] = db[name].splice(i, 1);
    logActivity(db, user, `Deleted ${def.singular}`, title(name, gone));
  });
  return found ? { ok: true } : fail(404, 'Not found.');
}

// ---- single documents: settings, announcement bar ----
export async function saveSingleton(name, input, user) {
  const def = SINGLETONS[name];
  const fields = name === 'settings' ? allSettingFields() : def.fields;
  const { value, errors } = cleanRecord(fields, input, { partial: true });
  if (Object.keys(errors).length) return fail(422, 'Please fix the highlighted fields.', errors);
  await mutate((db) => {
    for (const fd of fields) {
      const v = getPath(value, fd.key);
      if (v !== undefined) setPath(db[name], fd.key, v);
    }
    logActivity(db, user, `Updated ${def.label.toLowerCase()}`, '');
  });
  return { record: (await read([name]))[name] };
}

// ---- forms filled in by visitors on the public site ----
export async function submitPublic(name, input) {
  const def = COLLECTIONS[name];
  const allowed = def.fields.filter((f) => def.publicFields.includes(f.key));
  const { value, errors } = cleanRecord(allowed, input);
  if (!errors.phone && !phoneOk(value.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!errors.email && !emailOk(value.email)) errors.email = 'Enter a valid email address.';
  if (Object.keys(errors).length) return fail(422, 'Please check the form.', errors);

  let rec;
  await mutate((db) => {
    const id = name === 'admissions' ? `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : newId(def.prefix);
    rec = { id, ...value, status: name === 'admissions' ? 'Pending' : 'New', notes: '', createdAt: today(), updatedAt: today() };
    db[name].unshift(rec);
    if (name === 'enquiries') addNotification(db, { type: 'enquiry', title: `New enquiry from ${rec.name}`, body: [rec.course, rec.phone].filter(Boolean).join(' · '), link: '/admin/enquiries' });
    if (name === 'admissions') addNotification(db, { type: 'admission', title: `New admission application: ${rec.fullName}`, body: [rec.courseName, rec.phone].filter(Boolean).join(' · '), link: '/admin/admissions' });
  });
  return { record: { id: rec.id, status: rec.status, ...(name === 'admissions' ? value : {}) } };
}

// A visitor's review is saved as "pending". Only an admin approving it makes it appear on the site.
export async function submitReview(input) {
  const def = COLLECTIONS.reviews;
  const allowed = def.fields.filter((f) => ['name', 'role', 'rating', 'text'].includes(f.key));
  const { value, errors } = cleanRecord(allowed, input);
  if (!errors.text && value.text.length < 15) errors.text = 'Please write a little more (at least 15 characters).';
  if (Object.keys(errors).length) return fail(422, 'Please check the form.', errors);
  await mutate((db) => {
    const rec = { id: newId('rev'), ...value, source: 'website', status: 'pending', featured: false, reply: '', createdAt: today(), updatedAt: today() };
    db.reviews.unshift(rec);
    addNotification(db, { type: 'review', title: `New review waiting for approval (${rec.rating}★)`, body: `${rec.name}: ${rec.text}`, link: '/admin/reviews' });
  });
  return { ok: true };
}
