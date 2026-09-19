import { calculateOrderTotal } from '$types/Effect';
import type { Customer, Order, Product } from '$types/Schema';

// Emulates storage operations for customers, products, and orders in server-side

export const getCustomers = async (): Promise<Customer[]> => [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' },
	{ id: 3, name: 'Charlie' }
];

export const getProducts = async (): Promise<Product[]> => [
	{ id: 1, title: 'Laptop', unitPrice: 999.99 },
	{ id: 2, title: 'Smartphone', unitPrice: 499.99 },
	{ id: 3, title: 'Headphones', unitPrice: 199.99 }
];

export const putOrder = async (order: Order): Promise<void> => {
	// eslint-disable-next-line no-console
	console.log('Order received into storage', order);
};

export const validateCustomerForOrder = async (customerId: number): Promise<string> => {
	await new Promise((resolve) => setTimeout(resolve, 800));
	if (customerId === 3) return 'Customer is inactive and cannot place orders';
	return '';
};

export const validateOrderReference = async (reference: string): Promise<string> => {
	await new Promise((resolve) => setTimeout(resolve, 600));
	if (reference.toUpperCase() === 'ORD001') return 'Order reference is already taken';
	return '';
};

/**
 * Server-side source of truth: re-validates the order, takes prices from the catalog and
 * recomputes the total instead of trusting the client. Returns an error message, or '' on success.
 */
export const submitOrder = async (order: Order): Promise<string> => {
	const [customers, products] = await Promise.all([getCustomers(), getProducts()]);
	if (customers.every((c) => c.id !== order.customerId)) return 'Unknown customer';
	if (order.products.length === 0) return 'Order must contain at least one product';

	const priced: Order['products'] = [];
	for (const { productId, quantity } of order.products) {
		const product = products.find((p) => p.id === productId);
		if (!product) return `Unknown product ${productId}`;
		priced.push({ productId, quantity, unitPrice: product.unitPrice });
	}

	const [customerError, referenceError] = await Promise.all([
		validateCustomerForOrder(order.customerId),
		validateOrderReference(order.orderReference)
	]);
	if (customerError || referenceError) return customerError || referenceError;

	const verified = { ...order, products: priced };
	await putOrder({ ...verified, totalAmount: calculateOrderTotal(verified) });
	return '';
};
