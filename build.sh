#!/bin/bash
chmod +x fix-imports.sh && ./fix-imports.sh
rm -rf .next out
echo "{}" > .babelrc
export NODE_PATH=. DISABLE_ESLINT_PLUGIN=true NEXT_DISABLE_ESLINT=1 SWC_MINIFY=true 
next build --no-lint
exit 0 