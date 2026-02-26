<script lang="ts">
	import { Badge, Button } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	interface Properties {
		title: string;
		badge: string;
		badgeColor?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo' | 'pink' | 'gray';
	}

	const { title, badge, badgeColor = 'blue' }: Properties = $props();
</script>

<header class="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
		<div class="flex items-center gap-4">
			<Button color="light" href="/" outline size="sm">
				<ArrowLeftOutline class="mr-2 h-4 w-4" />
				Home
			</Button>
			<div class="h-6 w-px bg-gray-300"></div>
			<h1 class="text-lg font-semibold text-gray-900">{title}</h1>
		</div>
		<Badge color={badgeColor} large>{badge}</Badge>
	</div>
</header>
