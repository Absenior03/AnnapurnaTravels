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

echo "Creating .env.local with NODE_PATH..."
echo "NODE_PATH=." > .env.local

echo "Import path fixes complete!" 