import type { Order } from './Schema';

export type OrderWithMethods = Order & {
	calculateTotals: () => void;
};

export const createOrderWithMethods = (order: Order): OrderWithMethods => ({
	...order,
	calculateTotals() {
		this.totalAmount = this.products.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
	}
});
