import { describe, expect, it } from 'vitest';

import { calculateOrderTotal, orderEffect } from './Effect';
import type { Order } from './Schema';

const order = (): Order => ({
	customerId: 1,
	orderReference: 'ABC123',
	products: [
		{ productId: 1, unitPrice: 10, quantity: 2 },
		{ productId: 2, unitPrice: 5.5, quantity: 3 }
	],
	totalAmount: 0
});

describe('calculateOrderTotal', () => {
	it('is 0 for an empty order', () => {
		expect(calculateOrderTotal({ ...order(), products: [] })).toBe(0);
	});

	it('sums unitPrice * quantity over all rows', () => {
		expect(calculateOrderTotal(order())).toBe(36.5);
	});
});

describe('orderEffect', () => {
	it('recomputes totalAmount when another property changes', () => {
		const target = order();
		orderEffect(target, 'products');
		expect(target.totalAmount).toBe(36.5);
	});

	it('ignores changes of totalAmount itself', () => {
		const target = order();
		orderEffect(target, 'totalAmount');
		expect(target.totalAmount).toBe(0);
	});
});
