import { createDefaultOrder } from '$lib/server/orderFactory';
import { getCustomers, getProducts } from '$lib/server/storageEmulator';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		customers: await getCustomers(),
		products: await getProducts(),
		order: await createDefaultOrder(0, 0)
	};
};

export const actions: Actions = {
	default: async (event) => {
		// eslint-disable-next-line no-console
		console.log('Order submitted by form', await event.request.formData());
	}
};
