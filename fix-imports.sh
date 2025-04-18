#!/bin/bash

echo "Starting import path fix..."

# Create directories if they don't exist
mkdir -p components
mkdir -p context

# Copy components to the root directory
echo "Copying Navbar and Footer components..."
cp -f src/components/Navbar.tsx components/
cp -f src/components/Footer.tsx components/

# Copy context to the root directory
echo "Copying AuthContext..."
cp -f src/context/AuthContext.tsx context/

# Create symlinks for better path resolution
echo "Creating symlinks for module resolution..."
if [ -L "@" ]; then
  rm "@"
fi
ln -sf src "@"

# ===== AGGRESSIVE BABEL CLEANUP =====
echo "Performing aggressive Babel configuration cleanup..."

# Remove all Babel configuration files
rm -f .babelrc .babelrc.js .babelrc.json babel.config.js .babelrc.* babel*.js

# Create an empty .babelrc to override any configurations
echo "{}" > .babelrc

# Search for any hidden Babel configs and report them
echo "Checking for any hidden Babel configuration files..."
HIDDEN_BABEL=$(find . -name ".babelrc*" -o -name "babel*" | grep -v "node_modules")
if [ -n "$HIDDEN_BABEL" ]; then
  echo "WARNING: Found potential Babel configuration files that might conflict with SWC:"
  echo "$HIDDEN_BABEL"
  echo "Attempting to remove or disable them..."
  
  # Try to remove or disable each file
  for file in $HIDDEN_BABEL; do
    echo "Disabling: $file"
    mv "$file" "${file}.disabled" 2>/dev/null || rm -f "$file" 2>/dev/null || echo "{}" > "$file" 2>/dev/null
  done
fi

echo "Creating .env.local with NODE_PATH and SWC settings..."
cat > .env.local << EOL
NODE_PATH=.
NEXT_DISABLE_ETW=1
SWC_MINIFY=true
DISABLE_ESLINT_PLUGIN=true
NEXT_DISABLE_ESLINT=1
EOL

echo "Import path fixes complete!" 