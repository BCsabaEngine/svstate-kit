<script lang="ts">
	import { fromStore } from 'svelte/store';
	import { createSvState } from 'svstate';

	import DemoHeader from '$components/DemoHeader.svelte';
	import OrderEditor from '$components/OrderEditor.svelte';
	import { apiClient } from '$lib/trpc/client';
	import { orderEffect } from '$types/Effect';
	import { orderValidator } from '$types/Validators';

	const { data } = $props();

	// svelte-ignore state_referenced_locally
	const {
		data: reactiveOrder,
		execute,
		state: stores,
		validate
	} = createSvState(data.order, {
		effect: ({ target, property }) => orderEffect(target, property),
		action: async () => {
			await apiClient.putOrder.mutate(reactiveOrder);
		},
		validator: (source) => orderValidator(source)
	});

	const errors = fromStore(stores.errors);
	const hasErrors = fromStore(stores.hasErrors);
	const isDirty = fromStore(stores.isDirty);
	const isDirtyByField = fromStore(stores.isDirtyByField);
	const actionInProgress = fromStore(stores.actionInProgress);
	const actionError = fromStore(stores.actionError);

	const submitOrder = async () => {
		if (validate().hasErrors) return;
		await execute();
	};
</script>

<DemoHeader badge="tRPC Server" badgeColor="purple" title="tRPC Server" />

<OrderEditor
	action={submitOrder}
	actionError={actionError.current}
	actionInProgress={actionInProgress.current}
	customers={data.customers}
	errors={errors.current}
	hasErrors={hasErrors.current}
	isDirty={isDirty.current}
	isDirtyByField={isDirtyByField.current}
	order={reactiveOrder}
	products={data.products}
/>
