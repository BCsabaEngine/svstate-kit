<script lang="ts">
	import { createSvState } from 'svstate';

	import OrderEditor from '$components/OrderEditor.svelte';
	import { orderEffect } from '$types/Effect.js';

	const { data } = $props();

	// svelte-ignore state_referenced_locally
	const { data: reactiveOrder } = createSvState(data.order, {
		effect: ({ target, property }) => orderEffect(target, property)
	});
</script>

<form method="POST">
	<OrderEditor customers={data.customers} order={reactiveOrder} products={data.products} />
</form>
