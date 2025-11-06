#!/bin/bash

################################################################################
# Next.js Project Cleanup Script
# 
# Purpose: Safely clean up build artifacts, caches, and temporary files
#          to reduce repository size while preserving source code.
#
# Tech Stack: Next.js 16, TypeScript, TailwindCSS, Prisma, pnpm
# Safe to run: Yes - only removes regenerable files
################################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

################################################################################
# Utility Functions
################################################################################

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

get_dir_size() {
    if [ -d "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1
    else
        echo "N/A"
    fi
}

remove_if_exists() {
    local path="$1"
    local description="$2"
    
    if [ -e "$path" ]; then
        local size=$(get_dir_size "$path")
        echo -e "  Removing: ${YELLOW}$path${NC} (Size: $size)"
        rm -rf "$path"
        print_success "Removed $description"
    else
        print_info "$description not found (already clean)"
    fi
}

################################################################################
# Pre-Cleanup Analysis
################################################################################

print_header "🔍 PRE-CLEANUP ANALYSIS"

echo "Project: $(basename "$PROJECT_ROOT")"
echo "Location: $PROJECT_ROOT"
echo ""

# Calculate sizes before cleanup
NODE_MODULES_SIZE=$(get_dir_size "node_modules")
NEXT_SIZE=$(get_dir_size ".next")
GIT_SIZE=$(get_dir_size ".git")

echo "Current directory sizes:"
echo "  📦 node_modules: $NODE_MODULES_SIZE"
echo "  🔨 .next: $NEXT_SIZE"
echo "  📁 .git: $GIT_SIZE"
echo ""

# List what will be removed
print_info "The following will be removed (if they exist):"
echo "  • .next/ - Next.js build output"
echo "  • .turbo/ - Turbopack cache"
echo "  • out/ - Next.js static export"
echo "  • dist/ - Distribution builds"
echo "  • build/ - Build artifacts"
echo "  • .cache/ - General cache directory"
echo "  • .vercel/ - Vercel deployment cache"
echo "  • coverage/ - Test coverage reports"
echo "  • *.log - Log files (npm, pnpm, yarn)"
echo "  • *.tsbuildinfo - TypeScript incremental build info"
echo "  • .DS_Store - macOS metadata files"
echo ""

print_warning "node_modules/ will NOT be removed by default"
print_info "Source code, configs, and public assets will be preserved"
echo ""

################################################################################
# Confirmation Prompt
################################################################################

read -p "$(echo -e ${YELLOW}Do you want to proceed with cleanup? [y/N]:${NC} )" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Cleanup cancelled by user"
    exit 0
fi

################################################################################
# Cleanup Process
################################################################################

print_header "🧹 STARTING CLEANUP"

# 1. Next.js build artifacts
print_info "Cleaning Next.js build artifacts..."
remove_if_exists ".next" "Next.js build cache"
remove_if_exists "out" "Next.js static export"
remove_if_exists ".turbo" "Turbopack cache"

# 2. Build outputs
print_info "Cleaning build outputs..."
remove_if_exists "dist" "Distribution builds"
remove_if_exists "build" "Build artifacts"

# 3. Cache directories
print_info "Cleaning cache directories..."
remove_if_exists ".cache" "General cache"
remove_if_exists ".vercel" "Vercel cache"

# 4. Test artifacts
print_info "Cleaning test artifacts..."
remove_if_exists "coverage" "Test coverage reports"

# 5. Log files
print_info "Cleaning log files..."
find . -maxdepth 2 -type f \( \
    -name "npm-debug.log*" -o \
    -name "yarn-debug.log*" -o \
    -name "yarn-error.log*" -o \
    -name "pnpm-debug.log*" -o \
    -name ".pnpm-debug.log*" \
\) -exec rm -f {} \; 2>/dev/null || true
print_success "Removed log files"

# 6. TypeScript build info
print_info "Cleaning TypeScript build info..."
find . -maxdepth 2 -type f -name "*.tsbuildinfo" -exec rm -f {} \; 2>/dev/null || true
print_success "Removed TypeScript build info"

# 7. macOS metadata files
print_info "Cleaning macOS metadata..."
find . -type f -name ".DS_Store" -exec rm -f {} \; 2>/dev/null || true
print_success "Removed .DS_Store files"

# 8. Temporary files
print_info "Cleaning temporary files..."
find . -maxdepth 2 -type f \( -name "*.tmp" -o -name "*.temp" \) -exec rm -f {} \; 2>/dev/null || true
print_success "Removed temporary files"

################################################################################
# Optional: node_modules cleanup
################################################################################

echo ""
read -p "$(echo -e ${YELLOW}Do you want to remove and reinstall node_modules? [y/N]:${NC} )" -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_header "📦 CLEANING NODE MODULES"
    
    remove_if_exists "node_modules" "node_modules"
    remove_if_exists "pnpm-lock.yaml" "pnpm lockfile (will be regenerated)"
    
    print_info "Reinstalling dependencies with pnpm..."
    if command -v pnpm &> /dev/null; then
        pnpm install
        print_success "Dependencies reinstalled successfully"
    else
        print_error "pnpm not found. Please install dependencies manually with: pnpm install"
    fi
else
    print_info "Skipping node_modules cleanup"
fi

################################################################################
# Verify .gitignore
################################################################################

print_header "🔒 VERIFYING .GITIGNORE"

GITIGNORE_FILE=".gitignore"

if [ -f "$GITIGNORE_FILE" ]; then
    print_success ".gitignore exists"
    
    # Check for essential entries
    REQUIRED_ENTRIES=(
        "node_modules/"
        ".next/"
        ".env"
        "*.log"
        ".DS_Store"
    )
    
    MISSING_ENTRIES=()
    for entry in "${REQUIRED_ENTRIES[@]}"; do
        if ! grep -q "$entry" "$GITIGNORE_FILE"; then
            MISSING_ENTRIES+=("$entry")
        fi
    done
    
    if [ ${#MISSING_ENTRIES[@]} -eq 0 ]; then
        print_success "All essential patterns are in .gitignore"
    else
        print_warning "Missing patterns in .gitignore:"
        for entry in "${MISSING_ENTRIES[@]}"; do
            echo "    - $entry"
        done
        echo ""
        read -p "$(echo -e ${YELLOW}Add missing patterns to .gitignore? [y/N]:${NC} )" -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            for entry in "${MISSING_ENTRIES[@]}"; do
                echo "$entry" >> "$GITIGNORE_FILE"
            done
            print_success "Updated .gitignore with missing patterns"
        fi
    fi
else
    print_warning ".gitignore not found"
    read -p "$(echo -e ${YELLOW}Create a new .gitignore? [y/N]:${NC} )" -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat > "$GITIGNORE_FILE" << 'EOL'
# Dependencies
node_modules/
.pnpm-store/
/.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env*.local

# Testing
/coverage

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.pnpm-debug.log*

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
*~
.DS_Store

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/migrations/
*.db
*.db-journal

# Misc
.cache/
.turbo
EOL
        print_success "Created .gitignore"
    fi
fi

################################################################################
# Post-Cleanup Summary
################################################################################

print_header "✨ CLEANUP COMPLETE"

echo "Summary:"
echo "  ✓ Removed build artifacts and caches"
echo "  ✓ Cleaned temporary files and logs"
echo "  ✓ Verified .gitignore configuration"
echo ""

# Calculate new sizes
if [ -d "node_modules" ]; then
    NEW_NODE_MODULES_SIZE=$(get_dir_size "node_modules")
    echo "  📦 node_modules: $NEW_NODE_MODULES_SIZE"
fi

if [ -d ".git" ]; then
    NEW_GIT_SIZE=$(get_dir_size ".git")
    echo "  📁 .git: $NEW_GIT_SIZE"
fi

echo ""
print_success "Your project is now clean! 🎉"
echo ""
print_info "Next steps:"
echo "  1. Run 'pnpm dev' to start development server"
echo "  2. Run 'pnpm build' to create production build"
echo "  3. Commit cleaned project: git add . && git commit -m 'chore: clean up project artifacts'"
echo ""
print_info "Files preserved:"
echo "  • All source code (app/, components/, lib/, etc.)"
echo "  • Configuration files (next.config.mjs, tsconfig.json, etc.)"
echo "  • Public assets (public/)"
echo "  • Database schema (prisma/)"
echo "  • Documentation (README.md, *.md)"
echo ""

################################################################################
# Optional: Git status check
################################################################################

if [ -d ".git" ]; then
    echo ""
    read -p "$(echo -e ${YELLOW}Show git status? [y/N]:${NC} )" -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git status
    fi
fi

print_success "Script completed successfully!"
