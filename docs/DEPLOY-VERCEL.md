# Deploying to Vercel (with a Neon Postgres database)

The site keeps its content in one database table and its uploaded images in another. On Vercel that database is **Neon Postgres**
(free tier). Nothing is written to disk, so Vercel's read-only servers are fine.

## One-time setup
1. **Vercel:** Add New, Project, import the GitHub repo `AditiSah05/Coaching-Demo`, branch `dev` (or `main`). Framework is detected as Next.js. Do not change the build settings.
2. **Database:** in the Vercel project open **Storage**, add **Neon** (Postgres) from the Marketplace and connect it to the project. This sets `DATABASE_URL` for you.
3. **Environment variables** (Settings, Environment Variables, all environments):
   | Name | Value |
   |---|---|
   | `ADMIN_EMAIL` | the admin login email (only used on the very first start, when there are no users) |
   | `ADMIN_PASSWORD` | a strong password (same note) |
   | `SESSION_SECRET` | any long random text |
   | `SITE_URL` | the final address, e.g. `https://pacificmarineacademy.com` |
4. **Deploy.** The first visit fills the database with the starting content.

## Bring the live content across (optional)
To keep what is on the Cloudflare site (courses, reviews, blog posts, admin accounts):
```
npx wrangler d1 execute pacific-marine-academy-db --remote --json --command "SELECT key, value FROM store" > d1-dump.json
DATABASE_URL="<the Neon connection string>" node scripts/import-to-postgres.mjs d1-dump.json
```
Copy the connection string from the Neon dashboard (Vercel Storage, Neon, `DATABASE_URL`). Do this **before** the first visit, or add `--force` to replace what is there.
The import also brings the admin accounts, so you sign in with the old admin email and password. **Change that password straight away.**

## Connect the domain
Vercel project, Settings, Domains, add `pacificmarineacademy.com` and `www.pacificmarineacademy.com`. Vercel lists the DNS records. At the company where the domain was bought, add:
- `A` record, name `@`, value `76.76.21.21`
- `CNAME` record, name `www`, value `cname.vercel-dns.com`

Keep any existing `MX` and `TXT` records so email keeps working. The old WordPress site stops being reachable once the domain points here, so back it up first.

## Things to know
- **Images:** admin uploads are stored in the database (the `uploads` table), resized to 1800 px WebP in the browser. Keep an eye on the Neon free storage (0.5 GB).
- **Neon connection:** use the pooled address Neon gives you; the site is set up for it.
- **Rate limits** on login and forms are kept in memory per server instance, so they are best-effort.
- **Backups:** Admin, Backup downloads all content as JSON. Neon also keeps point-in-time history on its plans.
- The same code still deploys to Cloudflare (`npm run cf:deploy`) and runs locally from a JSON file with no database.
