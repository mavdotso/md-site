# MISSION.md — Markdown Site (markdownsite.xyz)

## Vision
Make publishing beautiful websites from markdown files effortless — no build steps, no Git, no hosting complexity.

## Problem
Developers and writers have markdown files (READMEs, docs, portfolios, blogs) but no easy way to publish them as websites without:
- Learning static site generators (Jekyll, Hugo, Gatsby)
- Managing Git deployments
- Configuring hosting/DNS
- Writing HTML/CSS

Existing solutions:
- **GitHub Pages** — requires Git, Jekyll knowledge, complex setup
- **Notion Sites** — locked into Notion's ecosystem, not markdown-native
- **GitBook** — overkill for simple sites, requires account + complex UI
- **Read.cv** — portfolio-focused, not general markdown hosting

## Solution
**Upload markdown → get instant subdomain.**

1. Drag-drop your `.md` file
2. Choose a subdomain (e.g., `portfolio.markdownsite.xyz`)
3. Done — site is live in seconds

## Target Users
1. **Developers** — quick project docs, READMEs as sites, portfolio pages
2. **Writers** — blog posts, essays, portfolios without WordPress
3. **Students** — course notes, assignments, project documentation
4. **Non-technical creators** — anyone who writes in markdown (Obsidian users, etc.)

## Value Proposition
- **Zero friction**: No Git, no build steps, no terminal
- **Instant**: Upload → live in seconds
- **Markdown-native**: Write once, publish anywhere
- **Beautiful**: Auto-generated themes, responsive design
- **Portable**: Bring your own markdown, leave anytime

## Differentiation (Future)
1. **AI-powered themes** — analyze content, suggest optimal design
2. **One-click from Obsidian** — plugin to publish directly from vault
3. **Version history** — edit in-place, rollback anytime
4. **Custom domains** — `yourdomain.com` with one click
5. **Analytics** — simple, privacy-first page views

## Business Model
**Freemium:**
- **Free**: 3 sites, `*.markdownsite.xyz` subdomains, basic themes
- **Pro ($5/mo)**: Unlimited sites, custom domains, premium themes, analytics
- **Team ($15/mo)**: Shared workspaces, collaboration, API access

## Why Now?
- Markdown is universal (GitHub, Obsidian, Notion all use it)
- Developers want simpler tools (anti-bloat movement)
- Cloudflare R2 + Workers make this cheap to operate
- AI can auto-generate themes from content (competitive moat)

## Success Metrics
- **Launch**: 100 sites published in first month
- **PMF**: 1,000 MAU, 10% paid conversion
- **Scale**: 10,000+ sites hosted, $5K MRR

## Current Status
**~40% ready** (abandoned mid-build)
- ✅ Auth, upload UI, markdown preview, Convex schema
- ❌ R2 integration incomplete, Cloudflare Worker missing, deployment broken

## Roadmap
See `docs/ROADMAP.md`
