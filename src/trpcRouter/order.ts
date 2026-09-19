import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createDefaultOrder } from '$lib/server/orderFactory';
import { submitOrder } from '$lib/server/storageEmulator';
import { apiProcedure, createApiRouter } from '$lib/trpc/init';
import { OrderSchema } from '$types/Schema';

export const trpcOrder = createApiRouter({
	getDefaultOrder: apiProcedure
		.input(
			z.object({
				customerId: z.number().int()
			})
		)
		.output(OrderSchema)
		.query(async ({ input: { customerId } }) => await createDefaultOrder(customerId)),

	putOrder: apiProcedure.input(OrderSchema).mutation(async ({ input }) => {
		const message = await submitOrder(input);
		if (message) throw new TRPCError({ code: 'BAD_REQUEST', message });
	})
});
