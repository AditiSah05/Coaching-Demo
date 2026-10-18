# Admin panel: research, gaps and plan

## 1. What was wrong with the old admin

| Problem | Why it matters |
|---|---|
| All data lived in each browser's `localStorage` | An edit made by the admin was visible only in the admin's own browser. Visitors never saw it. |
| Enquiries, admissions and reviews were saved in the *visitor's* browser | The admin never received them. The inbox was always empty or demo data. |
| Login checked a hard-coded password in client code | Anyone could read it from the JavaScript bundle. No real session. |
| No notifications, no review moderation | Required for the "approve a review before it shows" workflow. |
| Blogs, videos, result posters, exam forms, about text were static files | Not editable from the admin at all. |
| Demo records (invented toppers, students, faculty) | Misleading in a real admin. |
| Dashboard chart used hard-coded numbers | Showed fake statistics. |

## 2. What a coaching-institute site admin should contain

Researched from how institute and admissions sites are run day to day. Grouped by job.

**A. Leads and people (daily work)**
- Enquiries inbox: status (New / Contacted / Resolved), internal notes, search, filter, call and WhatsApp buttons, CSV export.
- Admissions: full application view, status pipeline (Pending / Contacted / Shortlisted / Enrolled / Rejected), notes, print, CSV export.
- Review moderation: pending / approved / rejected, approve or reject, edit, feature, reply.
- Notifications: bell with unread count, one entry per new enquiry, admission or review.

**B. Content (weekly work)**
- Courses, blog posts (rich text, cover image, draft / published, SEO excerpt), gallery photos, video gallery, study materials, exam forms, result posters, FAQs, team / faculty, announcement banner.
- Media library: upload, browse and reuse images.

**C. Site configuration (rare work)**
- Contact details, opening hours, address, map, social links, Google review links, YouTube channel, hero text, headline numbers, about-page text, default SEO title and description.

**D. Administration and safety**
- Dashboard with real numbers, a real trend chart and what needs attention.
- Users with roles (Super admin, Editor, Counsellor), change password.
- Activity log (who changed what, when).
- Backup download, restore, reset a section to its defaults.

## 3. Decisions

| Decision | Choice | Reason |
|---|---|---|
| Storage | JSON file on the server (`data/db.json`), written atomically, behind one module (`src/server/store.js`) | Works with no database to install; one file to swap for MySQL or Postgres later. Needs a host with a persistent disk (VPS, Hostinger Node, Railway), **not** serverless platforms with a read-only disk. |
| Uploads | `data/uploads/`, served by a route, resized with `sharp` | `public/` cannot serve files added after a production build. |
| Sessions | Signed, `httpOnly`, `SameSite=Lax` cookie; password hashed with scrypt | No password in client code. |
| Login safety | Failed-login rate limit, Origin check on writes | Basic protection against guessing and cross-site posts. |
| Public forms | Validated, length-limited, honeypot field, per-IP rate limit | Stops spam flooding the inbox. |
| Review rule | Visitor reviews are saved as *pending*; only *approved* ones are sent to the public site | The requested workflow. |
| Rich text | Small built-in editor; HTML cleaned on the server with `sanitize-html` | No heavy editor dependency; safe output. |
| Notifications | In-app bell (polls every 20 s) and the tab title shows the unread count | Email needs an SMTP account; the hook is left ready. |

## 4. Build order

1. Server core: store, auth, uploads, notifications, activity log.
2. API routes: public content and forms, admin CRUD.
3. Public site reads from the server and submits forms to it.
4. Admin UI: shell, dashboard, notifications, then every module.
5. Test everything together at the end.

## 5. Running it

| Setting | Purpose |
|---|---|
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Owner account created on first start. If unset: `admin@pacificmarine.demo` / `Admin@123`, and a password change is forced at first login. |
| `SESSION_SECRET` | Signs login cookies. If unset, a random one is saved in `data/.session-secret`. |
| `DATA_DIR` | Where `db.json` and `uploads/` live. Default `./data`. Back this folder up. |

Host needs a persistent disk and a long-running Node process (not serverless).

## 6. Verified (local, API level)

Login/logout, wrong password, forced password change, weak password rejected, Origin check, role limits (counsellor blocked from blogs/users/backup/settings), review submit -> pending + notification -> approve shows on site -> reject hides, honeypot, review rate limit, enquiry/admission submit + validation, blog create/sanitise/draft hidden, settings edit visible on site, image upload (bad file rejected, real image -> WebP), dashboard, activity log, backup download.
