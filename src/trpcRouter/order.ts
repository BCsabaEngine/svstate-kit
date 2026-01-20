import { z } from 'zod';

import { createDefaultOrder } from '$lib/server/orderFactory';
import { putOrder } from '$lib/server/storageEmulator';
import { apiProcedure, createApiRouter } from '$lib/trpc/init';
import { OrderSchema } from '$types/Schema';

export const trpcOrder = createApiRouter({
	getDefaultOrder: apiProcedure
		.input(
			z.object({
				customerId: z.number().int(),
				productId: z.number().int()
			})
		)
		.output(OrderSchema)
		.query(
			async ({ input: { customerId, productId } }) =>
				await createDefaultOrder(customerId, productId)
		),

	putOrder: apiProcedure.input(OrderSchema).mutation(async ({ input }) => await putOrder(input))
});
