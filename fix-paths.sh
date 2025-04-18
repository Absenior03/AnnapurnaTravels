#!/bin/bash

# Create necessary directories
mkdir -p components
mkdir -p context

# Copy component files
cp src/components/Navbar.tsx components/
cp src/components/Footer.tsx components/
cp src/context/AuthContext.tsx context/

echo "Files copied successfully to fix path issues" 