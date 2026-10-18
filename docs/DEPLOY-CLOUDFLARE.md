# Deploying to Cloudflare (Workers + D1 + R2)

Data is kept in **D1** (one row per section), images in **R2**. Both are created for you on the first deploy.
Locally (`npm run dev` / `npm start`) the site still uses `data/db.json` and `data/uploads`, so nothing needs installing.

## One-time setup (in Aditi's Cloudflare account)

1. `npx wrangler logout` then `npx wrangler login` and sign in as Aditi. Check with `npx wrangler whoami`.
2. Set the secrets (the first admin account is created from these on the first request):
   ```
   npx wrangler secret put ADMIN_EMAIL
   npx wrangler secret put ADMIN_PASSWORD
   npx wrangler secret put SESSION_SECRET      # any long random string
   ```
   If `wrangler secret put` says the Worker does not exist yet, run step 3 first, then set the secrets and deploy again.
3. Deploy: `npm run cf:deploy`. Wrangler creates the D1 database `pacific-marine-academy-db` and the R2 bucket `pacific-marine-academy-uploads` and prints the `*.workers.dev` address.
4. Optional: add the real domain under Workers & Pages > pacific-marine-academy > Settings > Domains.

## Every later deploy
`npm run cf:deploy`

## Try it locally on the Workers runtime
`cp .dev.vars.example .dev.vars`, edit it, then `npm run cf:preview` (local D1 and R2, stored in `.wrangler/`).

## Things to know
- **Plan:** the bundle is large. If the deploy says it is over the size limit, use the Workers Paid plan.
- **Password hashing** uses 100,000 PBKDF2 rounds (the Workers maximum). On the free plan's 10 ms CPU limit, login may fail; Paid fixes it.
- **Login and form rate limits** are kept in memory per Worker instance, so they are best-effort. For real protection add a Cloudflare WAF rate-limiting rule on `/api/admin/login` and `/api/forms/*`.
- **Two people saving at the same moment** is handled: the second save re-reads and re-applies on top of the first.
- **Images** are resized to 1800 px WebP in the admin's browser before upload; the server checks the file type and size (8 MB).
- **Backups:** Admin > Backup downloads all content as JSON. Accounts are not included.
- D1 console: `npx wrangler d1 execute pacific-marine-academy-db --remote --command "SELECT key, length(value) FROM store"`.
