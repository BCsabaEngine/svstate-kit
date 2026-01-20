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
