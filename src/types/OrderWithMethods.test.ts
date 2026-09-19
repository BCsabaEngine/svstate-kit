import { describe, expect, it } from 'vitest';

import { createOrderWithMethods } from './OrderWithMethods';

describe('createOrderWithMethods', () => {
	it('copies the order and calculateTotals updates totalAmount on it', () => {
		const source = {
			customerId: 1,
			orderReference: 'ABC123',
			products: [{ productId: 1, unitPrice: 2.5, quantity: 4 }],
			totalAmount: 0
		};
		const result = createOrderWithMethods(source);
		result.calculateTotals();

		expect(result.totalAmount).toBe(10);
		expect(source.totalAmount).toBe(0);
	});
});
