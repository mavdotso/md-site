# TECH-STACK.md — Markdown Site

## Current Stack

### Frontend
- **Next.js 15.4.6** — React framework with App Router
- **React 19.1.0** — UI library
- **TypeScript 5.x** — Type safety
- **Tailwind CSS 4** — Utility-first styling
- **shadcn/ui** — Component library (Radix UI primitives)
- **react-markdown** — Markdown rendering
- **remark-gfm** — GitHub Flavored Markdown support

### Backend
- **Convex** — Serverless database + auth + mutations
  - `@convex-dev/auth` — Email/password authentication
  - `@convex-dev/r2` — Cloudflare R2 integration helper
- **Cloudflare Workers** (planned) — Subdomain routing
- **Cloudflare R2** (planned) — File storage

### Deployment
- **Vercel** — Next.js hosting (currently DOWN)
- **Cloudflare** — DNS + Workers + R2

### Development
- **Turbopack** — Fast dev mode bundler
- **ESLint** — Code linting
- **Wrangler** — Cloudflare Workers CLI

---

## Architecture Overview

```
User uploads .md file
      ↓
Next.js app (Vercel)
      ↓
Convex mutation (createSite)
      ↓
Store content in R2 (TODO: currently base64 in Convex)
      ↓
Generate subdomain entry
      ↓
User visits subdomain.markdownsite.xyz
      ↓
Cloudflare Worker intercepts request (TODO: not implemented)
      ↓
Fetch markdown from R2
      ↓
Render markdown → HTML with theme
      ↓
Serve to user
```

---

## File Structure

```
md-site/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home (upload + preview)
│   ├── dashboard/page.tsx      # User dashboard (list sites)
│   ├── signin/page.tsx         # Auth: Sign in
│   ├── signup/page.tsx         # Auth: Sign up
│   ├── api/
│   │   └── sites/
│   │       ├── upload/route.ts # Upload handler
│   │       ├── list/route.ts   # List user sites
│   │       └── delete/route.ts # Delete site
│   └── ConvexClientProvider.tsx # Convex React provider
│
├── components/
│   ├── upload-zone.tsx         # Drag-drop file upload
│   ├── markdown-preview.tsx    # Live markdown preview
│   └── ui/                     # shadcn components
│
├── convex/
│   ├── schema.ts               # Database schema (sites, files, users)
│   ├── sites.ts                # Site CRUD mutations
│   ├── files.ts                # File upload/download (R2)
│   ├── auth.ts                 # Auth config
│   └── http.ts                 # HTTP endpoints
│
├── cloudflare-worker/          # TODO: subdomain routing
│   └── router.ts               # (not implemented)
│
├── docs/
│   ├── MISSION.md              # Product vision
│   ├── ROADMAP.md              # Development plan
│   └── TECH-STACK.md           # This file
│
├── public/                     # Static assets
├── .env.local                  # Local environment variables
├── wrangler.toml               # Cloudflare Worker config
├── package.json                # Dependencies
└── README.md                   # Setup instructions
```

---

## Convex Schema

```typescript
sites: {
  userId: v.id("users"),
  name: v.string(),
  subdomain: v.string(),          // e.g., "portfolio"
  contentKey: v.optional(v.string()), // R2 key or base64 content
  createdAt: v.number(),
  updatedAt: v.number(),
}

files: {
  userId: v.id("users"),
  siteId: v.optional(v.id("sites")),
  fileName: v.string(),
  fileKey: v.string(),            // R2 storage key
  fileSize: v.number(),
  mimeType: v.string(),
  uploadedAt: v.number(),
}

users: {
  // Managed by @convex-dev/auth
}
```

**Indexes:**
- `sites.by_user` — Query all sites by userId
- `sites.by_subdomain` — Lookup site by subdomain
- `files.by_user` — Query all files by userId
- `files.by_site` — Query all files for a site

---

## Environment Variables

### Local (.env.local)
```bash
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
```

### Convex (Production)
```bash
SITE_URL=https://markdownsite.xyz
R2_BUCKET=markdownsite-files
R2_TOKEN=<cloudflare-r2-token>
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.4.6 | React framework |
| `react` | 19.1.0 | UI library |
| `convex` | 1.24.8 | Backend database |
| `@convex-dev/auth` | 0.0.88 | Authentication |
| `@convex-dev/r2` | 0.7.1 | R2 storage helper |
| `react-markdown` | 10.1.0 | Markdown rendering |
| `remark-gfm` | 4.0.1 | GitHub Flavored Markdown |
| `gray-matter` | 4.0.3 | Frontmatter parsing |
| `tailwindcss` | 4.x | Styling |
| `lucide-react` | 0.539.0 | Icons |
| `wrangler` | 4.29.0 | Cloudflare CLI |

---

## Tech Debt

### Critical
1. **R2 Integration Incomplete**
   - Current: Stores base64 content in Convex (not scalable)
   - Needed: Upload to R2, store keys in Convex, retrieve on demand

2. **Cloudflare Worker Missing**
   - No subdomain routing implemented
   - Subdomains currently don't resolve

3. **Deployment Broken**
   - 404 on Vercel (deployment not found)
   - Needs rebuild + redeploy

### Medium Priority
4. **No Error Handling**
   - Subdomain collisions not validated
   - File type/size limits not enforced
   - No rate limiting

5. **Security Gaps**
   - No XSS protection in markdown rendering
   - No content moderation
   - No CSRF tokens

6. **Missing Tests**
   - Zero test coverage
   - No integration tests for upload/delete/render flows

### Low Priority
7. **No Analytics**
   - No page view tracking
   - No user behavior insights

8. **No Email System**
   - No welcome emails
   - No password reset flow

9. **No Themes**
   - Only raw markdown rendering
   - No visual customization

---

## Performance Considerations

### Current Bottlenecks
- **Base64 storage in Convex** — Large files cause database bloat
- **No CDN caching** — Every request hits Convex
- **Markdown parsed on every view** — Should cache rendered HTML

### Planned Optimizations
1. Move files to R2 (cheap, scalable storage)
2. Cache rendered HTML in Cloudflare KV
3. Use Cloudflare CDN for static assets
4. Lazy-load images in markdown
5. Compress markdown before storage (gzip)

---

## Scaling Strategy

### Current Limits (Convex Free Tier)
- 1GB database storage
- 10GB bandwidth/month
- 1M function calls/month

### Projected Usage (1,000 users)
- Sites: ~3,000 (3 per user avg)
- Storage: ~500MB markdown + metadata
- Bandwidth: ~50GB/month (assuming 10 views/site/month)
- Function calls: ~500K/month (uploads, deletes, queries)

**Verdict:** Convex free tier sufficient until ~500 users. After that, need paid plan ($25/mo unlimited).

### R2 Costs (Cloudflare)
- Storage: $0.015/GB/month
- Class B operations: $0.36/million (writes)
- Class A operations: Free (reads)

**Example:** 10,000 sites x 100KB avg = 1GB storage = $0.015/mo

**Verdict:** R2 is cheap enough to ignore until massive scale.

---

## Alternatives Considered

### Storage
- ❌ **AWS S3** — More expensive than R2, complex IAM
- ❌ **Vercel Blob** — Vendor lock-in, pricing unclear
- ✅ **Cloudflare R2** — Cheap, no egress fees, Workers integration

### Database
- ❌ **Supabase** — Overkill for simple schema, hosting complexity
- ❌ **Firebase** — Pricing unpredictable at scale
- ✅ **Convex** — Serverless, real-time, generous free tier

### Hosting
- ❌ **Netlify** — Similar to Vercel, no clear advantage
- ❌ **Self-hosted** — Too much ops overhead
- ✅ **Vercel** — Zero-config Next.js, free SSL, edge network

---

## Future Tech Additions

### Short-term
- **Resend** — Transactional emails (welcome, password reset)
- **Stripe** — Payments for Pro/Team plans
- **Plausible** — Privacy-first analytics

### Long-term
- **Meilisearch** — Full-text search across sites
- **Inngest** — Background jobs (bulk imports, exports)
- **Linear** — Bug tracking + feature requests
- **Playwright** — E2E tests for upload/render flows

---

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server (Next.js + Convex)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Deploy Convex functions
npx convex deploy

# Deploy Cloudflare Worker (TODO)
npx wrangler deploy
```

---

## Deployment Checklist (When Reviving)

- [ ] Fix Vercel deployment (rebuild + redeploy)
- [ ] Set Convex production env vars (R2 credentials, SITE_URL)
- [ ] Configure Cloudflare DNS for `*.markdownsite.xyz`
- [ ] Deploy Cloudflare Worker for subdomain routing
- [ ] Test end-to-end: upload → subdomain → render
- [ ] Enable monitoring (Vercel Analytics, Cloudflare Web Analytics)
- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure backups (Convex auto-backs up, but test restore)

---

**Last Updated:** February 16, 2026
