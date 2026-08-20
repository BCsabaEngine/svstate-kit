import type { Order } from '$types/Schema';

export const createDefaultOrder = async (customerId: number): Promise<Order> => ({
	customerId,
	orderReference: '',
	products: [],
	totalAmount: 0
});
