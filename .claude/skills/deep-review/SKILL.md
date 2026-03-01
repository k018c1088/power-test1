---
name: deep-review
description: "Comprehensive code review: security + performance + quality. Auto-triggers on PR review, code review requests, or checking changed files."
context: fork
agent: Explore
---
Review changed files (`git diff` or `git diff --staged`):

### Security
- SQL injection, XSS, CSRF, hardcoded secrets, missing validation

### Performance
- N+1 queries, missing indexes, O(n²)+ algorithms
- React unnecessary re-renders, missing pagination

### Quality
- Functions > 50 lines, dead code, missing error handling
- TypeScript `any`, missing tests for new logic

Output: 🔴/🟡/🔵 + file:line + issue + concrete fix
