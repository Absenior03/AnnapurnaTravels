#!/bin/bash
chmod +x fix-imports.sh
[ -f vercel-build.sh ] && chmod +x vercel-build.sh
rm -rf .next out
./fix-imports.sh
find . -name ".babelrc*" -o -name "babel*" -not -path "*/node_modules/*" -exec rm -f {} \; 2>/dev/null || true
export NODE_PATH=.
export DISABLE_ESLINT_PLUGIN=true
export NEXT_DISABLE_ESLINT=1
export SWC_MINIFY=true
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_ETW=1
export NODE_OPTIONS=--max_old_space_size=4096
next build --no-lint
exit 0 