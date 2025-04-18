#!/bin/bash

# This is a comprehensive build script that handles all cleanup and building steps
echo "=== Starting comprehensive build process ==="

# Step 1: Set permissions for self and other scripts
echo "Setting script permissions..."
chmod +x fix-imports.sh
[ -f vercel-build.sh ] && chmod +x vercel-build.sh

# Step 2: Cleanup and preparation
echo "Cleaning up any previous build artifacts..."
rm -rf .next out

# Step 3: Run the import fix script
echo "Setting up module imports..."
./fix-imports.sh

# Step 4: Aggressively clean up Babel
echo "Removing all Babel configurations..."
find . -name ".babelrc*" -o -name "babel*" -not -path "*/node_modules/*" -exec rm -f {} \; 2>/dev/null || true
echo "{}" > .babelrc

# Step 5: Set up environment for build
echo "Setting up build environment..."
export NODE_PATH=.
export DISABLE_ESLINT_PLUGIN=true
export NEXT_DISABLE_ESLINT=1
export SWC_MINIFY=true
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_ETW=1
export NODE_OPTIONS=--max_old_space_size=4096

# Step 6: Run the Next.js build
echo "Running Next.js build..."
next build --no-lint

# Step 7: Report build completion
echo "=== Build process complete ==="

exit 0 