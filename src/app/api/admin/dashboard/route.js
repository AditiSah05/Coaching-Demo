import { guard } from '../../../../server/auth';
import { read } from '../../../../server/store';
import { can } from '../../../../shared/schema';
import { json } from '../../../../server/http';

export const dynamic = 'force-dynamic';

const day = (d) => d.toISOString().slice(0, 10);
const tally = (list, key) => list.reduce((m, r) => ({ ...m, [r[key] || 'Other']: (m[r[key] || 'Other'] || 0) + 1 }), {});

export async function GET(request) {
  const g = await guard(request, 'dashboard');
  if (g.response) return g.response;
  const db = read();
  const role = g.user.role;
  const out = { counts: {}, series: [], recent: {}, breakdown: {}, attention: [], health: [] };

  const days = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(day(d)); }
  const byDay = (list) => { const m = {}; list.forEach((r) => { const k = String(r.createdAt || '').slice(0, 10); m[k] = (m[k] || 0) + 1; }); return m; };
  const enqDay = byDay(db.enquiries); const admDay = byDay(db.admissions);
  out.series = days.map((d) => ({ day: d.slice(5), enquiries: enqDay[d] || 0, admissions: admDay[d] || 0 }));
  const lastWeek = (list) => list.filter((r) => String(r.createdAt || '').slice(0, 10) >= days[7]).length;
  const prevWeek = (list) => list.filter((r) => { const k = String(r.createdAt || '').slice(0, 10); return k >= days[0] && k < days[7]; }).length;

  if (can(role, 'enquiries')) {
    out.counts.enquiries = { total: db.enquiries.length, open: db.enquiries.filter((e) => e.status === 'New').length, week: lastWeek(db.enquiries), prevWeek: prevWeek(db.enquiries) };
    out.recent.enquiries = db.enquiries.slice(0, 5);
    out.breakdown.enquiries = tally(db.enquiries, 'status');
  }
  if (can(role, 'admissions')) {
    out.counts.admissions = { total: db.admissions.length, open: db.admissions.filter((a) => a.status === 'Pending').length, week: lastWeek(db.admissions), prevWeek: prevWeek(db.admissions) };
    out.recent.admissions = db.admissions.slice(0, 5);
    out.breakdown.admissions = tally(db.admissions, 'status');
    out.breakdown.admissionCourses = tally(db.admissions, 'courseName');
  }
  if (can(role, 'reviews')) {
    const pending = db.reviews.filter((r) => r.status === 'pending');
    out.counts.reviews = { total: db.reviews.length, open: pending.length, approved: db.reviews.filter((r) => r.status === 'approved').length };
    out.recent.reviews = pending.slice(0, 5);
  }
  if (can(role, 'blogs')) out.counts.blogs = { total: db.blogs.length, drafts: db.blogs.filter((b) => b.status === 'draft').length };
  if (can(role, 'courses')) out.counts.courses = { total: db.courses.length };
  if (can(role, 'gallery')) out.counts.gallery = { total: db.gallery.length };
  if (can(role, 'videos')) out.counts.videos = { total: db.videos.length };

  const unread = db.notifications.filter((n) => !n.read).length;
  if (unread) out.attention.push({ text: `${unread} unread notification${unread > 1 ? 's' : ''}`, link: '/admin/notifications' });
  if (out.counts.reviews?.open) out.attention.push({ text: `${out.counts.reviews.open} review${out.counts.reviews.open > 1 ? 's' : ''} waiting for approval`, link: '/admin/reviews' });
  if (out.counts.enquiries?.open) out.attention.push({ text: `${out.counts.enquiries.open} new enquir${out.counts.enquiries.open > 1 ? 'ies' : 'y'} to answer`, link: '/admin/enquiries' });
  if (out.counts.admissions?.open) out.attention.push({ text: `${out.counts.admissions.open} admission${out.counts.admissions.open > 1 ? 's' : ''} pending`, link: '/admin/admissions' });
  if (g.user.mustChangePassword) out.attention.unshift({ text: 'You are still using the default password. Change it now.', link: '/admin/profile', urgent: true });

  if (role === 'superadmin' || role === 'editor') {
    const s = db.settings;
    const check = (ok, text, link) => { if (!ok) out.health.push({ text, link }); };
    check(db.courses.every((c) => c.image), 'Some courses have no photo', '/admin/courses');
    check(db.studyMaterials.every((m) => m.downloadUrl), 'Some study materials have no download link', '/admin/study-materials');
    check(s.googleReviewsUrl && s.googleWriteReviewUrl, 'Google review links are not set', '/admin/settings');
    check(s.socialLinks?.facebook || s.socialLinks?.instagram, 'Facebook and Instagram links are empty', '/admin/settings');
    check(db.blogs.some((b) => b.status === 'published'), 'No blog post is published', '/admin/blogs');
  }
  return json(out);
}
