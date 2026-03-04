---
name: scaffold
description: "Generate new project from scratch. Auto-triggers when asked to create, start, or initialize a new project/app."
disable-model-invocation: true
---
Create project: $ARGUMENTS

## Steps

1. **Ask** framework (or infer from $ARGUMENTS):
   - Frontend: Next.js / Nuxt / SvelteKit / Vite+React
   - Backend: FastAPI / Express / NestJS / Go+Chi
   - Fullstack: Next.js / Nuxt / T3 Stack

2. **Directory structure** — follow framework conventions:
   ```
   src/          # source code
   tests/        # test files (mirror src/ structure)
   public/       # static assets (frontend)
   docs/         # documentation
   ```

3. **Config files** — generate all:
   - `tsconfig.json` / `pyproject.toml` (language config)
   - `.eslintrc` + `.prettierrc` / `ruff.toml` (linter + formatter)
   - `.gitignore` (framework-specific template)
   - `.env.example` (document required env vars, NO actual secrets)

4. **Docker** — if applicable:
   - `Dockerfile` (multi-stage build, non-root user)
   - `docker-compose.yml` (app + deps like DB/Redis)

5. **CI** — `.github/workflows/ci.yml`:
   - lint → typecheck → test → build
   - Cache dependencies (node_modules / pip cache)

6. **Finalize**:
   - `README.md` (project name, setup, dev commands)
   - `git init` + initial commit
   - Run `claude-init` to add agents/skills
