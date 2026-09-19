import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Order } from '$types/Schema';

import { submitOrder } from './storageEmulator';

const order = (overrides: Partial<Order> = {}): Order => ({
	customerId: 1,
	orderReference: 'ABC123',
	products: [{ productId: 1, unitPrice: 0.01, quantity: 2 }],
	totalAmount: 0.02,
	...overrides
});

// The async validators sleep 600-800 ms, so run submitOrder on fake timers
const submit = async (value: Order) => {
	const result = submitOrder(value);
	await vi.runAllTimersAsync();
	return result;
};

describe('submitOrder', () => {
	let log: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.useFakeTimers();
		log = vi.spyOn(console, 'log').mockImplementation(() => {});
	});
	afterEach(() => {
		vi.useRealTimers();
		log.mockRestore();
	});

	it('rejects an unknown customer', async () => {
		expect(await submit(order({ customerId: 99 }))).toBe('Unknown customer');
	});

	it('rejects an order without products', async () => {
		expect(await submit(order({ products: [] }))).toBe('Order must contain at least one product');
	});

	it('rejects an unknown product', async () => {
		const products = [{ productId: 99, unitPrice: 1, quantity: 1 }];
		expect(await submit(order({ products }))).toBe('Unknown product 99');
	});

	it('rejects an inactive customer', async () => {
		expect(await submit(order({ customerId: 3 }))).toMatch(/inactive/);
	});

	it('rejects a taken order reference case-insensitively', async () => {
		expect(await submit(order({ orderReference: 'ord001' }))).toMatch(/already taken/);
	});

	it('does not store rejected orders', async () => {
		await submit(order({ customerId: 3 }));
		expect(log).not.toHaveBeenCalled();
	});

	it('stores the catalog price and recomputed total instead of the client values', async () => {
		expect(await submit(order())).toBe('');
		expect(log).toHaveBeenCalledWith(
			'Order received into storage',
			expect.objectContaining({
				products: [{ productId: 1, unitPrice: 999.99, quantity: 2 }],
				totalAmount: 1999.98
			})
		);
	});
});
