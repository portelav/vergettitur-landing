#!/usr/bin/env node
// statusline — Node implementation (no jq/bash dependency, cross-platform).
// Reads the Claude Code statusline JSON on stdin and prints:
//   [🦴<caveman-level>] <dir>[<branch>] <context-bar> <pct>%
//
// Replaces the original jq+bash statusline.sh so it works on Windows where
// jq is not installed. Node is already required by the caveman hooks.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return '';
  }
}

let input = {};
try { input = JSON.parse(readStdin() || '{}'); } catch (e) { input = {}; }

const dir = (input.workspace && input.workspace.current_dir) || process.cwd();
const remaining = input.context_window && input.context_window.remaining_percentage;

// git branch (best-effort)
let branch = '';
try {
  branch = execSync('git rev-parse --abbrev-ref HEAD', {
    cwd: dir,
    stdio: ['ignore', 'pipe', 'ignore'],
  }).toString().trim();
} catch (e) { /* not a repo / no git */ }

// caveman active flag
const VALID = new Set([
  'off', 'lite', 'full', 'ultra',
  'wenyan-lite', 'wenyan', 'wenyan-full', 'wenyan-ultra',
  'commit', 'review', 'compress',
]);
const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.caveman-active');

let out = '';
try {
  const st = fs.lstatSync(flagPath);
  if (st.isFile() && !st.isSymbolicLink() && st.size <= 64) {
    const level = fs.readFileSync(flagPath, 'utf8').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (VALID.has(level) && level !== 'off') {
      out = `\x1b[35m🦴${level}\x1b[0m `;
    }
  }
} catch (e) { /* no flag */ }

out += path.basename(dir);
if (branch) out += `[${branch}]`;

if (remaining !== undefined && remaining !== null && remaining !== '') {
  const pct = Math.round(Number(remaining));
  if (!Number.isNaN(pct)) {
    const filled = Math.floor(pct / 20);
    const empty = 5 - filled;
    const bar = '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, empty));
    let color = '\x1b[31m';            // red
    if (pct > 60) color = '\x1b[32m';   // green
    else if (pct >= 30) color = '\x1b[33m'; // yellow
    out += ` ${color}${bar}\x1b[0m ${pct}%`;
  }
}

process.stdout.write(out + '\n');
