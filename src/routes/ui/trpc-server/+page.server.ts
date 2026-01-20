import { trpcServerCaller } from '$lib/trpc/serverCaller';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		customers: await trpcServerCaller.getCustomers(),
		products: await trpcServerCaller.getProducts(),
		order: await trpcServerCaller.getDefaultOrder({ customerId: 0, productId: 0 })
	};
};
