<script lang="ts">
	import { Card, Skeleton } from 'flowbite-svelte';
</script>

<Card class="mx-auto mt-4 max-w-2xl p-4" size="xl">
	<div class="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
		<Skeleton class="h-12 w-12 rounded-full" />
		<div class="flex-1">
			<Skeleton class="mb-2 h-5 w-32" />
			<Skeleton class="h-4 w-48" />
		</div>
	</div>

	<div class="mb-6">
		<Skeleton class="mb-2 h-4 w-20" />
		<Skeleton class="h-10 w-full" />
	</div>

	<div class="mb-6">
		<Skeleton class="mb-2 h-4 w-28" />
		<Skeleton class="h-10 w-full" />
	</div>

	<div class="mb-6 rounded-lg bg-gray-50 p-4">
		<Skeleton class="mb-2 h-4 w-24" />
		<div class="flex gap-2">
			<Skeleton class="h-10 flex-1" />
			<Skeleton class="h-10 w-20" />
		</div>
	</div>

	<div class="mb-6">
		<div class="mb-3 flex items-center justify-between">
			<Skeleton class="h-4 w-24" />
			<Skeleton class="h-6 w-16 rounded-full" />
		</div>
		<div class="space-y-3">
			{#each [0, 1] as index (index)}
				<div class="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
					<div class="flex-1">
						<Skeleton class="mb-2 h-4 w-32" />
						<Skeleton class="h-3 w-20" />
					</div>
					<Skeleton class="h-8 w-24" />
					<Skeleton class="h-8 w-20" />
				</div>
			{/each}
		</div>
	</div>

	<div class="border-t border-gray-200 pt-4">
		<div class="mb-6 flex items-center justify-between">
			<Skeleton class="h-5 w-28" />
			<Skeleton class="h-8 w-24" />
		</div>
		<Skeleton class="h-12 w-full" />
	</div>
</Card>
