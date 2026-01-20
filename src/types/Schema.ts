import { z } from 'zod';

export const CustomerSchema = z.object({
	id: z.number().int(),
	name: z.string()
});
export type Customer = z.infer<typeof CustomerSchema>;

export const ProductSchema = z.object({
	id: z.number().int(),
	title: z.string(),
	unitPrice: z.number().min(0)
});
export type Product = z.infer<typeof ProductSchema>;

export const OrderDetailsSchema = z.object({
	productId: z.number().int(),
	unitPrice: z.number().int(),
	quantity: z.number().int().min(1)
});
export type OrderDetails = z.infer<typeof OrderDetailsSchema>;

export const OrderSchema = z.object({
	customerId: z.number().int(),
	products: z.array(OrderDetailsSchema).min(1),
	totalAmount: z.number().min(0)
});
export type Order = z.infer<typeof OrderSchema>;
