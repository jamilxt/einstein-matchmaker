#!/usr/bin/env bash
# Fetches the official EINSTEIN dataset (jigjoy-ai/einstein-matchmaker-data) next to this repo
# and links it as ./data. Safe to run twice.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="../einstein-matchmaker-data"
if [ ! -d "$SRC/data" ]; then
	git clone --depth 1 https://github.com/jigjoy-ai/einstein-matchmaker-data "$SRC"
fi
if [ ! -e data ]; then
	ln -s "$SRC/data" data
fi
echo "dataset ready: $(ls data | wc -l) files in ./data"
