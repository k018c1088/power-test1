---
name: deep-review
description: "Comprehensive code review: security + performance + quality. Auto-triggers on PR review, code review requests, or checking changed files."
---
Review changed files using `git diff` or `git diff --staged`.

## Checklist

### Security
- SQL injection (raw queries, string interpolation in SQL)
- XSS (unsanitized user input in HTML/JSX, `dangerouslySetInnerHTML`, `v-html`)
- CSRF (missing token validation on state-changing endpoints)
- Hardcoded secrets (API keys, passwords, tokens in source code)
- Missing input validation (request params, query strings, headers)
- Insecure dependencies (known CVEs)

### Performance
- N+1 queries (ORM loops without eager loading)
- Missing DB indexes on filtered/sorted/joined columns
- O(n^2)+ algorithms (nested loops, repeated `.find()`)
- React: unnecessary re-renders (missing `useMemo`/`useCallback`)
- Missing pagination / unbounded data fetching

### Quality
- Functions > 50 lines → suggest extraction
- Dead code, unused imports/variables
- Missing error handling (unhandled Promise rejections, bare `except:`)
- TypeScript `any` → suggest proper types
- Missing tests for new/changed logic
- Inconsistent naming conventions

## Output
For each finding: `[severity] file:line — issue — concrete fix`
Severity: critical / warning / info
