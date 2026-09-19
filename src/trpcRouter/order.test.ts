import { TRPCError } from '@trpc/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { trpcServerCaller } from '$lib/trpc/serverCaller';
import type { Order } from '$types/Schema';

const order = (overrides: Partial<Order> = {}): Order => ({
	customerId: 1,
	orderReference: 'ABC123',
	products: [{ productId: 1, unitPrice: 999.99, quantity: 1 }],
	totalAmount: 999.99,
	...overrides
});

const settle = async (promise: Promise<unknown>) => {
	try {
		await promise;
	} catch (error) {
		return error;
	}
};

const put = async (value: Order) => {
	// start settling before timers run, so a rejection is never unhandled
	const settled = settle(trpcServerCaller.putOrder(value));
	await vi.runAllTimersAsync();
	return settled;
};

describe('putOrder', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('resolves for a valid order', async () => {
		expect(await put(order())).toBeUndefined();
	});

	it('maps a rejected order to BAD_REQUEST', async () => {
		const error = await put(order({ customerId: 3 }));
		expect(error).toBeInstanceOf(TRPCError);
		expect(error).toMatchObject({
			code: 'BAD_REQUEST',
			message: expect.stringMatching(/inactive/)
		});
	});
});
