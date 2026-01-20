# tRPC Server

**Type-safe API calls from server-side load functions.**

## How It Works

- Data loaded via `trpcServerCaller` in `+page.server.ts`
- Full type safety between client and server
- No client-side API calls needed

## Code Pattern

```typescript
// +page.server.ts
import { trpcServerCaller } from '$lib/trpc/serverCaller';

export const load: PageServerLoad = async () => {
	return {
		customers: await trpcServerCaller.getCustomers(),
		products: await trpcServerCaller.getProducts(),
		order: await trpcServerCaller.getDefaultOrder({ customerId: 0, productId: 0 })
	};
};
```

## Best For

- Server-rendered applications
- Sharing tRPC procedures across server and client
- Type-safe data fetching without client bundle overhead
