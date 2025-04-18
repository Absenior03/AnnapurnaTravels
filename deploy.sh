#!/bin/bash
# Run imports fix
chmod +x fix-imports.sh
./fix-imports.sh

# Run build with flags to disable checks
NEXT_DISABLE_ESLINT=1 DISABLE_ESLINT_PLUGIN=true SWC_MINIFY=true NODE_PATH=. next build --no-lint 