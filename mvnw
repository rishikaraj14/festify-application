#!/usr/bin/env bash
# mvnw - prefer system mvn, otherwise use bundled mvn in workspace if present.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
if command -v mvn >/dev/null 2>&1; then
  mvn "$@"
  exit 0
fi
if [ -n "$M2_HOME" ] && [ -x "$M2_HOME/bin/mvn" ]; then
  "$M2_HOME/bin/mvn" "$@"
  exit 0
fi
BUNDLED="$SCRIPT_DIR/maven-mvnd-1.0.3-windows-amd64/maven-mvnd-1.0.3-windows-amd64/mvn/bin/mvn"
if [ -x "$BUNDLED" ]; then
  "$BUNDLED" "$@"
  exit 0
fi
echo "Maven not found on PATH, M2_HOME not set, and bundled mvn not found at $BUNDLED."
exit 1
