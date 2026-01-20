<script lang="ts">
	import { Button, Label, Select } from 'flowbite-svelte';

	import type { Customer, Order, Product } from '$types/Schema';

	interface Properties {
		order: Order;
		customers: Customer[];
		products: Product[];
		action?: (order: Order) => Promise<void>;
	}

	const { order, customers, products, action }: Properties = $props();
</script>

<Label>
	Select an option
	<Select
		name="customerId"
		class="mt-2"
		items={customers.map((customer) => ({ value: customer.id, name: customer.name }))}
		bind:value={order.customerId}
	/>
</Label>

<Label>
	Select an option
	<Select
		name="productId"
		class="mt-2"
		items={products.map((product) => ({ value: product.id, name: product.title }))}
	/>
</Label>

{#if action}
	<Button onclick={() => action(order)}>Submit Order vis Action</Button>
{:else}
	<button>Submit Order via Form</button>
{/if}
