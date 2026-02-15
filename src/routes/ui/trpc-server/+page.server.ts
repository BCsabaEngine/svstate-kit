import { trpcServerCaller } from '$lib/trpc/serverCaller';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [customers, products, order] = await Promise.all([
		trpcServerCaller.getCustomers(),
		trpcServerCaller.getProducts(),
		trpcServerCaller.getDefaultOrder({ customerId: 0, productId: 0 })
	]);
	return { customers, products, order };
};
