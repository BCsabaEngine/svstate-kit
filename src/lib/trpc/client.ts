import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import type { Router } from './router';

export const apiClient = createTRPCClient<Router>({
	links: [
		httpBatchLink({
			url: 'trpc',
			transformer: superjson
		})
	]
});
