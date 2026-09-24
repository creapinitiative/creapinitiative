-- CREAP Africa Initiative — CMS + form submissions schema
--
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- after creating your project. Safe to re-run: every statement is idempotent.
--
-- RLS is enabled on every table with NO permissive policies. Nothing but the
-- app's own server code (using the service_role key, which bypasses RLS by
-- design) ever touches these tables — the browser never talks to Postgres
-- directly. This is intentional: it means we don't have to hand-write and
-- maintain policy SQL for six different content types and one submissions
-- inbox.

create extension if not exists "pgcrypto";

-- ── Policy Briefs ────────────────────────────────────────────────────────
create table if not exists public.policy_briefs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  date text not null,
  file_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.policy_briefs enable row level security;
alter table public.policy_briefs add column if not exists image_url text;

-- ── Reports (project / annual / financial) ──────────────────────────────
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('project', 'annual', 'financial')),
  title text not null,
  subtitle text,
  body text not null,
  date text not null,
  file_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.reports enable row level security;

-- ── Blog Posts ───────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  excerpt text not null,
  content text[] not null default '{}',
  image_url text,
  author text not null,
  date text not null,
  read_minutes text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;

-- ── Upcoming Programs ────────────────────────────────────────────────────
create table if not exists public.upcoming_programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null,
  theme text not null,
  summary text not null,
  image_url text,
  date text not null,
  venue text not null,
  audience text[] not null default '{}',
  skills text[] not null default '{}',
  apply_url text,
  application_deadline text,
  closing_note text,
  partner_note text,
  hashtags text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.upcoming_programs enable row level security;

-- ── Gallery Images ───────────────────────────────────────────────────────
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null,
  tall boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.gallery_images enable row level security;

-- ── Leadership Roster ────────────────────────────────────────────────────
create table if not exists public.leadership (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  team text not null check (team in ('executive', 'management', 'state')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.leadership enable row level security;

-- ── Form Submissions ─────────────────────────────────────────────────────
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('contact', 'coordinator', 'donate_interest', 'newsletter')),
  data jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);
alter table public.form_submissions enable row level security;

create index if not exists form_submissions_created_at_idx on public.form_submissions (created_at desc);
create index if not exists form_submissions_status_idx on public.form_submissions (status);
create index if not exists reports_category_idx on public.reports (category);
create index if not exists leadership_team_idx on public.leadership (team);

-- ── Migration: past-event tagging for Upcoming Programs ─────────────────
-- `create table if not exists` above won't add columns to an already-created
-- table, so this runs as a separate, idempotent statement every time the
-- file is re-run. Nullable: existing/future entries without it are treated
-- as always-upcoming (never auto-archived).
alter table public.upcoming_programs add column if not exists event_end_date date;

-- ── Migration: Knowledge Hub — Toolkits & Guides ─────────────────────────
create table if not exists public.toolkits_guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date text not null,
  file_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.toolkits_guides enable row level security;

-- ── Migration: Knowledge Hub — Press Statements ──────────────────────────
create table if not exists public.press_statements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  date text not null,
  file_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.press_statements enable row level security;

-- ── Migration: Donations (Paystack) ──────────────────────────────────────
-- One row per checkout attempt. `status` flips to 'success' only after the
-- server has confirmed the transaction with Paystack (verify API or a
-- signature-checked webhook) — never on the browser's say-so. Amounts are in
-- kobo (₦1 = 100 kobo), Paystack's smallest unit.
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  email text not null,
  amount_kobo bigint not null check (amount_kobo > 0),
  currency text not null default 'NGN',
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  channel text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.donations enable row level security;
create index if not exists donations_status_idx on public.donations (status);
create index if not exists donations_created_at_idx on public.donations (created_at desc);
