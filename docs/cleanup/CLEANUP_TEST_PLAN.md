# 🧪 Cleanup Script Test Plan

## Pre-Test Checklist

- [x] Scripts created: `project-cleanup.sh`, `quick-cleanup.sh`
- [x] Scripts are executable (`chmod +x`)
- [x] Documentation created: `CLEANUP_GUIDE.md`, `CLEANUP_SUMMARY.md`
- [x] NPM scripts added to `package.json`
- [x] `.gitignore` is comprehensive

## Test Scenarios

### Test 1: Quick Cleanup (Non-interactive)

```bash
# Run quick cleanup
pnpm clean:quick

# Expected output:
# 🧹 Running quick cleanup...
# ✓ Cleanup complete!
# ℹ Run 'pnpm dev' to rebuild

# Verify:
ls -la .next      # Should not exist
ls -la .turbo     # Should not exist
ls -la node_modules  # Should still exist
```

**Status**: Ready to test  
**Risk**: Low (only removes regenerable files)

---

### Test 2: Interactive Cleanup (Full)

```bash
# Run interactive cleanup
./project-cleanup.sh

# Expected prompts:
# 1. "Do you want to proceed with cleanup? [y/N]:" → Answer: y
# 2. "Do you want to remove and reinstall node_modules? [y/N]:" → Answer: n
# 3. "Show git status? [y/N]:" → Answer: y

# Expected output:
# ========================================
# 🔍 PRE-CLEANUP ANALYSIS
# ========================================
# [shows sizes]
#
# ========================================
# 🧹 STARTING CLEANUP
# ========================================
# [removes files with progress]
#
# ✨ CLEANUP COMPLETE
# [shows summary]
```

**Status**: Ready to test  
**Risk**: Low (asks for confirmation)

---

### Test 3: Full Cleanup with node_modules

```bash
# Run interactive cleanup
./project-cleanup.sh

# When prompted for node_modules removal:
# "Do you want to remove and reinstall node_modules? [y/N]:" → Answer: y

# Expected:
# 1. node_modules removed
# 2. pnpm install runs automatically
# 3. Dependencies reinstalled fresh
```

**Status**: Ready to test  
**Risk**: Medium (removes node_modules, takes time to reinstall)

---

### Test 4: NPM Scripts

```bash
# Test clean script
pnpm clean

# Test quick clean script
pnpm clean:quick

# Test clean:all script (CAUTION: removes node_modules)
# pnpm clean:all  # Commented out for safety
```

**Status**: Ready to test  
**Risk**: Low for `clean` and `clean:quick`, High for `clean:all`

---

### Test 5: Verify .gitignore

```bash
# Run cleanup script
./project-cleanup.sh

# When prompted about .gitignore:
# "Add missing patterns to .gitignore? [y/N]:" → Check if needed

# Verify .gitignore contains:
cat .gitignore | grep -E "node_modules|.next|.env|.log|.DS_Store"
```

**Status**: .gitignore already comprehensive  
**Expected**: No updates needed

---

### Test 6: Rebuild After Cleanup

```bash
# Step 1: Run cleanup
pnpm clean:quick

# Step 2: Start dev server
pnpm dev

# Expected:
# - .next folder recreated
# - Server starts successfully on port 3000 (or 3002)
# - Pages compile without errors

# Step 3: Build for production
pnpm build

# Expected:
# - Fresh .next folder
# - Build completes successfully
# - No errors or warnings
```

**Status**: Ready to test  
**Risk**: Low (verifies cleanup doesn't break builds)

---

## Post-Test Verification

### Files That Should Be Removed:

- [ ] `.next/` directory
- [ ] `.turbo/` directory (if existed)
- [ ] `out/` directory (if existed)
- [ ] `*.log` files
- [ ] `*.tsbuildinfo` files
- [ ] `.DS_Store` files

### Files That Should Be Preserved:

- [ ] `node_modules/` (unless opted for removal)
- [ ] `app/` directory
- [ ] `components/` directory
- [ ] `lib/` directory
- [ ] `prisma/` directory
- [ ] `public/` directory
- [ ] `package.json`
- [ ] `pnpm-lock.yaml`
- [ ] `.env` files
- [ ] `.git/` directory

### Functionality Tests:

- [ ] `pnpm dev` starts successfully
- [ ] `pnpm build` completes successfully
- [ ] `pnpm start` runs production build
- [ ] All pages load without errors
- [ ] Hot reload works in dev mode

## Recommended Test Order

1. **Start Safe**: Run `pnpm clean:quick` first
2. **Verify Build**: Run `pnpm dev` to ensure nothing broke
3. **Interactive Test**: Run `./project-cleanup.sh` (answer 'n' to node_modules)
4. **Full Test**: Run `./project-cleanup.sh` (answer 'y' to node_modules) - **Optional**

## Safety Notes

⚠️ **Before Testing**:

- Commit current work: `git add . && git commit -m "backup before cleanup test"`
- Ensure no important uncommitted changes
- Have backup of `.env` file

⚠️ **During Testing**:

- Read prompts carefully
- Answer 'n' to node_modules removal first time
- Check git status before committing

⚠️ **After Testing**:

- Verify dev server starts: `pnpm dev`
- Check production build: `pnpm build`
- Commit cleanup scripts: `git add project-cleanup.sh quick-cleanup.sh *.md`

## Expected Results

### Space Savings:

```
Before:  1.15G total
After:   1.12G total (without node_modules removal)
Saved:   ~32M (.next and caches)
```

### Time Savings:

```
Quick Cleanup:       ~2 seconds
Interactive Cleanup: ~30 seconds (without node_modules)
Full Cleanup:        ~2 minutes (with node_modules reinstall)
```

### Build Time:

```
Clean Build:   2-4 seconds initial compile
Cached Build:  <1 second incremental
After Cleanup: 2-4 seconds (fresh cache)
```

## Rollback Plan

If something goes wrong:

```bash
# 1. Restore node_modules if removed
pnpm install

# 2. Regenerate Prisma client
pnpm prisma:generate

# 3. Clear Next.js cache
rm -rf .next

# 4. Restart dev server
pnpm dev

# 5. If still broken, restore from git
git restore .
pnpm install
```

## Test Report Template

After testing, document results:

```markdown
## Test Results - [Date]

### Test 1: Quick Cleanup

- Status: ✅ Pass / ❌ Fail
- Time: X seconds
- Space Saved: X MB
- Notes: [any issues or observations]

### Test 2: Interactive Cleanup

- Status: ✅ Pass / ❌ Fail
- Time: X seconds
- Space Saved: X MB
- Notes: [any issues or observations]

### Test 3: Rebuild After Cleanup

- Dev Server: ✅ Pass / ❌ Fail
- Production Build: ✅ Pass / ❌ Fail
- Notes: [any issues or observations]

### Overall Assessment:

- Scripts working as expected: Yes / No
- Documentation accurate: Yes / No
- Ready for team use: Yes / No
- Recommended changes: [if any]
```

---

**Test Plan Created**: November 5, 2025  
**Project**: CIUS Web Application  
**Tester**: [Your Name]  
**Status**: Ready for execution
