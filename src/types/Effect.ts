import type { Order } from './Schema';

/**
 * Calculates the total amount for an order based on its products.
 */
export const calculateOrderTotal = (order: Order): number =>
	order.products.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

/**
 * Side effect function for svstate that recalculates order totals
 * when any property other than totalAmount changes.
 */
export const orderEffect = (order: Order, property: string): void => {
	if (property === 'totalAmount') return;

	order.totalAmount = calculateOrderTotal(order);
};
