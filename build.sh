#!/bin/bash
chmod +x fix-imports.sh && ./fix-imports.sh
rm -rf .next out
# Don't override our .babelrc file since we need the React and TypeScript presets
export NODE_PATH=. DISABLE_ESLINT_PLUGIN=true NEXT_DISABLE_ESLINT=1 SWC_MINIFY=true 
next build --no-lint
exit 0 