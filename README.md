# svstate-kit

**Demo project for the [svstate](https://www.npmjs.com/package/svstate) npm package** — a state management library for Svelte 5.

![svstate-kit demo](main.png)

## About This Demo

This is a companion demo application that showcases how `svstate` integrates with SvelteKit. It demonstrates three different patterns for handling server-side state:

| Pattern              | Route             | Description                                                                                        |
| -------------------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| **SvelteKit Native** | `/ui/kit`         | Classic form actions with sync validators (`numberValidator`, `stringValidator`, `arrayValidator`) |
| **tRPC Server**      | `/ui/trpc-server` | Server-side tRPC with sync validators and per-field dirty tracking                                 |
| **tRPC + svstate**   | `/ui/trpc-fetch`  | Full showcase: sync + async validators, dirty tracking, debounced server-side validation           |

## Getting Started

Requires Node.js >= 22.

```bash
npm install
npm run dev
```

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) with Svelte 5
- [svstate](https://www.npmjs.com/package/svstate) v1.4.0 for reactive state management with validation
- [tRPC](https://trpc.io/) v11 with superjson
- [Tailwind CSS](https://tailwindcss.com/) v4 with Flowbite-Svelte components
- [Zod](https://zod.dev/) v4 for schema validation

## Links

- [svstate on npm](https://www.npmjs.com/package/svstate)
