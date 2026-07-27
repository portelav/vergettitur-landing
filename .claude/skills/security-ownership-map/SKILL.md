---
name: security-ownership-map
description: "Analyze git repositories to build a security ownership topology (people-to-file), compute bus factor and sensitive-code ownership, and export CSV/JSON for graph databases and visualization. Trigger only when the user explicitly wants a security-oriented ownership or bus-factor analysis grounded in git history (for example: orphaned sensitive code, security maintainers, CODEOWNERS reality checks for risk, sensitive hotspots, or ownership clusters). Do not trigger for general maintainer lists or non-security ownership questions."
license: MIT
metadata:
  author: openai
---

# Security Ownership Map

## Overview

Build a bipartite graph of people and files from git history, then compute ownership risk and export graph artifacts for Neo4j/Gephi. Also build a file co-change graph (Jaccard similarity on shared commits) to cluster files by how they move together while ignoring large, noisy commits.

Identifies: orphaned sensitive code (stale, low bus factor), hidden owners (one person controls much of the sensitive code), sensitive hotspots, and ownership drift.

> **Note:** the analysis relies on the Python helpers `scripts/run_ownership_map.py` and `scripts/query_ownership.py` from the original skill (https://github.com/openai/skills/tree/main/skills/.curated/security-ownership-map). They are not bundled here — fetch them from that repo before running, or adapt the commands to your own tooling. Also note this project may not be a git repo yet (`git init` first).

## When to Apply

- User explicitly requests security-oriented ownership / bus-factor analysis
- User wants to identify orphaned sensitive code or hidden owners
- User needs a CODEOWNERS reality check for security-critical files

## Requirements

- Python 3 + `networkx` (`pip install networkx`)
- A git history to analyze

## Workflow

### 1. Scope the repository
- Repo root: the project root (e.g. `.` or its absolute path)
- Optional time window via `--since/--until`
- In-scope paths (e.g. `src/`, specific modules)

### 2. Define sensitivity rules
Patterns for **this project** (Next.js web game) — adjust to the actual tree:

```csv
# pattern,tag,weight
**/api/**,api,0.9
**/route.ts,api,0.9
**/lib/db/**,db,0.9
**/*.sql,db,0.8
**/og/**,share-card,0.8
**/opengraph-image*,share-card,0.8
**/middleware.ts,edge,0.8
**/.env*,secrets,1.0
**/lib/auth/**,auth,1.0
```

### 3. Run ownership analysis
From the repo root:

```bash
python scripts/run_ownership_map.py \
  --repo . \
  --out ownership-map-out \
  --since "12 months ago" \
  --sensitive-config sensitive-patterns.csv \
  --cochange-exclude "**/node_modules/**" \
  --cochange-exclude "**/*.test.*" \
  --emit-commits
```

### 4. Query results

```bash
# Top people by sensitive-code touches
python scripts/query_ownership.py --data-dir ownership-map-out people --limit 10

# Sensitive files with bus factor <= 1
python scripts/query_ownership.py --data-dir ownership-map-out files --tag secrets --bus-factor-max 1

# Orphaned sensitive code / hidden owners
python scripts/query_ownership.py --data-dir ownership-map-out summary --section orphaned_sensitive_code
python scripts/query_ownership.py --data-dir ownership-map-out summary --section hidden_owners
```

## Output Artifacts

`ownership-map-out/` contains: `people.csv`, `files.csv`, `edges.csv`, `cochange_edges.csv`, `summary.json`, `commits.jsonl` (if `--emit-commits`), `communities.json`, `cochange.graph.json`, and `*.graphml` (if `--graphml`).

## Interpreting findings

- **Orphaned sensitive code:** stale + low bus factor + sensitive tag → review for outdated practices, document/hand off.
- **Hidden owners:** one person controls >50% of sensitive code → bus factor = 1 risk; plan knowledge transfer.
- **Sensitive hotspots:** critical files with few maintainers → raise bus factor via reviews/docs.

## Notes & pitfalls

- Default excludes: bot commits, lockfiles, `.github/*`, editor config.
- Exclude tests and generated files or they inflate ownership data.
- Update sensitivity patterns to match the project's actual sensitive paths.
- Don't read bus factor without also considering recency of changes.

## References

- Original skill: https://github.com/openai/skills/tree/main/skills/.curated/security-ownership-map
- NetworkX: https://networkx.org/
