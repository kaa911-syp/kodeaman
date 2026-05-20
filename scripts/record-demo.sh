#!/usr/bin/env bash
# ============================================================================
# AspidaSec Demo Recording Script
# ============================================================================
#
# Creates an animated terminal recording of AspidaSec in action.
# Uses `asciinema` to record and `agg` to convert to GIF.
#
# Prerequisites:
#   - asciinema: pip install asciinema  (or: brew install asciinema)
#   - agg:       cargo install --git https://github.com/asciinema/agg
#   - AspidaSec built: pnpm install && pnpm run build
#
# Usage:
#   chmod +x scripts/record-demo.sh
#   ./scripts/record-demo.sh
#
# Output:
#   docs/demo.cast   — raw asciinema recording
#   docs/demo.gif    — animated GIF for README
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEMO_PROJECT="$PROJECT_ROOT/examples/demo-node-express"
CAST_FILE="$PROJECT_ROOT/docs/demo.cast"
GIF_FILE="$PROJECT_ROOT/docs/demo.gif"

# Colors for the simulated typing effect
TYPING_DELAY=0.04
PAUSE_SHORT=1
PAUSE_MEDIUM=2
PAUSE_LONG=3

# ----------------------------------------------------------------------------
# Helper: simulate typing a command character by character
# ----------------------------------------------------------------------------
type_command() {
  local cmd="$1"
  for ((i = 0; i < ${#cmd}; i++)); do
    printf '%s' "${cmd:$i:1}"
    sleep "$TYPING_DELAY"
  done
  echo ""
}

# ----------------------------------------------------------------------------
# Helper: print a section header
# ----------------------------------------------------------------------------
section() {
  echo ""
  echo -e "\033[1;36m━━━ $1 ━━━\033[0m"
  echo ""
  sleep "$PAUSE_SHORT"
}

# ----------------------------------------------------------------------------
# The actual demo script (runs inside asciinema)
# ----------------------------------------------------------------------------
run_demo() {
  clear
  echo -e "\033[1;35m"
  echo "  ██╗  ██╗ ██████╗ ██████╗ ███████╗ █████╗ ███╗   ███╗ █████╗ ███╗   ██╗"
  echo "  ██║ ██╔╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗████╗ ████║██╔══██╗████╗  ██║"
  echo "  █████╔╝ ██║   ██║██║  ██║█████╗  ███████║██╔████╔██║███████║██╔██╗ ██║"
  echo "  ██╔═██╗ ██║   ██║██║  ██║██╔══╝  ██╔══██║██║╚██╔╝██║██╔══██║██║╚██╗██║"
  echo "  ██║  ██╗╚██████╔╝██████╔╝███████╗██║  ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║"
  echo "  ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝"
  echo -e "\033[0m"
  echo ""
  echo -e "  \033[1mOpen-core security coach for Indonesian developers\033[0m"
  echo -e "  \033[2mScans · Prioritizes · Teaches — in Bahasa Indonesia & English\033[0m"
  echo ""
  sleep "$PAUSE_LONG"

  # ── Demo 1: Basic scan ────────────────────────────────────────────────────
  section "1. Scan a vulnerable Node.js project"

  echo -e "\033[0;32m$\033[0m \c"
  type_command "aspidasec scan examples/demo-node-express --language id"
  sleep "$PAUSE_SHORT"

  # Simulate scan output
  echo ""
  echo -e "\033[1;33m🔍 AspidaSec v0.5.0\033[0m — Scanning examples/demo-node-express"
  echo -e "   Language: \033[1mBahasa Indonesia\033[0m"
  echo ""
  sleep "$PAUSE_SHORT"

  echo -e "  \033[2m├─\033[0m Running \033[1msemgrep\033[0m .......... \033[32m✓\033[0m 4 findings (1.2s)"
  sleep 0.5
  echo -e "  \033[2m├─\033[0m Running \033[1mnpm-audit\033[0m ........ \033[32m✓\033[0m 2 findings (0.8s)"
  sleep 0.5
  echo -e "  \033[2m└─\033[0m Deduplication ........... \033[32m✓\033[0m 5 unique findings"
  echo ""
  sleep "$PAUSE_SHORT"

  echo -e "\033[1m━━━ Top 3 Findings (by Priority Score) ━━━\033[0m"
  echo ""
  echo -e "  \033[1;31m#1 [Critical] SQL Injection in routes/users.js:42\033[0m"
  echo -e "     Priority: \033[1;31m95/100\033[0m | CWE-89 | OWASP A03"
  echo -e "     \033[33mMasalah:\033[0m Query SQL dibuat dengan menggabungkan input"
  echo -e "     pengguna secara langsung, memungkinkan penyerang"
  echo -e "     mengeksekusi perintah SQL berbahaya."
  echo -e "     \033[32mSolusi:\033[0m Gunakan parameterized query atau ORM."
  echo -e "     \033[36m🎮 +25 XP | 🏅 sql-defender\033[0m"
  echo ""
  sleep "$PAUSE_MEDIUM"

  echo -e "  \033[1;31m#2 [High] Cross-Site Scripting in views/profile.ejs:18\033[0m"
  echo -e "     Priority: \033[1;33m82/100\033[0m | CWE-79 | OWASP A07"
  echo -e "     \033[33mMasalah:\033[0m Data pengguna ditampilkan tanpa escaping,"
  echo -e "     memungkinkan injeksi script berbahaya."
  echo -e "     \033[32mSolusi:\033[0m Gunakan escaping otomatis dari template engine."
  echo -e "     \033[36m🎮 +15 XP\033[0m"
  echo ""
  sleep "$PAUSE_MEDIUM"

  echo -e "  \033[1;33m#3 [High] Vulnerable Dependency: postcss@8.4.31\033[0m"
  echo -e "     Priority: \033[1;33m78/100\033[0m | CVE-2024-47614 | OWASP A06"
  echo -e "     \033[33mMasalah:\033[0m Dependensi postcss memiliki kerentanan yang"
  echo -e "     diketahui. Ini adalah dependensi transitif dari next."
  echo -e "     \033[32mSolusi:\033[0m Update postcss dengan mengupgrade dependensi"
  echo -e "     induknya next ke versi 14.2.10."
  echo -e "     \033[36m🎮 +10 XP\033[0m"
  echo ""
  sleep "$PAUSE_MEDIUM"

  echo -e "\033[1m━━━ Summary ━━━\033[0m"
  echo -e "  Total: \033[1m5\033[0m findings | \033[31mCritical: 1\033[0m | \033[33mHigh: 3\033[0m | \033[34mMedium: 1\033[0m"
  echo -e "  XP earned: \033[36m65\033[0m | Badges: \033[36msql-defender\033[0m"
  echo -e "  Scan time: \033[2m2.4s\033[0m"
  echo ""
  sleep "$PAUSE_LONG"

  # ── Demo 2: OWASP scan ────────────────────────────────────────────────────
  section "2. OWASP Top 10 scan with HTML report"

  echo -e "\033[0;32m$\033[0m \c"
  type_command "aspidasec owasp-scan --format html --output report.html --language id"
  sleep "$PAUSE_SHORT"

  echo ""
  echo -e "\033[1;33m🛡️  OWASP Top 10 Scan\033[0m — 10 categories"
  echo ""
  sleep 0.5

  local categories=(
    "A01 Broken Access Control"
    "A02 Cryptographic Failures"
    "A03 Injection"
    "A04 Insecure Design"
    "A05 Security Misconfiguration"
    "A06 Vulnerable Components"
    "A07 Auth Failures"
    "A08 Software Integrity"
    "A09 Logging Failures"
    "A10 Server-Side Request Forgery"
  )
  local counts=(1 0 2 0 0 2 1 0 0 0)

  for i in "${!categories[@]}"; do
    local cat="${categories[$i]}"
    local count="${counts[$i]}"
    if [ "$count" -gt 0 ]; then
      echo -e "  \033[33m⚠\033[0m  ${cat} — \033[1m${count} finding(s)\033[0m"
    else
      echo -e "  \033[32m✓\033[0m  ${cat} — \033[2mno findings\033[0m"
    fi
    sleep 0.3
  done

  echo ""
  echo -e "  Coverage: \033[1;32m10/10 categories scanned (100%)\033[0m"
  echo -e "  Report:   \033[4mreport.html\033[0m (self-contained, light/dark theme)"
  echo ""
  sleep "$PAUSE_LONG"

  # ── Demo 3: Watch mode ────────────────────────────────────────────────────
  section "3. Real-time watch mode"

  echo -e "\033[0;32m$\033[0m \c"
  type_command "aspidasec watch examples/demo-node-express"
  sleep "$PAUSE_SHORT"

  echo ""
  echo -e "\033[1;33m👁️  Watching\033[0m examples/demo-node-express for changes..."
  echo -e "  \033[2mPress Ctrl+C to stop\033[0m"
  echo ""
  sleep "$PAUSE_MEDIUM"

  echo -e "  \033[2m[10:42:15]\033[0m File changed: \033[1mroutes/users.js\033[0m"
  echo -e "  \033[2m[10:42:16]\033[0m Re-scanning... \033[32m✓\033[0m 4 findings (0.9s)"
  echo -e "  \033[2m[10:42:16]\033[0m \033[32m-1 finding fixed!\033[0m SQL Injection resolved in users.js:42"
  echo -e "  \033[2m[10:42:16]\033[0m \033[36m+25 XP earned 🎉\033[0m"
  echo ""
  sleep "$PAUSE_LONG"

  # ── Demo 4: Autofix ───────────────────────────────────────────────────────
  section "4. Autofix vulnerable dependencies"

  echo -e "\033[0;32m$\033[0m \c"
  type_command "aspidasec autofix --dry-run"
  sleep "$PAUSE_SHORT"

  echo ""
  echo -e "\033[1;33m🔧 Autofix\033[0m — Dry run mode (no changes applied)"
  echo ""
  echo -e "  \033[1m1.\033[0m npm install postcss@8.5.1"
  echo -e "     \033[2mFixes: CVE-2024-47614 (postcss ReDoS vulnerability)\033[0m"
  echo -e "     \033[33mBreaking change risk: low\033[0m"
  echo ""
  echo -e "  \033[1m2.\033[0m npm install express@4.21.0"
  echo -e "     \033[2mFixes: CVE-2024-45296 (path traversal)\033[0m"
  echo -e "     \033[33mBreaking change risk: low\033[0m"
  echo ""
  echo -e "  Run without \033[1m--dry-run\033[0m to apply fixes."
  echo ""
  sleep "$PAUSE_LONG"

  # ── Closing ───────────────────────────────────────────────────────────────
  echo ""
  echo -e "\033[1;35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
  echo ""
  echo -e "  \033[1mAspidaSec\033[0m — Secure Code, Taught Right"
  echo ""
  echo -e "  \033[2mhttps://github.com/kaa911-syp/AspidaSec\033[0m"
  echo -e "  \033[2mLicense: Apache 2.0\033[0m"
  echo ""
  echo -e "\033[1;35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
  echo ""
  sleep "$PAUSE_LONG"
}

# ============================================================================
# Main: record with asciinema, then convert to GIF
# ============================================================================
main() {
  echo "AspidaSec Demo Recorder"
  echo "======================"
  echo ""

  # Check dependencies
  if ! command -v asciinema &>/dev/null; then
    echo "ERROR: asciinema not found."
    echo "Install: pip install asciinema  (or: brew install asciinema)"
    exit 1
  fi

  # Create output directory
  mkdir -p "$PROJECT_ROOT/docs"

  echo "Recording to: $CAST_FILE"
  echo ""

  # Export the demo function so the subshell can find it
  export -f run_demo type_command section
  export TYPING_DELAY PAUSE_SHORT PAUSE_MEDIUM PAUSE_LONG

  # Record
  asciinema rec \
    --overwrite \
    --title "AspidaSec — Security Coach Demo" \
    --cols 80 \
    --rows 32 \
    --command "bash -c run_demo" \
    "$CAST_FILE"

  echo ""
  echo "Recording saved: $CAST_FILE"

  # Convert to GIF if agg is available
  if command -v agg &>/dev/null; then
    echo "Converting to GIF..."
    agg \
      --theme monokai \
      --font-size 14 \
      --speed 1.5 \
      "$CAST_FILE" \
      "$GIF_FILE"
    echo "GIF saved: $GIF_FILE"
  else
    echo ""
    echo "To convert to GIF, install agg:"
    echo "  cargo install --git https://github.com/asciinema/agg"
    echo ""
    echo "Then run:"
    echo "  agg --theme monokai --font-size 14 --speed 1.5 $CAST_FILE $GIF_FILE"
  fi

  echo ""
  echo "Done! Add the GIF to your README:"
  echo '  ![AspidaSec demo](docs/demo.gif)'
}

main "$@"
