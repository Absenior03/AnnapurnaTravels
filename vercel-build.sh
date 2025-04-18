#!/bin/bash

# This will be automatically detected by Vercel
echo "=== Starting Vercel build ==="

# Execute our custom build script
chmod +x build.sh
./build.sh

exit 0 