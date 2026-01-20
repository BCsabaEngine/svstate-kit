<script lang="ts">
	import { onMount } from 'svelte';
	import { createSvState } from 'svstate';

	import OrderEditor from '$components/OrderEditor.svelte';
	import { apiClient } from '$lib/trpc/client.js';
	import { orderEffect } from '$types/Effect.js';
	import type { Customer, Order, Product } from '$types/Schema';

	let customers: Customer[] = [];
	let products: Product[] = [];
	let order: Order;
	let state: { data: Order; execute: () => Promise<void> } | undefined;

	onMount(async () => {
		customers = await apiClient.getCustomers.query();
		products = await apiClient.getProducts.query();
		order = await apiClient.getDefaultOrder.query({ customerId: 0, productId: 0 });

		state = createSvState(order, {
			effect: ({ target, property }) => orderEffect(target, property),
			action: async () => {
				if (state) await apiClient.putOrder.mutate(state.data);
			}
		});
	});
</script>

{#if state}
	<OrderEditor action={state.execute} {customers} order={state.data} {products} />
{/if}
