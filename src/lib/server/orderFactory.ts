import type { Order } from '$types/Schema';

export const createDefaultOrder = async (
	customerId: number,
	productId: number
): Promise<Order> => ({
	customerId,
	orderReference: '',
	products: [
		{
			productId,
			quantity: 1,
			unitPrice: 0
		}
	],
	totalAmount: 0
});
