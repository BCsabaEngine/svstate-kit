import { createDefaultOrder } from '$lib/server/orderFactory';
import { getCustomers, getProducts } from '$lib/server/storageEmulator';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [customers, products, order] = await Promise.all([
		getCustomers(),
		getProducts(),
		createDefaultOrder(0, 0)
	]);
	return { customers, products, order };
};

export const actions: Actions = {
	default: async (event) => {
		// eslint-disable-next-line no-console
		console.log('Order submitted by form', await event.request.formData());
	}
};
