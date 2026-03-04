---
name: test-gen
description: "Generate tests for specified code. Auto-triggers when asked to write, add, or generate tests."
disable-model-invocation: true
---
Generate tests for: $ARGUMENTS

## Steps

1. **Detect** test framework from project config:
   - JS/TS: Jest / Vitest / Mocha (check package.json)
   - Python: pytest / unittest (check pyproject.toml / setup.cfg)
   - Go: built-in `testing` package
   - Other: infer from existing test files

2. **Read** the target source file(s)

3. **Analyze** what to test:
   - Public functions/methods (API surface)
   - Edge cases (null, empty, boundary values, error paths)
   - Existing behavior (regression protection)

4. **Generate** test file:
   - Mirror source path: `src/utils/foo.ts` → `tests/utils/foo.test.ts`
   - Follow existing test patterns in the project
   - Include: happy path, edge cases, error cases
   - Use descriptive test names: `should return X when given Y`

5. **Run** tests to verify they pass: `npm test` / `pytest` / `go test`

## Rules
- Match existing test style and patterns in the project
- Don't mock what you can test directly
- Each test should test ONE behavior
- Tests must be deterministic (no random, no time-dependent)
