# tRPC Fetch + svstate

**Reactive client-side state with automatic persistence.**

## How It Works

- Data fetched client-side via `apiClient`
- State wrapped with `createSvState` for reactivity
- Side effects auto-recalculate derived values
- One-click save via action callback

## Code Pattern

```typescript
// +page.svelte
import { createSvState } from 'svstate';
import { apiClient } from '$lib/trpc/client';

const state = createSvState(order, {
	effect: ({ target, property }) => orderEffect(target, property),
	action: async () => {
		await apiClient.putOrder.mutate(state.data);
	}
});
```

## Best For

- Highly interactive UIs
- Real-time updates and optimistic UI
- Complex forms with computed fields
