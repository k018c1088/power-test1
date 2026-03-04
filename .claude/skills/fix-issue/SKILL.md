---
name: fix-issue
description: "Auto-fix a GitHub issue: investigate, fix, test, PR. Triggers when user mentions fixing an issue by number."
disable-model-invocation: true
---
Fix GitHub Issue #$ARGUMENTS

## Steps

1. **Investigate**: `gh issue view $ARGUMENTS --json title,body,labels,comments`
2. **Understand**: Read related code, reproduce the bug if possible
3. **Branch**: `git checkout -b fix/issue-$ARGUMENTS`
4. **Fix**: Implement the minimal fix. Follow existing code style
5. **Test**: Add/update tests covering the fix. Run existing tests
6. **Verify**: `lint + typecheck + test` must all pass
7. **Commit**: `git commit -m "fix: resolve #$ARGUMENTS — <summary>"`
8. **PR**: `gh pr create --title "fix: resolve #$ARGUMENTS" --body "Closes #$ARGUMENTS\n\n## Changes\n..."`

## Rules
- Minimal changes only — fix the issue, don't refactor surrounding code
- If the fix is unclear, explain options to the user before implementing
- Never push directly to main/master
