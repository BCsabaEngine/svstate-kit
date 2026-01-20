<script lang="ts">
	import { Card, Skeleton } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { createSvState } from 'svstate';

	import DemoHeader from '$components/DemoHeader.svelte';
	import OrderEditor from '$components/OrderEditor.svelte';
	import { apiClient } from '$lib/trpc/client.js';
	import { orderEffect } from '$types/Effect.js';
	import type { Customer, Order, Product } from '$types/Schema';

	let customers = $state<Customer[]>([]);
	let products = $state<Product[]>([]);
	let order: Order;
	let orderState = $state<{ data: Order; execute: () => Promise<void> } | undefined>();
	let loading = $state(true);

	onMount(async () => {
		const [customersData, productsData, orderData] = await Promise.all([
			apiClient.getCustomers.query(),
			apiClient.getProducts.query(),
			apiClient.getDefaultOrder.query({ customerId: 0, productId: 0 })
		]);

		customers = customersData;
		products = productsData;
		order = orderData;

		orderState = createSvState(order, {
			effect: ({ target, property }) => orderEffect(target, property),
			action: async () => {
				if (orderState) await apiClient.putOrder.mutate(orderState.data);
			}
		});

		loading = false;
	});
</script>

<DemoHeader badge="tRPC Fetch" badgeColor="blue" title="tRPC Client Fetch" />

{#if loading}
	<Card class="mx-auto mt-4 max-w-2xl p-4" size="xl">
		<div class="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
			<Skeleton class="h-12 w-12 rounded-full" />
			<div class="flex-1">
				<Skeleton class="mb-2 h-5 w-32" />
				<Skeleton class="h-4 w-48" />
			</div>
		</div>

		<div class="mb-6">
			<Skeleton class="mb-2 h-4 w-20" />
			<Skeleton class="h-10 w-full" />
		</div>

		<div class="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
			<Skeleton class="mb-2 h-4 w-24" />
			<div class="flex gap-2">
				<Skeleton class="h-10 flex-1" />
				<Skeleton class="h-10 w-20" />
			</div>
		</div>

		<div class="mb-6">
			<div class="mb-3 flex items-center justify-between">
				<Skeleton class="h-4 w-24" />
				<Skeleton class="h-6 w-16 rounded-full" />
			</div>
			<div class="space-y-3">
				{#each [0, 1] as index (index)}
					<div
						class="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600"
					>
						<div class="flex-1">
							<Skeleton class="mb-2 h-4 w-32" />
							<Skeleton class="h-3 w-20" />
						</div>
						<Skeleton class="h-8 w-24" />
						<Skeleton class="h-8 w-20" />
					</div>
				{/each}
			</div>
		</div>

		<div class="border-t border-gray-200 pt-4 dark:border-gray-700">
			<div class="mb-6 flex items-center justify-between">
				<Skeleton class="h-5 w-28" />
				<Skeleton class="h-8 w-24" />
			</div>
			<Skeleton class="h-12 w-full" />
		</div>
	</Card>
{:else if orderState}
	<div in:fade={{ duration: 300 }}>
		<OrderEditor action={orderState.execute} {customers} order={orderState.data} {products} />
	</div>
{/if}
