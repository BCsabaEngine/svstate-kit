import { z } from 'zod';

import { validateCustomerForOrder, validateOrderReference } from '$lib/server/storageEmulator';
import { apiProcedure, createApiRouter } from '$lib/trpc/init';

export const trpcValidation = createApiRouter({
	validateCustomer: apiProcedure
		.input(z.object({ customerId: z.number().int() }))
		.output(z.string())
		.query(async ({ input }) => await validateCustomerForOrder(input.customerId)),

	validateOrderReference: apiProcedure
		.input(z.object({ reference: z.string() }))
		.output(z.string())
		.query(async ({ input }) => await validateOrderReference(input.reference))
});
