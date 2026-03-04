---
name: perf-audit
description: "Performance audit and bottleneck detection. Auto-triggers on slow performance, optimization requests."
---
Performance audit for the current project.

## Checklist

### Bundle / Build
- Bundle size analysis (`npm run build`, check output sizes)
- Tree-shaking effectiveness (unused exports, barrel file re-exports)
- Code splitting opportunities (dynamic `import()` for routes/heavy components)
- Unused dependencies in package.json / requirements.txt

### Database / API
- N+1 query patterns (ORM eager loading missing)
- Missing indexes on WHERE/ORDER BY/JOIN columns
- Unbounded queries (missing LIMIT/pagination)
- Slow endpoints (sequential DB calls → parallelize with `Promise.all`)
- Missing caching (repeated identical queries, static data)

### Frontend
- Unnecessary re-renders (React DevTools Profiler patterns)
- Large images without optimization (missing `loading="lazy"`, no WebP/AVIF)
- Render-blocking resources (CSS/JS in `<head>` without `defer`/`async`)
- Missing virtualization for long lists (>100 items)
- Layout thrashing (reading layout props in loops)

### Runtime / Memory
- Memory leaks (event listeners not cleaned up, setInterval without clear)
- Large object allocations in hot paths
- Synchronous file I/O on main thread

## Output
Ranked list by estimated impact (high/medium/low):
```
[impact] category — issue — file:line — fix
```
