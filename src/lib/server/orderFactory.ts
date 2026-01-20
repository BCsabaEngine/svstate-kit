import type { Order } from '$types/Schema';

export const createDefaultOrder = async (
	customerId: number,
	productId: number
): Promise<Order> => ({
	customerId,
	products: [
		{
			productId,
			quantity: 1
		}
	],
	totalAmount: 0
});
