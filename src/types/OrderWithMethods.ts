import type { Order } from './Schema';

export type OrderWithMethods = Order & {
	calculateTotals: () => void;
	formatCurrency: (value: number) => string;
};

export const createOrderWithMethods = (order: Order): OrderWithMethods => ({
	...order,
	calculateTotals() {
		this.totalAmount = this.products.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
	},
	formatCurrency(value: number) {
		return `$${value.toFixed(2)}`;
	}
});
