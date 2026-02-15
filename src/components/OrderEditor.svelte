<script lang="ts">
	import { Badge, Button, Card, Input, Label, Select, Spinner } from 'flowbite-svelte';
	import { PlusOutline, ShoppingBagOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { untrack } from 'svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';
	import type { AsyncErrors, DirtyFields } from 'svstate';

	import { addToast } from '$lib/stores/toast.svelte.js';
	import { calculateOrderTotal } from '$types/Effect.js';
	import type { Customer, Order, Product } from '$types/Schema';
	import type { OrderErrors } from '$types/Validators';

	interface Properties {
		order: Order;
		customers: Customer[];
		products: Product[];
		action?: (order: Order) => Promise<void>;
		errors?: OrderErrors | undefined;
		hasErrors?: boolean;
		asyncErrors?: AsyncErrors | undefined;
		asyncValidating?: string[];
		hasCombinedErrors?: boolean;
		isDirty?: boolean;
		isDirtyByField?: DirtyFields | undefined;
		actionInProgress?: boolean;
		actionError?: Error | undefined;
	}

	const {
		order,
		customers,
		products,
		action,
		errors,
		hasErrors,
		asyncErrors,
		asyncValidating,
		hasCombinedErrors,
		isDirty,
		isDirtyByField,
		actionInProgress,
		actionError
	}: Properties = $props();

	let selectedProductId = $state<number | undefined>();
	let isSubmitting = $state(false);

	const animatedTotal = tweened(
		untrack(() => order.totalAmount),
		{
			duration: 400,
			easing: cubicOut
		}
	);

	$effect(() => {
		animatedTotal.set(order.totalAmount);
	});

	function getProduct(productId: number): Product | undefined {
		return products.find((p) => p.id === productId);
	}

	function getCustomer(customerId: number): Customer | undefined {
		return customers.find((c) => c.id === customerId);
	}

	function addProduct() {
		if (selectedProductId === undefined) return;
		const product = getProduct(selectedProductId);
		if (!product) return;

		const existing = order.products.find((p) => p.productId === selectedProductId);
		if (existing) existing.quantity += 1;
		else
			order.products.push({
				productId: product.id,
				unitPrice: product.unitPrice,
				quantity: 1
			});

		recalculateTotal();
		selectedProductId = undefined;
	}

	function removeProduct(index: number) {
		order.products.splice(index, 1);
		recalculateTotal();
	}

	function updateQuantity(index: number, quantity: number) {
		if (quantity < 1) quantity = 1;
		order.products[index].quantity = quantity;
		recalculateTotal();
	}

	function recalculateTotal() {
		order.totalAmount = calculateOrderTotal(order);
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
	}

	async function handleSubmit() {
		if (!action) return;

		isSubmitting = true;
		try {
			await action(order);
			addToast('success', 'Order submitted successfully!');
		} catch {
			addToast('error', 'Failed to submit order. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	const availableProducts = $derived(
		products.filter((p) => !order.products.some((op) => op.productId === p.id))
	);

	const submitting = $derived(actionInProgress ?? isSubmitting);
	const submitDisabled = $derived(
		hasCombinedErrors === undefined
			? hasErrors === undefined
				? order.products.length === 0 || !order.customerId || submitting
				: hasErrors || submitting
			: hasCombinedErrors || submitting
	);

	function isFieldDirty(field: string): boolean {
		return isDirtyByField?.[field] ?? false;
	}

	function isAsyncValidating(field: string): boolean {
		return asyncValidating?.includes(field) ?? false;
	}
</script>

<Card class="mx-auto mt-4 max-w-2xl p-4" size="xl">
	<div class="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
		<div class="bg-primary-100 dark:bg-primary-900 rounded-full p-3">
			<ShoppingBagOutline class="text-primary-600 dark:text-primary-400 h-6 w-6" />
		</div>
		<div>
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">Order Editor</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400">Create or modify your order</p>
		</div>
	</div>

	<!-- Unsaved Changes Banner -->
	{#if isDirty}
		<div
			class="mb-4 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 dark:border-amber-600 dark:bg-amber-900/20"
			transition:fly={{ y: -10, duration: 200 }}
		>
			<div class="h-2 w-2 rounded-full bg-amber-500"></div>
			<span class="text-sm font-medium text-amber-700 dark:text-amber-400">Unsaved changes</span>
		</div>
	{/if}

	<!-- Action Error Banner -->
	{#if actionError}
		<div
			class="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400"
			transition:fly={{ y: -10, duration: 200 }}
		>
			{actionError.message}
		</div>
	{/if}

	<!-- Customer Selection -->
	<div class="mb-6">
		<div class="flex items-center gap-2">
			<Label class="mb-2 font-semibold text-gray-700 dark:text-gray-300">Customer</Label>
			{#if isFieldDirty('customerId')}
				<div class="h-2 w-2 rounded-full bg-amber-500" title="Modified"></div>
			{/if}
			{#if isAsyncValidating('customerId')}
				<Spinner size="4" />
			{/if}
		</div>
		<Select
			name="customerId"
			class="mt-1"
			items={customers.map((customer) => ({ value: customer.id, name: customer.name }))}
			placeholder="Select a customer..."
			bind:value={order.customerId}
		/>
		{#if errors?.customerId}
			<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerId}</p>
		{/if}
		{#if asyncErrors?.['customerId']}
			<p class="mt-1 text-sm text-red-600 dark:text-red-400">{asyncErrors['customerId']}</p>
		{/if}
		{#if order.customerId && !errors?.customerId && !asyncErrors?.['customerId']}
			<p class="mt-2 text-sm text-green-600 dark:text-green-400">
				Selected: {getCustomer(order.customerId)?.name}
			</p>
		{/if}
	</div>

	<!-- Order Reference -->
	<div class="mb-6">
		<div class="flex items-center gap-2">
			<Label class="mb-2 font-semibold text-gray-700 dark:text-gray-300">Order Reference</Label>
			{#if isFieldDirty('orderReference')}
				<div class="h-2 w-2 rounded-full bg-amber-500" title="Modified"></div>
			{/if}
			{#if isAsyncValidating('orderReference')}
				<Spinner size="4" />
			{/if}
		</div>
		<Input
			name="orderReference"
			class="mt-1 pl-2"
			placeholder="e.g. ORD123"
			bind:value={order.orderReference}
		/>
		{#if errors?.orderReference}
			<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.orderReference}</p>
		{/if}
		{#if asyncErrors?.['orderReference']}
			<p class="mt-1 text-sm text-red-600 dark:text-red-400">{asyncErrors['orderReference']}</p>
		{/if}
	</div>

	<!-- Add Product Section -->
	<div class="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
		<div class="flex items-center gap-2">
			<Label class="mb-2 font-semibold text-gray-700 dark:text-gray-300">Add Product</Label>
			{#if isFieldDirty('products')}
				<div class="h-2 w-2 rounded-full bg-amber-500" title="Modified"></div>
			{/if}
		</div>
		<div class="mt-1 flex gap-2">
			<Select
				name="productId"
				class="flex-1"
				items={availableProducts.map((product) => ({
					value: product.id,
					name: `${product.title} - ${formatCurrency(product.unitPrice)}`
				}))}
				placeholder="Select a product to add..."
				bind:value={selectedProductId}
			/>
			<Button color="green" disabled={selectedProductId === undefined} onclick={addProduct}>
				<PlusOutline class="mr-1 h-4 w-4" />
				Add
			</Button>
		</div>
		{#if errors?.products}
			<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.products}</p>
		{/if}
	</div>

	<!-- Order Items -->
	<div class="mb-6">
		<div class="mb-3 flex items-center justify-between">
			<Label class="font-semibold text-gray-700 dark:text-gray-300">Order Items</Label>
			<Badge color="blue">{order.products.length} item(s)</Badge>
		</div>

		{#if order.products.length === 0}
			<div class="rounded-lg bg-gray-50 py-8 text-center dark:bg-gray-800">
				<ShoppingBagOutline class="mx-auto mb-2 h-12 w-12 text-gray-300 dark:text-gray-600" />
				<p class="text-gray-500 dark:text-gray-400">No products added yet</p>
				<p class="text-sm text-gray-400 dark:text-gray-500">
					Select a product above to get started
				</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each order.products as item, index (item.productId)}
					{@const product = getProduct(item.productId)}
					<div
						class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 dark:hover:border-blue-500"
						in:fly={{ x: -20, duration: 300 }}
						out:fade={{ duration: 200 }}
						animate:flip={{ duration: 300 }}
					>
						<div class="flex-1">
							<p class="font-medium text-gray-900 dark:text-white">
								{product?.title ?? 'Unknown Product'}
							</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{formatCurrency(item.unitPrice)} each
							</p>
						</div>

						<div class="flex items-center gap-2">
							<button
								class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 active:scale-95 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
								onclick={() => updateQuantity(index, item.quantity - 1)}
							>
								-
							</button>
							<span class="w-12 text-center font-medium text-gray-900 dark:text-white">
								{item.quantity}
							</span>
							<button
								class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 active:scale-95 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
								onclick={() => updateQuantity(index, item.quantity + 1)}
							>
								+
							</button>
						</div>

						<div class="w-24 text-right">
							<p class="font-semibold text-gray-900 dark:text-white">
								{formatCurrency(item.unitPrice * item.quantity)}
							</p>
						</div>

						<button
							class="rounded p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 active:scale-95 dark:hover:bg-red-900/20"
							onclick={() => removeProduct(index)}
						>
							<TrashBinOutline class="h-5 w-5" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Total Section -->
	<div class="border-t border-gray-200 pt-4 dark:border-gray-700">
		<div class="mb-6 flex items-center justify-between">
			<span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Amount</span>
			<span class="text-primary-600 dark:text-primary-400 text-2xl font-bold tabular-nums">
				{formatCurrency($animatedTotal)}
			</span>
		</div>

		<!-- Submit Button -->
		{#if action}
			<Button
				class="w-full active:scale-[0.98]"
				color="blue"
				disabled={submitDisabled}
				onclick={handleSubmit}
				size="lg"
			>
				{#if submitting}
					<Spinner class="mr-2" size="5" />
					Submitting...
				{:else}
					<ShoppingBagOutline class="mr-2 h-5 w-5" />
					Submit Order
				{/if}
			</Button>
		{:else}
			<Button
				class="w-full active:scale-[0.98]"
				color="blue"
				disabled={submitDisabled}
				size="lg"
				type="submit"
			>
				<ShoppingBagOutline class="mr-2 h-5 w-5" />
				Submit Order
			</Button>
		{/if}

		{#if !action && (order.products.length === 0 || !order.customerId)}
			<p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
				{#if !order.customerId}
					Please select a customer
				{:else}
					Please add at least one product
				{/if}
			</p>
		{/if}
	</div>
</Card>
