---
name: security-best-practices
description: "Perform security best-practice reviews and suggest improvements for this web game (Next.js + TypeScript + React). Trigger only when the user explicitly requests security best practices guidance, a security review/report, or secure-by-default coding help. Do not trigger for general code review, debugging, or non-security tasks."
license: MIT
metadata:
  author: openai
---

# Security Best Practices

## Overview

This skill provides security best-practice guidance for this web game's stack: **Next.js (App Router) + TypeScript + React**, with Postgres (leaderboard) and `@vercel/og` (share cards). It can operate in three modes:

1. **Generation mode (default)**: Write secure-by-default code when creating new features
2. **Passive review mode**: Notice and flag security issues while working in the codebase
3. **Active audit mode**: Generate comprehensive security reports when explicitly requested

## When to Apply

Activate this skill when:
- User explicitly requests security best practices guidance
- User asks for a security review or vulnerability report
- User requests secure-by-default coding help
- Working with authentication, authorization, or sensitive data handling
- Implementing input validation, output encoding, or API security
- Working with file uploads, SQL queries, or external API calls

## Workflow

### 1. Identify Stack

This project:
- **Framework:** Next.js (App Router), TypeScript, React
- **Data:** PostgreSQL (leaderboard / saved teams), accessed from Route Handlers / Server Actions
- **Share cards:** `@vercel/og`

### 2. Review Security Best Practices

Focus on:
- React/Next security (XSS prevention, safe rendering, no secrets in client bundles)
- Server-side input validation on every Route Handler / Server Action (never trust the client)
- SQL injection prevention (parameterized queries / query builder, never string concat)
- Share-card (OG image) injection and leaderboard/API abuse

### 3. Operating Modes

#### Generation Mode (Default)
- Follow all MUST requirements
- Validate input on the server with a schema (e.g. zod) on every Route Handler / Server Action
- Use parameterized queries for all DB access
- Use React safe rendering patterns (avoid `dangerouslySetInnerHTML` unless necessary)
- Implement proper input validation and output encoding

#### Passive Review Mode
- Notice security issues in touched/nearby code
- Flag critical vulnerabilities with brief explanation and safe fix
- Focus on high-impact issues (SQL injection, XSS, authentication bypass)

#### Active Audit Mode
- Systematically search codebase for security violations
- Generate structured security report (see Report Format below)
- Prioritize findings by severity (Critical → High → Medium → Low)

## Server-side (Next.js Route Handlers / Server Actions)

### SQL Injection Prevention

```typescript
// ✅ GOOD: parameterized query (pg)
await pool.query('SELECT * FROM teams_built WHERE share_slug = $1', [slug]);

// ✅ GOOD: query builder / ORM with bindings (Drizzle, Prisma) — never raw concat

// ❌ BAD: string concatenation
await pool.query(`SELECT * FROM teams_built WHERE share_slug = '${slug}'`);
```

### Validate every request on the server

```typescript
// ✅ GOOD: schema-validate the body in the Route Handler
import { z } from 'zod';
const body = z.object({ roster: z.array(z.string()).length(5), mode: z.enum(['classic','almanac']) })
  .parse(await req.json());
// ❌ BAD: trusting req.json() shape directly
```

### Secrets

- DB connection strings / API keys live in env vars (server-only). Never prefix with `NEXT_PUBLIC_` and never import them into client components.

## JavaScript/TypeScript/React Security Best Practices

### XSS Prevention

```typescript
// ✅ GOOD: React automatically escapes content
function UserProfile({ name }: { name: string }) {
    return <div>{name}</div>; // Safe: React escapes by default
}

// ⚠️ CAUTION: Only use dangerouslySetInnerHTML with sanitized content
import DOMPurify from 'dompurify';

function RichContent({ html }: { html: string }) {
    const clean = DOMPurify.sanitize(html);
    return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ❌ BAD: Direct HTML injection
function UnsafeComponent({ html }: { html: string }) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### Input Validation

```typescript
// ✅ GOOD: Validate on both client and server
import { z } from 'zod';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type UserInput = z.infer<typeof userSchema>;

// ❌ BAD: Trust client-side validation only
if (email.includes('@')) {
    // Not sufficient - validate on server too
}
```

### Secure API Calls

```typescript
// ✅ GOOD: Use HTTPS, validate responses
async function fetchUserData(userId: string) {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for auth
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    
    return response.json();
}

// ❌ BAD: Insecure API calls
fetch(`http://api.example.com/users/${userId}`); // HTTP, no error handling
```

### Sensitive Data Handling

```typescript
// ✅ GOOD: Never store sensitive data in localStorage
// Use httpOnly cookies for tokens (handled by backend)

// ❌ BAD: Storing tokens in localStorage
localStorage.setItem('authToken', token); // Vulnerable to XSS

// ✅ GOOD: Use secure session storage for temporary data (if needed)
sessionStorage.setItem('tempData', nonSensitiveData);
```

### URL Parameter Validation

```typescript
// ✅ GOOD: Validate and sanitize URL parameters
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    // Validate and sanitize
    const sanitized = query.trim().slice(0, 100);
    
    return <div>Searching for: {sanitized}</div>;
}

// ❌ BAD: Direct use of URL parameters
const query = window.location.search; // May contain malicious content
```

## Report Format

When generating a security report, use this structure:

```markdown
# Security Best Practices Report

## Executive Summary
[Brief overview of findings, total count by severity]

## Critical Findings
### [ID-001] [Title]
- **Location:** `path/to/file.ts:42`
- **Evidence:** [Code snippet]
- **Impact:** [What could go wrong]
- **Fix:** [Recommended solution]
- **Mitigation:** [Defense-in-depth if immediate fix is hard]

## High Findings
[...]

## Medium Findings
[...]

## Low Findings
[...]
```

## Game-specific threat surface

- **Share card (OG image):** the `@vercel/og` route renders user-influenced data (team, nickname, verdict). Validate/whitelist inputs; never reflect arbitrary HTML/markup into the image or page meta tags. Cap string lengths.
- **Leaderboard / "teams_built" writes:** the score is computed by the client engine — treat submitted `strength`/`verdict` as untrusted. Recompute or sanity-check server-side; rate-limit writes to avoid spam/flooding during a viral spike.
- **Deep-link replay (`share_slug`):** generate unguessable slugs; validate on lookup; don't leak internal IDs.
- **No auth in v1:** there's no login, so don't store anything that assumes a trusted user; profiles (v2) must use httpOnly cookies, not localStorage tokens.

## Common Pitfalls

- **React/Next:** Using `dangerouslySetInnerHTML` without sanitization, leaking secrets via `NEXT_PUBLIC_`, storing tokens in localStorage.
- **General:** Trusting client-side validation/score only, not validating request bodies, exposing sensitive data in error messages.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/blog/security-nextjs-server-components-actions)
- [React escape hatches](https://react.dev/learn/escape-hatches)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
