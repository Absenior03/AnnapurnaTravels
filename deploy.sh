#!/bin/bash
# Run imports fix
chmod +x fix-imports.sh && ./fix-imports.sh

# Ensure environment variables are available
echo "NEXT_PUBLIC_PEXELS_API_KEY=$NEXT_PUBLIC_PEXELS_API_KEY" >> .env.local

# Run build
next build --no-lint 