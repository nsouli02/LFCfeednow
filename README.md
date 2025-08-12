## Supabase Setup

Create tables and seed admin user:

```sql
-- Manual posts table
create table if not exists public.manual_posts (
  id text primary key,
  title text not null,
  description text not null,
  full_text text,
  media_url text,
  permalink_url text,
  timestamp timestamptz not null,
  source_label text
);

-- Admins table (single admin supported)
create table if not exists public.admins (
  id bigint generated always as identity primary key,
  password_hash text
);

-- Insert/replace single admin password hash (bcrypt)
-- Replace the sample hash below with your own: generate using scripts/hash-code.mjs
insert into public.admins (password_hash)
values ('$2a$10$exampleexampleexampleexampleexampleexampleexamplee')
on conflict do nothing;
```

## TransferWire

Next.js app that aggregates transfer updates from social sources, removes reporter names, and generates stylish headlines.

### Setup

1. Copy `.env.local.example` to `.env.local` and fill tokens/IDs:
   - `FB_ACCESS_TOKEN` and `FB_PAGE_IDS` (comma-separated page IDs)
   - `IG_ACCESS_TOKEN` and `IG_USER_IDS` (comma-separated IG user IDs)

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```

Open http://localhost:3000

### Notes

- Uses Facebook/Instagram Graph APIs. You need appropriate app permissions to read public content.
- Names of reporters are removed from content before display.





