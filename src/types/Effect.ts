import type { Order } from './Schema';

export const orderEffect = (order: Order, property: string) => {
	if (property !== 'totalAmount')
		order.totalAmount = order.products.reduce(
			(sum, item) => sum + item.unitPrice * item.quantity,
			0
		);
};
