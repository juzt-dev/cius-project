#!/bin/bash

# CIUS Web App - Development Helper Script
# Usage: ./dev-helper.sh [command]

case "$1" in
  "setup")
    echo "🔧 Setting up CIUS Web App..."
    pnpm install
    pnpm prisma:generate
    echo "✅ Setup complete!"
    ;;
  
  "dev")
    echo "🚀 Starting development server..."
    pnpm dev
    ;;
  
  "db:push")
    echo "📦 Pushing database schema..."
    pnpm prisma:push
    ;;
  
  "db:studio")
    echo "🎨 Opening Prisma Studio..."
    pnpm prisma:studio
    ;;
  
  "build")
    echo "🏗️  Building for production..."
    pnpm build
    ;;
  
  "clean")
    echo "🧹 Cleaning build files..."
    rm -rf .next
    rm -rf node_modules
    echo "✅ Clean complete!"
    ;;
  
  "reset")
    echo "🔄 Resetting project..."
    rm -rf .next node_modules pnpm-lock.yaml
    pnpm install
    pnpm prisma:generate
    echo "✅ Reset complete!"
    ;;
  
  "check")
    echo "🔍 Checking project structure..."
    echo ""
    echo "📁 App Pages:"
    find app -name "page.tsx" -type f
    echo ""
    echo "🔌 API Routes:"
    find app/api -name "route.ts" -type f
    echo ""
    echo "🧩 Components:"
    find components -name "*.tsx" -type f
    echo ""
    echo "📚 Libraries:"
    ls -1 lib/
    ;;
  
  *)
    echo "CIUS Web App - Development Helper"
    echo ""
    echo "Usage: ./dev-helper.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup      - Install dependencies and setup project"
    echo "  dev        - Start development server"
    echo "  db:push    - Push database schema"
    echo "  db:studio  - Open Prisma Studio"
    echo "  build      - Build for production"
    echo "  clean      - Clean build files"
    echo "  reset      - Full project reset"
    echo "  check      - Check project structure"
    ;;
esac
