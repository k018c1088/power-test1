---
name: doc-gen
description: "Generate documentation from code. Auto-triggers when asked to document code, generate API docs, or add docstrings."
disable-model-invocation: true
---
Generate documentation for: $ARGUMENTS

## Modes

### Function/Class docs (default)
- Add JSDoc/TSDoc (JS/TS), docstrings (Python), doc comments (Go/Rust)
- Include: description, @param, @returns, @throws, @example
- Only document public API — skip internal/private helpers

### API endpoint docs
- Method, path, description
- Request: params, query, body (with types and required/optional)
- Response: status codes, body schema, examples
- Output as Markdown table or OpenAPI snippet

### README generation
- Project name and one-line description
- Prerequisites and installation
- Quick start / usage examples
- Available scripts/commands
- Project structure overview
- License

## Rules
- Read existing docs first — update, don't duplicate
- Match existing documentation style in the project
- Code examples must be runnable
- Keep descriptions concise — explain WHY, not WHAT (code shows what)
