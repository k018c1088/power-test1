---
name: refactor
description: "Safely refactor code with test verification. Auto-triggers on refactor, restructure, or cleanup requests."
disable-model-invocation: true
---
Refactor: $ARGUMENTS

## Steps

1. **Understand** scope: read target code and its callers/dependents
2. **Run tests** first to establish a green baseline
3. **Plan** the refactoring:
   - Extract function/method (long functions)
   - Rename for clarity (unclear names)
   - Simplify conditionals (nested if/else → early return / guard clauses)
   - Remove duplication (DRY — but only for true duplication, not coincidence)
   - Split file (>300 lines or mixed concerns)
4. **Apply** changes incrementally — one refactoring at a time
5. **Run tests** after each change to verify no regression
6. **Final check**: lint + typecheck + full test suite

## Rules
- Zero behavior change — refactoring must not alter external behavior
- If tests are missing, write them BEFORE refactoring
- Prefer small, reviewable changes over large rewrites
- Keep existing public API unchanged unless explicitly asked
- If a change is risky, explain the tradeoff before proceeding
