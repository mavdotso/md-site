# Markdownsite — Quick Start Guide

> Markdown hosting platform. Upload a .md file → get an instant subdomain (yourname.markdownsite.xyz). No Git, no build steps.

## Current Status

| Area | Status |
|------|--------|
| Local dev | ⚠️ Needs `npm install` (no node_modules) |
| Environment vars | ✅ `.env.local` has all keys set |
| Live URL | ✅ markdownsite.xyz (coming-soon page via markdownsite-temp repo) |
| App deployment | ❌ Not deployed (Vercel may have no active project) |
| Convex backend | ✅ Keys configured — check if deployment is active |
| R2 storage | ❌ Broken — files stored as base64 in Convex instead |
| Cloudflare Worker | ❌ Not built — subdomain routing missing |
| Subdomain serving | ❌ *.markdownsite.xyz returns nothing |

**Readiness estimate:** ~40% — upload UI + auth + basic DB done. Storage and routing are broken/missing.

## Setup (10–15 min)

```bash
cd ~/Developer/md-site
npm install
npm run dev
# In separate terminal:
npx convex dev
```

Open: http://localhost:3000

> The app will load but subdomain routing won't work locally — that requires the Cloudflare Worker (not yet built).

## Environment Variables

Set in `.env.local`:
- `CLOUDFLARE_ACCOUNT_ID` — R2 and Worker deployment
- `R2_BUCKET_NAME` — Storage bucket for markdown files
- `R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY` — R2 auth
- `R2_ENDPOINT` — R2 API endpoint
- `KV` — Cloudflare KV namespace (for subdomain routing metadata)
- `DOMAIN` — Base domain (markdownsite.xyz)
- `WORKER_URL` — Cloudflare Worker URL (not built yet)

Also needed in Convex dashboard env (from `.env.local.example`):
- `AUTH_GITHUB_ID / AUTH_GITHUB_SECRET` — GitHub OAuth
- `SITE_URL` — App URL for auth callbacks

**Missing from `.env.local`:**
- `NEXT_PUBLIC_CONVEX_URL` — Frontend needs this to connect to Convex

## Key Scripts

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npx convex dev       # Convex dev server
npx convex deploy    # Deploy Convex functions
```

## Deployment

- **Coming-soon page:** `~/Developer/markdownsite-temp` → deploys to markdownsite.xyz
- **Main app:** Not yet deployed to Vercel
- **Cloudflare Worker:** Not yet built (needed for *.markdownsite.xyz routing)

> To deploy the main app: create a Vercel project linked to the `mavdotso/md-site` repo.

## Tech Stack

- **Frontend:** Next.js 15 + Convex + Tailwind CSS
- **Backend:** Convex (database, auth, serverless functions)
- **Storage:** Cloudflare R2 (configured but broken — files stored in Convex instead)
- **Routing:** Cloudflare Worker (not built yet)
- **Auth:** GitHub OAuth via Convex Auth

## Critical Blockers Before MVP

### 1. Fix R2 storage (2 days)
Current state: markdown content stored as base64 in Convex DB (not scalable, breaks for large files).
Fix: implement proper R2 upload in Convex action → store only the R2 key in DB.

### 2. Build Cloudflare Worker (3 days)
Current state: no subdomain routing — `yourname.markdownsite.xyz` returns nothing.
Fix: create `workers/router.ts` that:
- Reads subdomain from request host
- Looks up site in Convex (or KV cache)
- Fetches markdown from R2
- Renders with chosen theme and returns HTML

### 3. Deploy main app to Vercel (1 day)
- Create Vercel project linked to md-site repo
- Set all env vars
- Configure `markdownsite.xyz` wildcard domain (*.markdownsite.xyz → Worker)

## Known Issues

- R2 storage integration incomplete (base64 hack in place)
- Cloudflare Worker not written
- Auth may need `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- Vercel deployment not set up
- No themes implemented yet (just raw markdown rendering)

## Docs

- `docs/MISSION.md` — Product vision, target users, positioning
- `docs/ROADMAP.md` — Full feature roadmap and phases  
- `docs/TECH-STACK.md` — Architecture decisions and rationale

## Related Repos

- `~/Developer/markdownsite-temp` — Coming-soon page (live at markdownsite.xyz, commit 145cdbe)
- `~/Developer/md-site-temp` — Another temp scaffold (likely redundant)

---
*Created: Feb 18, 2026 | Est. to MVP: 2-3 weeks*
