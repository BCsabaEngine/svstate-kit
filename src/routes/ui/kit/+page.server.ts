import { fail } from '@sveltejs/kit';

import { createDefaultOrder } from '$lib/server/orderFactory';
import { getCustomers, getProducts, submitOrder } from '$lib/server/storageEmulator';
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

const parseOrderJson = (value: FormDataEntryValue | null) => {
	try {
		return OrderSchema.safeParse(JSON.parse(String(value ?? '{}')));
	} catch {
		return;
	}
};

export const actions: Actions = {
	default: async (event) => {
		const parsed = parseOrderJson((await event.request.formData()).get('orderJson'));
		if (!parsed?.success) return fail(400, { error: 'Invalid order data' });

		const error = await submitOrder(parsed.data);
		if (error) return fail(400, { error });
		return { success: true };
	}
};
