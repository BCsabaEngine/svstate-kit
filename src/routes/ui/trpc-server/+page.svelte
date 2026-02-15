<script lang="ts">
	import { get } from 'svelte/store';
	import { createSvState } from 'svstate';

	import DemoHeader from '$components/DemoHeader.svelte';
	import OrderEditor from '$components/OrderEditor.svelte';
	import { apiClient } from '$lib/trpc/client.js';
	import { orderEffect } from '$types/Effect.js';
	import { orderValidator } from '$types/Validators.js';

	const { data } = $props();

	// svelte-ignore state_referenced_locally
	const {
		data: reactiveOrder,
		execute,
		state: stores
	} = createSvState(data.order, {
		effect: ({ target, property }) => orderEffect(target, property),
		action: async () => {
			await apiClient.putOrder.mutate(reactiveOrder);
		},
		validator: (source) => orderValidator(source)
	});

	let errors = $state(get(stores.errors));
	let hasErrors = $state(get(stores.hasErrors));
	let isDirty = $state(get(stores.isDirty));
	let isDirtyByField = $state(get(stores.isDirtyByField));
	let actionInProgress = $state(get(stores.actionInProgress));
	let actionError = $state(get(stores.actionError));

	$effect(() => {
		const unsub = stores.errors.subscribe((v) => (errors = v));
		return unsub;
	});
	$effect(() => {
		const unsub = stores.hasErrors.subscribe((v) => (hasErrors = v));
		return unsub;
	});
	$effect(() => {
		const unsub = stores.isDirty.subscribe((v) => (isDirty = v));
		return unsub;
	});
	$effect(() => {
		const unsub = stores.isDirtyByField.subscribe((v) => (isDirtyByField = v));
		return unsub;
	});
	$effect(() => {
		const unsub = stores.actionInProgress.subscribe((v) => (actionInProgress = v));
		return unsub;
	});
	$effect(() => {
		const unsub = stores.actionError.subscribe((v) => (actionError = v));
		return unsub;
	});
</script>

<DemoHeader badge="tRPC Server" badgeColor="purple" title="tRPC Server" />

<OrderEditor
	action={execute}
	{actionError}
	{actionInProgress}
	customers={data.customers}
	{errors}
	{hasErrors}
	{isDirty}
	{isDirtyByField}
	order={reactiveOrder}
	products={data.products}
/>
