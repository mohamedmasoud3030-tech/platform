#!/usr/bin/env bash
# ==========================================================================
# LENA — run the exact CI pipeline on this machine.
#
# Why this exists: GitHub Actions for this repository stopped accepting jobs
# on 2026-09-11 (jobs end in ~2 s with an empty runner name and no log blob,
# while `actions/permissions` still reports enabled/all — the signature of an
# exhausted Actions quota or a spending limit). Until that is resolved in
# GitHub billing, verification must not depend on GitHub. This script runs
# the same steps, in the same order, as .github/workflows/ci.yml:
#
#   validate      : pnpm install --frozen-lockfile → typecheck → test → build
#                   → verify → Guardian static integrity
#   guardian-web  : build → npm ci → chromium → verify:assets → smoke →
#                   safety → visual
#
# Local-only differences are explicit and printed:
#   - a browser fallback is used when the sandbox cannot install Chromium's
#     system libraries (LENA_LOCAL_BROWSER=1, one worker, sparticuz binary);
#   - the visual suite is skipped by default *only* because CI owns the
#     baselines (D7); run it with `LENA_RUN_VISUAL=1`.
#
# Usage:
#   bash tools/ci-local.sh                 # full pipeline
#   LENA_RUN_VISUAL=1 bash tools/ci-local.sh
#   LENA_ONLY=verify bash tools/ci-local.sh
# ==========================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GUARD="$ROOT/test/lena-runtime-visual-guardian-v1"
ONLY="${LENA_ONLY:-}"
FAILED=()
STARTED_AT=$(date +%s)

if [ -d "$HOME/.local/node24/bin" ]; then
  export PATH="$HOME/.local/node24/bin:$PATH"
fi

step() {
  local name="$1"; shift
  if [ -n "$ONLY" ] && [ "$ONLY" != "$name" ]; then return 0; fi
  printf '\n\033[1m▸ %s\033[0m\n' "$name"
  local started; started=$(date +%s)
  if "$@"; then
    printf '\033[32m  ✓ %s (%ss)\033[0m\n' "$name" "$(( $(date +%s) - started ))"
  else
    printf '\033[31m  ✗ %s (%ss)\033[0m\n' "$name" "$(( $(date +%s) - started ))"
    FAILED+=("$name")
  fi
}

echo "  node $(node -v) · pnpm $(pnpm -v 2>/dev/null || echo missing) · $(uname -sm)"

# ── validate ──────────────────────────────────────────────────────────────
step "install" bash -c 'cd "$0" && { [ -d node_modules ] || pnpm install --frozen-lockfile; }' "$ROOT"
step "typecheck" bash -c 'cd "$0" && { [ -f lib/api-zod/dist/index.d.ts ] || npx tsc --build --force >/dev/null 2>&1; } && pnpm run typecheck' "$ROOT"
step "test" bash -c 'cd "$0" && pnpm test' "$ROOT"
step "build" bash -c 'cd "$0" && pnpm run build' "$ROOT"
step "verify" bash -c 'cd "$0" && pnpm run verify' "$ROOT"
step "guardian-static" node "$GUARD/scripts/verify-assets.mjs"

# ── guardian-browser ──────────────────────────────────────────────────────
if [ ! -d "$GUARD/node_modules" ]; then
  step "guardian-deps" bash -c 'cd "$0" && npm ci' "$GUARD"
fi

step "guardian-assets" bash -c 'cd "$0" && npm run verify:assets' "$GUARD"

GUARDIAN_ENV=""
if ! ls "$HOME"/.cache/ms-playwright/chromium_headless_shell-*/ >/dev/null 2>&1; then
  echo "  (no system Chromium cache — using the repository's local browser fallback)"
  GUARDIAN_ENV="LENA_LOCAL_BROWSER=1"
fi

step "guardian-smoke" bash -c "cd '$GUARD' && ${GUARDIAN_ENV} npx playwright test --project=smoke --reporter=line"
step "guardian-safety" bash -c "cd '$GUARD' && ${GUARDIAN_ENV} npx playwright test --project=safety --reporter=line"

if [ "${LENA_RUN_VISUAL:-0}" = "1" ]; then
  step "guardian-visual" bash -c "cd '$GUARD' && ${GUARDIAN_ENV} npx playwright test --project=visual --reporter=line"
else
  printf '\n\033[33m▸ guardian-visual skipped\033[0m — CI owns the baselines (D7).\n'
  printf '  Run it with: LENA_RUN_VISUAL=1 bash tools/ci-local.sh\n'
fi

# ── summary ───────────────────────────────────────────────────────────────
printf '\n\033[1m══ summary (%ss) ══\033[0m\n' "$(( $(date +%s) - STARTED_AT ))"
if [ "${#FAILED[@]}" -eq 0 ]; then
  printf '\033[32mAll local CI steps passed.\033[0m\n'
  exit 0
fi
printf '\033[31mFailed steps: %s\033[0m\n' "${FAILED[*]}"
exit 1
