<script lang="ts">
	import { createSvState } from 'svstate';

	import OrderEditor from '$components/OrderEditor.svelte';
	import { apiClient } from '$lib/trpc/client.js';
	import { orderEffect } from '$types/Effect.js';

	const { data } = $props();

	// svelte-ignore state_referenced_locally
	const { data: reactiveOrder, execute } = createSvState(data.order, {
		effect: ({ target, property }) => orderEffect(target, property),
		action: async () => {
			await apiClient.putOrder.mutate(reactiveOrder);
		}
	});
</script>

<OrderEditor
	action={execute}
	customers={data.customers}
	order={reactiveOrder}
	products={data.products}
/>
