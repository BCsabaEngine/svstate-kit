import { calculateOrderTotal } from './Effect';
import type { Order } from './Schema';

export type OrderWithMethods = Order & {
	calculateTotals: () => void;
};

export const createOrderWithMethods = (order: Order): OrderWithMethods => ({
	...order,
	calculateTotals() {
		this.totalAmount = calculateOrderTotal(this);
	}
});
