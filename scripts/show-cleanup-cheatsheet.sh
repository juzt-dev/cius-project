#!/bin/bash
# CLEANUP CHEATSHEET - Quick Reference

cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║          🧹 Next.js Project Cleanup Cheatsheet              ║
╚══════════════════════════════════════════════════════════════╝

📦 AVAILABLE COMMANDS
─────────────────────────────────────────────────────────────────
  pnpm clean          Interactive cleanup (30s) - RECOMMENDED
  pnpm clean:quick    Fast cleanup (2s) - DAILY USE
  pnpm clean:all      Nuclear option (2min) - USE WITH CAUTION
  
  ./project-cleanup.sh    Same as pnpm clean
  ./quick-cleanup.sh      Same as pnpm clean:quick

🗑️  WHAT GETS REMOVED
─────────────────────────────────────────────────────────────────
  ✓ .next/            Next.js build (32M)
  ✓ .turbo/           Turbopack cache
  ✓ out/, dist/       Build outputs
  ✓ .cache/, .vercel/ Cache dirs
  ✓ coverage/         Test reports
  ✓ *.log             Log files
  ✓ *.tsbuildinfo     TS build info
  ✓ .DS_Store         macOS metadata

🔒 WHAT'S PRESERVED
─────────────────────────────────────────────────────────────────
  ✓ app/, components/, lib/    Source code
  ✓ *.config.*                 Config files
  ✓ public/                    Static assets
  ✓ prisma/                    Database schema
  ✓ .env                       Environment vars
  ✓ .git/                      Git repository
  ✓ node_modules/              Dependencies (unless opted)

⚡ COMMON WORKFLOWS
─────────────────────────────────────────────────────────────────
  Daily Development:
    $ pnpm clean:quick && pnpm dev
  
  Before Git Commit:
    $ pnpm clean:quick && git add . && git commit -m "..."
  
  Troubleshooting:
    $ pnpm clean  (choose 'y' for node_modules when prompted)
  
  Before Deployment:
    $ pnpm clean:quick && pnpm build && pnpm start

💾 SPACE SAVINGS
─────────────────────────────────────────────────────────────────
  Current:  1.15G total
  Saved:    ~32M (without node_modules)
  Target:   Keep under 1.2G

🚀 FIRST TIME SETUP
─────────────────────────────────────────────────────────────────
  1. Make scripts executable:
     $ chmod +x project-cleanup.sh quick-cleanup.sh
  
  2. Test with interactive mode:
     $ ./project-cleanup.sh
     (answer 'n' to node_modules first time)
  
  3. Verify build works:
     $ pnpm dev

📝 QUICK TIPS
─────────────────────────────────────────────────────────────────
  • Run clean:quick daily or before commits
  • Run clean weekly for maintenance
  • Use clean:all only for major troubleshooting
  • Read CLEANUP_GUIDE.md for detailed info
  • Check CLEANUP_SUMMARY.md for workflows

🆘 TROUBLESHOOTING
─────────────────────────────────────────────────────────────────
  Scripts won't run:
    $ chmod +x project-cleanup.sh quick-cleanup.sh
  
  Build fails after cleanup:
    $ pnpm install && pnpm prisma:generate && pnpm dev
  
  Need to rollback:
    $ git restore . && pnpm install

📚 DOCUMENTATION
─────────────────────────────────────────────────────────────────
  CLEANUP_GUIDE.md           Complete usage guide
  CLEANUP_SUMMARY.md         Quick reference
  CLEANUP_TEST_PLAN.md       Testing guide
  CLEANUP_IMPLEMENTATION.md  Setup summary

🎯 SAFETY RULES
─────────────────────────────────────────────────────────────────
  ✓ Always review prompts before confirming
  ✓ Start with clean:quick, not clean:all
  ✓ Test on feature branch first
  ✓ Commit important work before cleanup
  ✓ Keep .env files backed up

🏆 SUCCESS METRICS
─────────────────────────────────────────────────────────────────
  ✓ Repo size: ~1.1-1.2G (without node_modules)
  ✓ Build time: 2-4s consistent
  ✓ Disk space freed: ~32M per cleanup
  ✓ Zero build artifacts in git

─────────────────────────────────────────────────────────────────
Project: CIUS Web Application | Next.js 16.0.1 | pnpm
Created: Nov 5, 2025 | Status: ✅ Production Ready
─────────────────────────────────────────────────────────────────
EOF
