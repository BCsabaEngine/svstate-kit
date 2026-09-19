<script lang="ts">
	import { fromStore } from 'svelte/store';
	import { createSvState } from 'svstate';

	import DemoHeader from '$components/DemoHeader.svelte';
	import OrderEditor from '$components/OrderEditor.svelte';
	import { orderEffect } from '$types/Effect';
	import { orderValidator } from '$types/Validators';

	const { data, form } = $props();

	// svelte-ignore state_referenced_locally
	const { data: reactiveOrder, state: stores } = createSvState(data.order, {
		effect: ({ target, property }) => orderEffect(target, property),
		validator: (source) => orderValidator(source)
	});

	const errors = fromStore(stores.errors);
	const hasErrors = fromStore(stores.hasErrors);
</script>

<DemoHeader badge="SvelteKit" badgeColor="green" title="SvelteKit Default" />

<form method="POST">
	{#if form?.error}
		<p class="mx-auto mt-4 max-w-2xl rounded-lg bg-red-50 p-3 text-sm text-red-700">{form.error}</p>
	{:else if form?.success}
		<p class="mx-auto mt-4 max-w-2xl rounded-lg bg-green-50 p-3 text-sm text-green-700">
			Order submitted successfully!
		</p>
	{/if}
	<OrderEditor
		customers={data.customers}
		errors={errors.current}
		hasErrors={hasErrors.current}
		order={reactiveOrder}
		products={data.products}
	/>
</form>
