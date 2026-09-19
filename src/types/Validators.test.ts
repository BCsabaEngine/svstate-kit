import { describe, expect, it } from 'vitest';

import type { Order } from './Schema';
import { orderValidator } from './Validators';

const valid = (): Order => ({
	customerId: 1,
	orderReference: 'ABC123',
	products: [{ productId: 1, unitPrice: 10, quantity: 1 }],
	totalAmount: 10
});

describe('orderValidator', () => {
	it('returns no errors for a valid order', () => {
		expect(orderValidator(valid())).toEqual({ customerId: '', orderReference: '', products: '' });
	});

	it('requires a customer', () => {
		expect(orderValidator({ ...valid(), customerId: 0 }).customerId).not.toBe('');
	});

	it.each(['ab', 'A'.repeat(21), 'ABC-123'])('rejects order reference %j', (orderReference) => {
		expect(orderValidator({ ...valid(), orderReference }).orderReference).not.toBe('');
	});

	it('requires at least one product', () => {
		expect(orderValidator({ ...valid(), products: [] }).products).not.toBe('');
	});
});
