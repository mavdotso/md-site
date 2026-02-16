# ROADMAP.md — Markdown Site

## Current Status: ~40% Complete

**Last worked on:** January 2025 (abandoned mid-build)  
**Deployment:** DOWN (404 on Vercel)  
**Time to MVP:** 2-3 weeks

---

## Phase 1: Core Infrastructure (Week 1)
**Goal:** Get basic hosting working end-to-end

### 1.1 Complete R2 Integration
- [ ] Fix Cloudflare R2 upload (currently stores base64 in Convex — not scalable)
- [ ] Implement `convex/files.ts` mutations for R2 upload/download
- [ ] Add file size limits (10MB for free, 50MB for pro)
- [ ] Test: Upload .md → stored in R2 → retrieve via key

### 1.2 Cloudflare Worker for Subdomains
- [ ] Create `cloudflare-worker/router.ts` for subdomain routing
- [ ] Map `*.markdownsite.xyz` → Cloudflare Worker
- [ ] Fetch markdown from R2 based on subdomain
- [ ] Render markdown → HTML with basic styling
- [ ] Deploy to Cloudflare Workers

### 1.3 DNS & Deployment
- [ ] Configure Cloudflare DNS for `*.markdownsite.xyz`
- [ ] Deploy Next.js app to Vercel (fix current 404)
- [ ] Test: `portfolio.markdownsite.xyz` → renders uploaded markdown

**Success Criteria:**  
✅ Upload .md → get live subdomain in <10 seconds

---

## Phase 2: Essential Features (Week 2)
**Goal:** Make it usable and differentiated

### 2.1 Site Management
- [ ] Dashboard: list all sites, sort by date/name
- [ ] Edit site: re-upload markdown, update content
- [ ] Delete site: remove from Convex + R2
- [ ] Site settings: change subdomain, toggle public/private

### 2.2 Themes System
- [ ] Create 3 base themes: Minimal, Portfolio, Blog
- [ ] Theme selector in upload flow
- [ ] Auto-detect theme from markdown structure (H1 = title, bullets = features, etc.)
- [ ] CSS variables for easy customization

### 2.3 SEO & Metadata
- [ ] Extract frontmatter from markdown (title, description, og:image)
- [ ] Generate OpenGraph tags for social sharing
- [ ] Auto-generate favicon from first letter of title
- [ ] Sitemap.xml generation

**Success Criteria:**  
✅ Sites look professional (not raw markdown)  
✅ Sites are shareable on Twitter/LinkedIn with preview cards

---

## Phase 3: Polish & Launch (Week 3)
**Goal:** Ship MVP and get first 100 users

### 3.1 Landing Page
- [ ] Hero: "Publish markdown sites in 60 seconds"
- [ ] Features: Zero config, instant hosting, beautiful themes
- [ ] Example sites gallery (3-5 sample sites)
- [ ] Pricing table (Free vs Pro)
- [ ] CTA: "Try it free" → signup

### 3.2 Onboarding
- [ ] First-time user tutorial (upload example.md)
- [ ] Email confirmation flow
- [ ] Welcome email with tips + example sites

### 3.3 Analytics (Basic)
- [ ] Track: site views, unique visitors (privacy-first, no cookies)
- [ ] Dashboard: simple chart (last 30 days)
- [ ] Export CSV for pro users

### 3.4 Launch Prep
- [ ] Create demo video (60-second walkthrough)
- [ ] Write Product Hunt description
- [ ] Prepare launch tweet thread
- [ ] Set up support email (hello@markdownsite.xyz)

**Success Criteria:**  
✅ 100 sites published in first month  
✅ Featured on Product Hunt / Hacker News

---

## Phase 4: Growth Features (Post-MVP)
**Goal:** Differentiate and monetize

### 4.1 AI-Powered Themes
- [ ] Analyze markdown content → suggest optimal theme
- [ ] Generate custom color palettes from content
- [ ] Auto-layout based on document structure (blog vs portfolio vs docs)

### 4.2 Custom Domains
- [ ] Allow users to connect `yourdomain.com`
- [ ] Auto-generate SSL certs via Cloudflare
- [ ] DNS verification flow

### 4.3 Obsidian Plugin
- [ ] Build plugin: "Publish to markdownsite.xyz"
- [ ] One-click publish from Obsidian vault
- [ ] Sync updates automatically

### 4.4 Version History
- [ ] Track all edits with timestamps
- [ ] Rollback to previous versions
- [ ] Diff view (show what changed)

### 4.5 Collaboration
- [ ] Invite team members to edit sites
- [ ] Comments on sections (like Google Docs)
- [ ] Shared workspaces (Team plan)

---

## Post-Launch Optimization

### Performance
- [ ] CDN caching for static sites
- [ ] Lazy-load images in markdown
- [ ] Compress markdown before storage

### Monetization
- [ ] Stripe integration for Pro/Team plans
- [ ] Usage-based pricing (bandwidth, storage)
- [ ] Affiliate program (20% recurring)

### Community
- [ ] Gallery of top sites (curated)
- [ ] Featured site of the week
- [ ] User-submitted themes marketplace

---

## Tech Debt to Address

1. **R2 Integration**: Current code stores base64 in Convex — not scalable
2. **Error Handling**: No validation for subdomain collisions, file types, size limits
3. **Security**: No rate limiting, XSS protection, or content moderation
4. **Tests**: Zero test coverage — need integration tests for upload/delete/render flows
5. **Docs**: Missing API docs, webhook docs, plugin SDK

---

## Metrics to Track

**Engagement:**
- Sites created per week
- Active sites (viewed in last 7 days)
- Average views per site

**Conversion:**
- Free → Pro conversion rate
- Churn rate
- Lifetime value (LTV)

**Product:**
- Upload success rate
- Average time to first site (onboarding friction)
- Theme distribution (which themes are popular)

---

## Dependencies

**External:**
- Cloudflare R2 (storage)
- Cloudflare Workers (subdomain routing)
- Convex (DB + auth)
- Vercel (Next.js hosting)

**Internal:**
- Stripe (payments)
- Resend (transactional emails)
- Plausible (analytics, privacy-first)

---

## Open Questions

1. **Subdomain limits**: Allow unlimited free subdomains or cap at 3?
2. **Content moderation**: How to handle spam/abuse? Manual review or AI?
3. **Markdown extensions**: Support MDX? Mermaid diagrams? Embeds?
4. **Pricing**: $5/mo competitive enough vs Notion ($8), GitBook ($6.70)?
5. **Positioning**: "Markdown hosting" or "No-code website builder"?

---

## Next Steps (If Reviving)

1. Complete R2 integration (1-2 days)
2. Build Cloudflare Worker for subdomain routing (2-3 days)
3. Fix Vercel deployment (1 day)
4. Test end-to-end flow (1 day)
5. Build 3 basic themes (2-3 days)
6. Create landing page (2 days)
7. Soft launch to 10 beta users
8. Iterate based on feedback
9. Public launch on Product Hunt

**Total time:** 2-3 weeks full-time
