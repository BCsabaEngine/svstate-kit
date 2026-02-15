import { arrayValidator, numberValidator, stringValidator } from 'svstate';

import type { Order } from './Schema';

export interface OrderErrors {
	[key: string]: string;
	customerId: string;
	orderReference: string;
	products: string;
}

export const orderValidator = (source: Order): OrderErrors => ({
	customerId: numberValidator(source.customerId).required().positive().getError(),
	orderReference: stringValidator(source.orderReference)
		.required()
		.minLength(3)
		.maxLength(20)
		.alphanumeric()
		.getError(),
	products: arrayValidator(source.products).required().minLength(1).getError()
});
