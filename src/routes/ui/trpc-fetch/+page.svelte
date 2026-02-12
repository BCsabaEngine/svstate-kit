<script lang="ts">
	import { Card, Skeleton } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { type AsyncErrors, createSvState, type DirtyFields } from 'svstate';

	import DemoHeader from '$components/DemoHeader.svelte';
	import OrderEditor from '$components/OrderEditor.svelte';
	import { apiClient } from '$lib/trpc/client.js';
	import { createOrderWithMethods, type OrderWithMethods } from '$types/OrderWithMethods.js';
	import type { Customer, Product } from '$types/Schema';
	import { type OrderErrors, orderValidator } from '$types/Validators.js';

	let customers = $state<Customer[]>([]);
	let products = $state<Product[]>([]);
	let orderState = $state<{
		data: OrderWithMethods;
		execute: () => Promise<void>;
	}>();
	let loading = $state(true);

	let errors = $state<OrderErrors | undefined>();
	let hasErrors = $state(false);
	let asyncErrors = $state<AsyncErrors>({});
	let asyncValidating = $state<string[]>([]);
	let hasCombinedErrors = $state(false);
	let isDirty = $state(false);
	let isDirtyByField = $state<DirtyFields>({});
	let actionInProgress = $state(false);
	let actionError = $state<Error | undefined>();

	onMount(async () => {
		const [customersData, productsData, orderData] = await Promise.all([
			apiClient.getCustomers.query(),
			apiClient.getProducts.query(),
			apiClient.getDefaultOrder.query({ customerId: 0, productId: 0 })
		]);

		customers = customersData;
		products = productsData;
		const orderWithMethods = createOrderWithMethods(orderData);

		const result = createSvState(
			orderWithMethods,
			{
				effect: ({ target, property }) => {
					if (property !== 'totalAmount') target.calculateTotals();
				},
				action: async () => {
					await apiClient.putOrder.mutate(result.data);
				},
				validator: (source) => orderValidator(source),
				asyncValidator: {
					customerId: async (value, _source, signal) => {
						const result = await apiClient.validateCustomer.query(
							{ customerId: value as number },
							{ signal }
						);
						return result;
					},
					orderReference: async (value, _source, signal) => {
						const result = await apiClient.validateOrderReference.query(
							{ reference: value as string },
							{ signal }
						);
						return result;
					}
				}
			},
			{
				debounceAsyncValidation: 500,
				clearAsyncErrorsOnChange: true
			}
		);

		orderState = result;

		errors = get(result.state.errors);
		hasErrors = get(result.state.hasErrors);
		asyncErrors = get(result.state.asyncErrors);
		asyncValidating = get(result.state.asyncValidating);
		hasCombinedErrors = get(result.state.hasCombinedErrors);
		isDirty = get(result.state.isDirty);
		isDirtyByField = get(result.state.isDirtyByField);
		actionInProgress = get(result.state.actionInProgress);
		actionError = get(result.state.actionError);

		result.state.errors.subscribe((v) => (errors = v));
		result.state.hasErrors.subscribe((v) => (hasErrors = v));
		result.state.asyncErrors.subscribe((v) => (asyncErrors = v));
		result.state.asyncValidating.subscribe((v) => (asyncValidating = v));
		result.state.hasCombinedErrors.subscribe((v) => (hasCombinedErrors = v));
		result.state.isDirty.subscribe((v) => (isDirty = v));
		result.state.isDirtyByField.subscribe((v) => (isDirtyByField = v));
		result.state.actionInProgress.subscribe((v) => (actionInProgress = v));
		result.state.actionError.subscribe((v) => (actionError = v));

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

		<div class="mb-6">
			<Skeleton class="mb-2 h-4 w-28" />
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
		<OrderEditor
			action={orderState.execute}
			{actionError}
			{actionInProgress}
			{asyncErrors}
			{asyncValidating}
			{customers}
			{errors}
			{hasCombinedErrors}
			{hasErrors}
			{isDirty}
			{isDirtyByField}
			order={orderState.data}
			{products}
		/>
	</div>
{/if}
