import { fail } from '@sveltejs/kit';

import { createDefaultOrder } from '$lib/server/orderFactory';
import { getCustomers, getProducts, putOrder } from '$lib/server/storageEmulator';
import { OrderSchema } from '$types/Schema';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [customers, products, order] = await Promise.all([
		getCustomers(),
		getProducts(),
		createDefaultOrder(0)
	]);
	return { customers, products, order };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const parsed = OrderSchema.safeParse(JSON.parse(String(formData.get('orderJson') ?? '{}')));
		if (!parsed.success) return fail(400, { error: 'Invalid order data' });

		await putOrder(parsed.data);
		return { success: true };
	}
};
