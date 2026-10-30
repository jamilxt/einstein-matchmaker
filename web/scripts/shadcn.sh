#!/usr/bin/env bash
# Runs the shadcn CLI non-interactively (used once to init, then to add components).
set -euo pipefail
cd "$(dirname "$0")/.."
export CI=1
exec npx -y shadcn@4.23.0 "$@"
