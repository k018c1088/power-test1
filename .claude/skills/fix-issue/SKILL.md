---
name: fix-issue
description: "Auto-fix a GitHub issue: investigate, fix, test, PR. Triggers when user mentions fixing an issue by number."
disable-model-invocation: true
allowed-tools: Bash(gh *), Read, Write, Edit, Grep, Glob
---
Fix Issue #$ARGUMENTS:
1. `gh issue view $ARGUMENTS` → 2. Find affected code
3. Branch: fix/issue-$ARGUMENTS → 4. Implement fix → 5. Add tests
6. lint + test → 7. Commit: `fix: resolve #$ARGUMENTS` → 8. `gh pr create`
