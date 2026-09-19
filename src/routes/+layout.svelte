<script lang="ts">
	import '../app.css';

	import type { Snippet } from 'svelte';

	import { onNavigate } from '$app/navigation';
	import ToastContainer from '$components/ToastContainer.svelte';

	interface Properties {
		children: Snippet;
	}

	const { children }: Properties = $props();

	// Cross-fade old/new page via the View Transitions API (no double-rendered pages, no blank flash)
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<ToastContainer />

{@render children()}
