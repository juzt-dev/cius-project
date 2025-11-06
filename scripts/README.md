# 🛠️ Scripts Directory

Executable scripts for project maintenance and development workflows.

## 📜 Available Scripts

### Cleanup Scripts

| Script                         | Purpose                           | Time    | Confirmations    |
| ------------------------------ | --------------------------------- | ------- | ---------------- |
| **project-cleanup.sh**         | Interactive comprehensive cleanup | ~30s    | Multiple prompts |
| **quick-cleanup.sh**           | Fast non-interactive cleanup      | ~2s     | None             |
| **show-cleanup-cheatsheet.sh** | Display cleanup quick reference   | Instant | None             |

### Development Helper

| Script            | Purpose                             |
| ----------------- | ----------------------------------- |
| **dev-helper.sh** | Development utilities and shortcuts |

## 🚀 Quick Usage

### NPM Scripts (Recommended)

```bash
# Interactive cleanup
pnpm clean

# Fast cleanup (daily use)
pnpm clean:quick

# Show cleanup cheatsheet
pnpm docs

# Nuclear option (removes node_modules)
pnpm clean:all
```

### Direct Execution

```bash
# Make executable (already done)
chmod +x scripts/*.sh

# Run cleanup
./scripts/project-cleanup.sh

# Quick cleanup
./scripts/quick-cleanup.sh

# Show cheatsheet
./scripts/show-cleanup-cheatsheet.sh
```

## 📋 Script Details

### 1. project-cleanup.sh

**Purpose**: Comprehensive interactive cleanup with safety confirmations

**Features**:

- Pre-cleanup size analysis
- Interactive confirmations for each step
- Color-coded output
- Optional node_modules reinstall
- .gitignore verification
- Post-cleanup summary

**When to use**:

- Weekly maintenance
- Before major version changes
- When troubleshooting build issues
- Before git operations

**Example**:

```bash
./scripts/project-cleanup.sh

# Output:
# ========================================
# 🔍 PRE-CLEANUP ANALYSIS
# ========================================
# Current directory sizes:
#   📦 node_modules: 1.1G
#   🔨 .next: 32M
# ...
```

---

### 2. quick-cleanup.sh

**Purpose**: Fast non-interactive cleanup for daily use

**What it removes**:

- `.next/` - Next.js build cache
- `out/`, `dist/`, `build/` - Build outputs
- `.turbo/`, `.cache/`, `.vercel/` - Caches
- `coverage/` - Test coverage
- `*.log`, `*.tsbuildinfo` - Logs and build info
- `.DS_Store` - macOS metadata

**When to use**:

- Before git commits
- Daily development cleanup
- CI/CD pipelines
- Before starting work

**Example**:

```bash
./scripts/quick-cleanup.sh

# Output:
# 🧹 Running quick cleanup...
# ✓ Cleanup complete!
# ℹ Run 'pnpm dev' to rebuild
```

---

### 3. show-cleanup-cheatsheet.sh

**Purpose**: Display formatted quick reference guide

**Shows**:

- Available commands
- What gets removed/preserved
- Common workflows
- Quick tips
- Troubleshooting

**When to use**:

- Learning the cleanup system
- Quick reference lookup
- Team onboarding

**Example**:

```bash
./scripts/show-cleanup-cheatsheet.sh

# Displays formatted cheatsheet in terminal
```

---

### 4. dev-helper.sh

**Purpose**: Development utilities and shortcuts

**Features**: (Add your specific features here)

---

## 🔧 Configuration

### Make Scripts Executable

```bash
# All scripts
chmod +x scripts/*.sh

# Individual script
chmod +x scripts/project-cleanup.sh
```

### Update Paths in package.json

Already configured in `package.json`:

```json
{
  "scripts": {
    "clean": "./scripts/project-cleanup.sh",
    "clean:quick": "./scripts/quick-cleanup.sh",
    "docs": "./scripts/show-cleanup-cheatsheet.sh"
  }
}
```

## 📚 Documentation

For detailed documentation, see:

- **Cleanup Guide**: [../docs/CLEANUP_GUIDE.md](../docs/CLEANUP_GUIDE.md)
- **Cleanup Summary**: [../docs/CLEANUP_SUMMARY.md](../docs/CLEANUP_SUMMARY.md)
- **Test Plan**: [../docs/CLEANUP_TEST_PLAN.md](../docs/CLEANUP_TEST_PLAN.md)

## 🎯 Common Workflows

### Daily Development

```bash
# Morning: Clean and start
pnpm clean:quick && pnpm dev

# Before commit
pnpm clean:quick
git add .
git commit -m "feat: new feature"
```

### Weekly Maintenance

```bash
# Full cleanup with review
pnpm clean
# Answer prompts: y, n, y

# Verify
pnpm dev
```

### Troubleshooting Build Issues

```bash
# Nuclear cleanup
pnpm clean
# When prompted for node_modules: y

# Rebuild
pnpm dev
```

### Before Deployment

```bash
# Clean and build fresh
pnpm clean:quick
pnpm build
pnpm start
```

## 🔒 Safety Features

All cleanup scripts include:

- ✅ Source code protection (never removed)
- ✅ Configuration preservation
- ✅ .env file safety
- ✅ Git repository integrity
- ✅ Optional confirmations (interactive mode)

## ⚠️ Important Notes

### DO:

- ✅ Run `quick-cleanup.sh` regularly
- ✅ Review prompts in `project-cleanup.sh`
- ✅ Backup `.env` before full cleanup
- ✅ Test scripts on feature branches first

### DON'T:

- ❌ Modify scripts without understanding
- ❌ Run `clean:all` without backing up work
- ❌ Execute scripts on production servers
- ❌ Remove scripts from git tracking

## 📊 Performance Metrics

| Operation                            | Time  | Space Saved       |
| ------------------------------------ | ----- | ----------------- |
| quick-cleanup.sh                     | ~2s   | ~32M              |
| project-cleanup.sh (no node_modules) | ~30s  | ~32M              |
| project-cleanup.sh (with reinstall)  | ~2min | ~1.1G (temporary) |

## 🆘 Troubleshooting

### Script Won't Execute

```bash
# Fix permissions
chmod +x scripts/*.sh

# Run with bash
bash scripts/project-cleanup.sh
```

### Build Fails After Cleanup

```bash
# Reinstall dependencies
pnpm install

# Regenerate Prisma
pnpm prisma:generate

# Try again
pnpm dev
```

### Need to Rollback

```bash
# Restore from git
git restore .

# Reinstall
pnpm install
```

## 🔗 Related Resources

- **Documentation**: [../docs/](../docs/)
- **Root README**: [../README.md](../README.md)
- **Package Scripts**: [../package.json](../package.json)

---

**Last Updated**: November 5, 2025  
**Maintained by**: Development Team  
**Project**: CIUS Web Application
