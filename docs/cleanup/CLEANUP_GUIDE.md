# 🧹 Project Cleanup Script

A safe and comprehensive cleanup script for Next.js projects to remove build artifacts, caches, and temporary files.

## 📋 What It Does

### Automatically Removes:

- ✅ `.next/` - Next.js build output (32M in your project)
- ✅ `.turbo/` - Turbopack cache
- ✅ `out/` - Next.js static export output
- ✅ `dist/`, `build/` - Distribution builds
- ✅ `.cache/`, `.vercel/` - Cache directories
- ✅ `coverage/` - Test coverage reports
- ✅ `*.log` files - npm, pnpm, yarn logs
- ✅ `*.tsbuildinfo` - TypeScript incremental build info
- ✅ `.DS_Store` - macOS metadata files

### Preserves:

- ✅ All source code (`app/`, `components/`, `lib/`, `src/`)
- ✅ Configuration files (`next.config.mjs`, `tsconfig.json`, etc.)
- ✅ Public assets (`public/`)
- ✅ Database schema (`prisma/`)
- ✅ Documentation (`README.md`, `*.md`)
- ✅ Environment files (`.env`, `.env.example`)
- ✅ `node_modules/` (optional removal with confirmation)

## 🚀 Usage

### Run the Script

```bash
# Make executable (already done)
chmod +x project-cleanup.sh

# Run cleanup
./project-cleanup.sh
```

### Interactive Prompts

The script will ask for confirmation before:

1. **Initial cleanup** - Remove build artifacts and caches
2. **node_modules removal** - Optional complete reinstall
3. **.gitignore updates** - Add missing patterns

### Example Output

```
========================================
🔍 PRE-CLEANUP ANALYSIS
========================================

Project: Code Learn
Location: /Users/Chuo/HAHA/Code Learn

Current directory sizes:
  📦 node_modules: 1.1G
  🔨 .next: 32M
  📁 .git: 3.3M

The following will be removed (if they exist):
  • .next/ - Next.js build output
  • .turbo/ - Turbopack cache
  • out/ - Next.js static export
  ...

⚠ node_modules/ will NOT be removed by default
ℹ Source code, configs, and public assets will be preserved

Do you want to proceed with cleanup? [y/N]: y

========================================
🧹 STARTING CLEANUP
========================================

ℹ Cleaning Next.js build artifacts...
  Removing: .next/ (Size: 32M)
✓ Removed Next.js build cache
...

✨ CLEANUP COMPLETE
```

## 🔒 Safety Features

1. **Confirmation Required** - Script asks before removing anything
2. **Size Display** - Shows size of each directory before removal
3. **Dry-run Info** - Lists what will be removed upfront
4. **Source Code Protected** - Only removes regenerable files
5. **Color-coded Output** - Easy to understand what's happening
6. **Error Handling** - `set -e` exits on errors

## 📊 Expected Space Savings

Based on your current project:

| Item            | Current Size | After Cleanup    |
| --------------- | ------------ | ---------------- |
| `.next/`        | 32M          | 0 (removed)      |
| `node_modules/` | 1.1G         | 1.1G (optional)  |
| `.git/`         | 3.3M         | 3.3M (preserved) |

**Total savings**: ~32M (without node_modules removal)  
**With node_modules reinstall**: Clean state (~1.1G freed temporarily)

## 🛠️ What Happens After

### Next Steps (Automatic Suggestions):

1. Run `pnpm dev` - Start development server
2. Run `pnpm build` - Create production build
3. Commit changes - `git add . && git commit -m 'chore: clean up project artifacts'`

### Rebuild Process:

- **Development**: Next.js will rebuild `.next/` on first `pnpm dev`
- **Production**: Run `pnpm build` to create optimized build
- **Dependencies**: Already installed (unless you opted to reinstall)

## 📝 .gitignore Verification

The script checks your `.gitignore` for essential patterns:

```gitignore
# Required patterns checked:
node_modules/
.next/
.env
*.log
.DS_Store
```

If missing, the script offers to add them automatically.

## 🔍 Technical Details

### Script Features:

- **Shell**: Bash (compatible with macOS/Linux)
- **Package Manager**: pnpm (with fallback instructions)
- **Exit Codes**: Proper error handling with `set -e`
- **Colors**: ANSI color codes for better UX
- **Size Calculation**: Uses `du -sh` for accurate sizes

### Cleanup Strategy:

```bash
# Safe removal pattern
remove_if_exists() {
    local path="$1"
    if [ -e "$path" ]; then
        local size=$(du -sh "$path" | cut -f1)
        echo "Removing: $path (Size: $size)"
        rm -rf "$path"
    fi
}
```

## ⚠️ Important Notes

### DO NOT Remove Manually:

- `package.json` - Project dependencies definition
- `pnpm-lock.yaml` - Dependency lock file (unless doing full reinstall)
- `.git/` - Git repository history
- `.env` files - Environment configuration
- `prisma/schema.prisma` - Database schema

### Safe to Remove Anytime:

- `.next/` - Regenerated on next build
- `.turbo/` - Turbopack cache (optional)
- `out/` - Static export (regenerated with `next export`)
- `coverage/` - Test coverage (regenerated with tests)

## 🎯 Use Cases

### Before Committing

```bash
./project-cleanup.sh  # Clean build artifacts
git add .
git commit -m "chore: implement new feature"
```

### Before Deployment

```bash
./project-cleanup.sh  # Ensure clean build
pnpm build           # Create fresh production build
```

### Repository Maintenance

```bash
./project-cleanup.sh  # Full cleanup with node_modules
pnpm install         # Fresh dependency install
```

### Troubleshooting Build Issues

```bash
./project-cleanup.sh  # Remove potentially corrupted cache
pnpm dev             # Start with clean slate
```

## 🤝 Integration with Git

### Recommended Git Workflow:

```bash
# 1. Clean project
./project-cleanup.sh

# 2. Check what's changed
git status

# 3. Add .gitignore updates if any
git add .gitignore

# 4. Commit cleanup
git commit -m "chore: update .gitignore and clean project"

# 5. Continue development
pnpm dev
```

### .gitignore Best Practices:

- ✅ Commit the cleanup script itself
- ✅ Keep `.gitignore` comprehensive
- ✅ Never commit `node_modules/`
- ✅ Never commit `.next/` or build artifacts
- ✅ Use `.env.example` for environment templates

## 📚 Additional Resources

- [Next.js Build Output](https://nextjs.org/docs/app/building-your-application/deploying#build-output)
- [Turbopack Cache](https://turbo.build/pack/docs/core-concepts/caching)
- [pnpm Install](https://pnpm.io/cli/install)

---

**Created for**: CIUS Web Application  
**Tech Stack**: Next.js 16.0.1, TypeScript 5.6, TailwindCSS 3.4, Prisma, pnpm  
**Last Updated**: November 5, 2025
