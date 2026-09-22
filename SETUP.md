# Dashboard, CMS & Email Setup

The dashboard, CMS, and email system are fully built and deployed in code.
Nothing will actually work live until the steps below are completed — until
then every public page just shows its empty state and the dashboard shows a
"not configured" login screen, so the site itself is never broken.

## 1. Supabase (database + auth)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL Editor, paste the contents of `supabase/schema.sql` from this
   repo, and run it. This creates all 7 tables with RLS enabled.
3. Go to Authentication -> Users -> Add user, and create a login (email +
   password) for yourself and anyone else who should have dashboard access.
4. Go to Project Settings -> API and copy:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **anon / public key** -> `VITE_SUPABASE_ANON_KEY`
   - **service_role key** -> `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
     never put it in a `VITE_`-prefixed variable or client code)

No Supabase Storage bucket is needed — the CMS never uploads files into
Supabase.

## 2. Resend (email delivery)

1. Create a free account at [resend.com](https://resend.com).
2. Domains -> Add Domain -> `creapinitiative.org`.
3. Add the SPF/DKIM DNS records Resend gives you at your domain's DNS
   provider, then wait for the domain to show "Verified".
4. API Keys -> Create API Key -> copy it to `RESEND_API_KEY`.
5. Set `RESEND_FROM_EMAIL` to an address on the verified domain, e.g.
   `no-reply@creapinitiative.org`.
6. Set `ADMIN_NOTIFICATION_EMAIL` to the inbox that should receive a copy of
   every form submission (contact, get-involved, donate, newsletter).

## 3. GitHub token (for image uploads from the dashboard)

1. GitHub -> Settings -> Developer settings -> Personal access tokens ->
   Fine-grained tokens -> Generate new token.
2. Scope it to only this repository (`creapinitiative-website-redesign`),
   permission **Contents: Read and write**.
3. Copy the token to `GITHUB_TOKEN`.
4. `GITHUB_OWNER=kingsmac1`, `GITHUB_REPO=creapinitiative-website-redesign`
   (already filled in `.env.example`).

Images uploaded through the dashboard land in `public/uploads/<collection>/`
in this repo and are served instantly from `raw.githubusercontent.com` — no
redeploy needed for them to show up. PDF fields (reports, policy briefs) are
plain link inputs — paste a Google Drive share link or any public URL.

## 4. Set the environment variables

**Local development** — copy `.env.example` to `.env` and fill in the real
values (this file is gitignored, it will never be committed):

```
cp .env.example .env
```

**Production (Cloudflare Pages)** — go to the Pages project -> Settings ->
Environment Variables, and add the same 9 variables there (both Production
and Preview environments if you use previews):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`

## 5. Seed the database with the site's current content

Once the Supabase project exists, the schema is applied, and `.env` has real
Supabase values, run once from the repo root:

```
node scripts/seed-supabase.mjs
```

This inserts everything currently live on the site (all policy briefs,
reports, blog posts, the upcoming program, all gallery images, and the full
leadership roster) into the new tables, so the CMS starts populated and
nothing is lost. It's safe to re-run — it clears and re-inserts each table.

## 6. Try it out

- Visit `/dashboard`, log in with the Supabase user you created in step 1.3.
- Edit an existing entry, or upload a new image, and confirm the change shows
  up on the matching public page.
- Submit each public form (Contact, Get Involved, Donate, Newsletter footer)
  and confirm: a row appears in the dashboard's Submissions inbox, a
  confirmation email arrives at the address you submitted, and a copy arrives
  at `ADMIN_NOTIFICATION_EMAIL`.
