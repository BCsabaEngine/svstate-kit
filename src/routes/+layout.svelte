<script lang="ts">
	import '../app.css';

	import type { Snippet } from 'svelte';

	interface Properties {
		children: Snippet;
	}

	const { children }: Properties = $props();
</script>

{@render children()}
