import { z } from 'zod';

import { getCustomers, getProducts } from '$lib/server/storageEmulator';
import { apiProcedure, createApiRouter } from '$lib/trpc/init';
import { CustomerSchema, ProductSchema } from '$types/Schema';

export const trpcMasterData = createApiRouter({
	getCustomers: apiProcedure
		.output(z.array(CustomerSchema))
		.query(async () => await getCustomers()),

	getProducts: apiProcedure.output(z.array(ProductSchema)).query(async () => await getProducts())
});
