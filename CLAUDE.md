# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint (eslint-config-next/core-web-vitals + typescript)
```

No test framework is configured.

## Architecture

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn/ui (base-nova) · Zustand · Supabase (planned) · Vercel

**Path alias:** `@/*` → `src/*`

### State

All state lives in `src/store/useTaskStore.ts` — a single Zustand store persisted to `localStorage`. It holds tasks and members with seed data. The app has **no backend yet**; Supabase integration is planned (see `docs/`).

### Key source layout

```
src/
  app/          # App Router — page.tsx is the only route (tabs: Kanban / List / Members)
  components/   # Feature components (KanbanBoard, TaskCard, ListView, …) + ui/ (shadcn)
  store/        # useTaskStore — single source of truth
  types/        # Task, Member, Priority, Status types with Korean label constants
  lib/utils.ts  # cn() — clsx + tailwind-merge
```

### UI conventions

- Use `cn()` from `@/lib/utils` for conditional Tailwind classes.
- Add shadcn components via `npx shadcn add <component>`; they land in `src/components/ui/`.
- Toast notifications use `sonner` (`import { toast } from "sonner"`).
- Korean is the UI language; keep user-facing strings in Korean.

### Planned backend (docs/)

`docs/` contains the agreed MVP specs: requirements, DB schema (single `tasks` table in Supabase), REST API routes under `/api`, and architecture. Implement against those before extending scope.
