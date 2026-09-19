# tRPC Server

**Type-safe API calls from server-side load functions.**

## How It Works

- Data loaded via `trpcServerCaller` in `+page.server.ts` (in-process, no HTTP)
- Full type safety between client and server
- Saving uses the browser `apiClient` (`putOrder.mutate`) from the `svstate` action, without a page reload
- Submit runs `validate()` first, then `execute()`
- The server re-validates in `putOrder` and rejects bad orders with `BAD_REQUEST`

## Code Pattern

```typescript
// +page.server.ts
import { trpcServerCaller } from '$lib/trpc/serverCaller';

export const load: PageServerLoad = async () => {
	return {
		customers: await trpcServerCaller.getCustomers(),
		products: await trpcServerCaller.getProducts(),
		order: await trpcServerCaller.getDefaultOrder({ customerId: 0 })
	};
};
```

```typescript
// +page.svelte
const {
	data: reactiveOrder,
	execute,
	validate
} = createSvState(data.order, {
	action: async () => {
		await apiClient.putOrder.mutate(reactiveOrder);
	}
	// effect, validator ...
});

const submitOrder = async () => {
	if (validate().hasErrors) return;
	await execute();
};
```

## Best For

- Server-rendered applications
- Sharing tRPC procedures across server and client
- Type-safe data fetching without client bundle overhead
