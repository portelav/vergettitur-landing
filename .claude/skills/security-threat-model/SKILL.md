---
name: security-threat-model
description: "Repository-grounded threat modeling that enumerates trust boundaries, assets, attacker capabilities, abuse paths, and mitigations, and writes a concise Markdown threat model. Trigger only when the user explicitly asks to threat model a codebase or path, enumerate threats/abuse paths, or perform AppSec threat modeling. Do not trigger for general architecture summaries, code review, or non-security design work."
license: MIT
metadata:
  author: openai
---

# Threat Model Source Code Repo

Deliver an actionable AppSec-grade threat model **specific to this repository**, not a generic checklist. Anchor every architectural claim to evidence in the repo (files, routes, queries) and keep assumptions explicit. Prioritize realistic attacker goals and concrete impacts.

This project is a **public viral web game** (Next.js + TypeScript + React, Postgres for leaderboard/saved teams, `@vercel/og` share cards, deployed on Vercel). No login in v1. The example below is calibrated to that — re-derive against the actual code each time.

## When to Apply

- User asks to threat model the codebase or a specific path
- User requests enumeration of threats / abuse paths
- User wants AppSec analysis of system boundaries and entry points

## Workflow

### 1. Scope and extract the system model
Read the repo and list, with evidence: components (Next.js app, Route Handlers / Server Actions, DB, static dataset), entry points (public pages, API routes, the OG/share-card route, leaderboard write), and data stores (Postgres tables, env-var secrets).

### 2. Derive trust boundaries, assets, entry points
- **Boundaries:** Internet → Next.js (HTTPS); client → Route Handlers/Server Actions; server → Postgres (parameterized); server → external data sources/CDN.
- **Assets:** DB connection string & API keys (env, server-only); leaderboard/replay integrity (`teams_built`, `share_slug`); availability under viral load.
- Note non-capabilities explicitly (e.g. external attacker can't reach Postgres directly).

### 3. Calibrate attacker capabilities
- **External (anonymous):** the only realistic actor in v1 (no auth). Can hit any public route, replay/forge leaderboard writes, fuzz the share-card route, scrape, and flood.
- **(v2) Authenticated user:** once profiles exist, add account/session threats.

### 4. Enumerate threats as abuse paths
Per threat: attacker goal → step-by-step abuse path → impacted assets → classification. Game-relevant examples:

- **T1 — Forged/spoofed leaderboard entries:** client computes `strength`/`verdict`; attacker POSTs arbitrary values → fake "invencível" entries pollute the board. *Integrity.*
- **T2 — Share-card injection:** attacker crafts a team/nickname with markup/control chars → reflected into the OG image or page meta tags. *XSS / content spoofing.*
- **T3 — Write flooding / DoS:** automated mass submissions during a viral spike → DB/connection exhaustion, cost blowup. *Availability / cost.*
- **T4 — Slug enumeration / IDOR:** guessable `share_slug` → scrape or enumerate all saved teams. *Info disclosure.*
- **T5 — Secret leakage:** DB string / API key bundled into client via `NEXT_PUBLIC_` or imported into a client component. *Credential exposure.*
- **T6 — SQL injection:** raw string-concat query in a Route Handler. *Data exfil/integrity.*

### 5. Prioritize with likelihood × impact
Rate each (Low/Med/High) and state assumptions. For this game, T1/T2/T3 are the highest-likelihood given the anonymous, viral, shareable nature.

### 6. Validate context and assumptions
State key assumptions (e.g. "React escapes by default", "queries are parameterized") and ask the user: deployment model, expected peak load, whether scores must be authoritative, and any future auth/profiles.

### 7. Recommend mitigations
Map each threat to a concrete fix:
- T1 → recompute/validate score server-side; reject impossible values.
- T2 → whitelist/escape & length-cap all user-influenced strings before rendering into OG/meta.
- T3 → rate-limit writes (per IP/edge), add a cheap proof-of-work or captcha if needed, cap DB connections.
- T4 → unguessable random slugs; no internal IDs in URLs.
- T5 → keep secrets server-only; audit for `NEXT_PUBLIC_` misuse and client imports.
- T6 → parameterized queries / query builder everywhere.
Plus baseline: CSP + security headers, HSTS, secure cookies (when auth lands).

### 8. Quality check
- All entry points covered (pages, API, share-card route, leaderboard write)
- All trust boundaries represented in threats
- Assumptions explicit; mitigations concrete and located in code

## References

- Original skill: https://github.com/openai/skills/tree/main/skills/.curated/security-threat-model
- OWASP Threat Modeling: https://owasp.org/www-community/Threat_Modeling
- STRIDE: https://learn.microsoft.com/en-us/previous-versions/commerce-server/ee823878(v=cs.20)
