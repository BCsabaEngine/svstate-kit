<script lang="ts">
	import '../app.css';

	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	import { page } from '$app/stores';
	import ToastContainer from '$components/ToastContainer.svelte';

	interface Properties {
		children: Snippet;
	}

	const { children }: Properties = $props();
</script>

<ToastContainer />

{#key $page.url.pathname}
	<div in:fade={{ duration: 200, delay: 100 }} out:fade={{ duration: 100 }}>
		{@render children()}
	</div>
{/key}
