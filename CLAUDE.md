# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a demo project showcasing the `svstate` npm package - a state management library for Svelte 5. It demonstrates three different patterns for handling server-side state in SvelteKit applications:

1. **SvelteKit Default** (`/ui/kit`) - Classic form actions and load functions
2. **tRPC Server** (`/ui/trpc-server`) - Server-side tRPC calls via `trpcServerCaller`
3. **tRPC Fetch** (`/ui/trpc-fetch`) - Client-side tRPC calls with `svstate` integration

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run all          # Format, lint, type-check, and build (run before committing)
npm run ts:check     # TypeScript type checking with svelte-check
npm run lint:fix     # Fix ESLint issues
npm run format:fix   # Fix Prettier formatting
```

## Architecture

### tRPC Setup

The tRPC integration follows this structure:

- `src/lib/trpc/init.ts` - tRPC initialization with superjson transformer, exports `createApiRouter`, `apiProcedure`, `mergeRouters`
- `src/trpcRouter/` - Individual router modules (e.g., `masterData.ts`, `order.ts`)
- `src/trpcRouter/index.ts` - Merges all routers into single `router` export
- `src/lib/trpc/router.ts` - Re-exports merged router and `Router` type
- `src/lib/trpc/client.ts` - Client-side tRPC client (`apiClient`) for browser use
- `src/lib/trpc/serverCaller.ts` - Server-side tRPC caller for use in load functions
- `src/lib/trpc/server.ts` - Custom `createTRPCHandle` for SvelteKit hooks integration
- `src/hooks.server.ts` - Mounts tRPC at `/trpc` endpoint

### Path Aliases

Configured in `svelte.config.js`:

- `$components` → `./src/components`
- `$lib` → `./src/lib`
- `$types` → `./src/types`
- `$routes` → `./src/routes`

### Schema & Types

- `src/types/Schema.ts` - Zod schemas and TypeScript types for domain objects (Customer, Product, Order, OrderDetails)
- `src/types/Effect.ts` - Side effect functions for svstate (e.g., `orderEffect` recalculates totals)

### svstate Integration

The `svstate` library is demonstrated in `/ui/trpc-fetch`:

```typescript
const state = createSvState(order, {
	effect: ({ target, property }) => orderEffect(target, property),
	action: async () => {
		await apiClient.putOrder.mutate(state.data);
	}
});
```

## Tech Stack

- SvelteKit with Svelte 5 (runes: `$state`, `$derived`, `$props`)
- tRPC v11 with superjson
- Tailwind CSS v4 with Flowbite-Svelte components
- Zod for schema validation
- Node.js adapter for deployment

## Code Style

- ESLint with unicorn, typescript-eslint, simple-import-sort plugins
- Prettier with svelte and tailwindcss plugins
- Type imports enforced: `import type { X } from '...'`
- Sorted imports (simple-import-sort)
- Sorted Svelte attributes (svelte/sort-attributes)
- No console.log, alert, or debugger statements
