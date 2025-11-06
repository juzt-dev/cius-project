#!/bin/bash
# Quick Cleanup - No Confirmations (Use with caution!)

set -e
cd "$(dirname "$0")"

echo "🧹 Running quick cleanup..."

# Remove build artifacts
rm -rf .next out dist build .turbo .cache .vercel coverage

# Remove logs
find . -maxdepth 2 -type f \( -name "*.log" -o -name "*.tsbuildinfo" \) -delete

# Remove macOS metadata
find . -type f -name ".DS_Store" -delete

echo "✓ Cleanup complete!"
echo "ℹ Run 'pnpm dev' to rebuild"
