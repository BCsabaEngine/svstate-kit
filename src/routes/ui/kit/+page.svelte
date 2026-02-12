<script lang="ts">
	import { get } from 'svelte/store';
	import { createSvState } from 'svstate';

	import DemoHeader from '$components/DemoHeader.svelte';
	import OrderEditor from '$components/OrderEditor.svelte';
	import { orderEffect } from '$types/Effect.js';
	import { orderValidator } from '$types/Validators.js';

	const { data } = $props();

	// svelte-ignore state_referenced_locally
	const { data: reactiveOrder, state: stores } = createSvState(data.order, {
		effect: ({ target, property }) => orderEffect(target, property),
		validator: (source) => orderValidator(source)
	});

	let errors = $state(get(stores.errors));
	let hasErrors = $state(get(stores.hasErrors));

	$effect(() => stores.errors.subscribe((v) => (errors = v)));
	$effect(() => stores.hasErrors.subscribe((v) => (hasErrors = v)));
</script>

<DemoHeader badge="SvelteKit" badgeColor="green" title="SvelteKit Default" />

<form method="POST">
	<OrderEditor
		customers={data.customers}
		{errors}
		{hasErrors}
		order={reactiveOrder}
		products={data.products}
	/>
</form>
