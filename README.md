# ENCC ERP Requirements Hub

Protected documentation portal for ENCC ERP business requirements — built for analysts, client review, and developers.

## Quick start

```bash
cd encc-requirements
npm install
cp .env.example .env.local   # set passwords
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be prompted for a password.

### Default passwords (change in `.env.local`)

| Role | Env variable | Default (dev) |
|------|----------------|---------------|
| ENCC client (review, score, approve) | `ENCC_CLIENT_PASSWORD` | `encc-review-2026` |
| Yaqeen admin (unlock documents) | `ENCC_ADMIN_PASSWORD` | `yaqeen-admin-2026` |

## Contract review workflow

1. **Yaqeen** publishes module documentation (unlocked)
2. **ENCC client** logs in, reviews content, submits **three scores (0–3)**:
   - Completeness · Accuracy · Sign-off readiness
3. **ENCC** adds feedback and either:
   - **Approve & lock** → document frozen, payment milestone marked released
   - **Return for revision** → Yaqeen updates and resubmits
4. **Yaqeen admin** can unlock approved documents for edits if needed

Pages: **Review & Approvals** (`/approvals`) · **§25 on each module page**

## What this project does

- **Password-protected** access for client and admin roles
- **Module overview** — department structure, general standards, executives
- **Section pages** — fields, workflows, business rules (Template v2.2)
- **§25 Review scoring** — three scores 0–3, client approval, document lock
- **Feedback** — client comments per module/section
- **Evidence uploads** — form scans (disabled when module locked)
- **Glossary** — shared terminology

## Project structure

```
src/content/modules/     # Requirement definitions (TypeScript)
supabase/schema.sql      # Database tables + storage bucket (run once in Supabase)
.env.local               # Passwords + Supabase keys (never commit)
```

### Hosted deployment (Vercel / serverless)

Supabase URL, API key, and portal passwords are **built into** `src/lib/env.ts` — no Vercel env vars required.

Run `supabase/schema.sql` once in **Supabase → SQL Editor** to create tables and the `evidence` storage bucket.

If actions fail online with a row-level security error, also run `supabase/fix-rls.sql` (or `node scripts/apply-fix-rls.mjs` from your machine).

To override any value on a specific host, set the matching env var (see `.env.example`).

## Adding a new module

1. Create `src/content/modules/{id}/index.ts`
2. Register in `src/content/modules/index.ts`
3. Client reviews via `/modules/{id}#review-approval`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |

---

Yaqeen Technology · ENCC ERP · Template v2.2
