---
name: commit
description: "Generate a conventional commit from staged changes. Auto-triggers on commit requests."
disable-model-invocation: true
---
Generate a commit for staged changes.

## Steps

1. Run `git diff --staged` to see all staged changes
2. If nothing staged, run `git diff` and suggest what to stage
3. Analyze changes and determine commit type:
   - `feat:` — new feature
   - `fix:` — bug fix
   - `refactor:` — code restructuring (no behavior change)
   - `docs:` — documentation only
   - `test:` — adding/updating tests
   - `chore:` — maintenance (deps, config, CI)
   - `perf:` — performance improvement
   - `style:` — formatting (no logic change)
4. Write commit message:
   - Subject: `<type>(<scope>): <imperative summary>` (max 72 chars)
   - Body: what changed and WHY (not how), wrapped at 80 chars
   - Footer: `Closes #N` if applicable
5. Run `git commit -m "<message>"`
6. Show `git log --oneline -1` to confirm

## Rules
- Subject line is imperative mood ("add", not "added" or "adds")
- If changes span multiple concerns, suggest splitting into separate commits
- Never amend existing commits unless explicitly asked
