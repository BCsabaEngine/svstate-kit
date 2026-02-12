<script lang="ts">
	import { Badge, Button, Card } from 'flowbite-svelte';
	import {
		ArrowRightOutline,
		CodeBranchOutline,
		GlobeOutline,
		ServerOutline
	} from 'flowbite-svelte-icons';

	const demos = [
		{
			title: 'SvelteKit Default',
			description:
				'Classic SvelteKit form actions with sync validators. Demonstrates numberValidator, stringValidator, and arrayValidator.',
			href: '/ui/kit',
			badge: 'Validators',
			badgeColor: 'green' as const,
			icon: CodeBranchOutline
		},
		{
			title: 'tRPC Server',
			description:
				'Server-side tRPC with sync validators and per-field dirty tracking. Shows isDirty and isDirtyByField indicators.',
			href: '/ui/trpc-server',
			badge: 'Dirty Tracking',
			badgeColor: 'blue' as const,
			icon: ServerOutline
		},
		{
			title: 'tRPC Fetch',
			description:
				'Full showcase: sync + async validators, dirty tracking, hasCombinedErrors, and debounced server-side validation.',
			href: '/ui/trpc-fetch',
			badge: 'Full Demo',
			badgeColor: 'purple' as const,
			icon: GlobeOutline
		}
	];
</script>

<div
	class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
>
	<div class="mx-auto max-w-5xl px-4 py-16">
		<!-- Header -->
		<div class="mb-16 text-center">
			<Badge class="mb-4" color="yellow">Demo Project</Badge>
			<h1 class="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
				<span class="from-primary-600 bg-linear-to-r to-purple-600 bg-clip-text text-transparent">
					svstate
				</span>
				-kit
			</h1>
			<p class="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
				Explore different patterns for state management in SvelteKit applications. Choose your
				preferred approach below.
			</p>
		</div>

		<!-- Demo Cards -->
		<div class="grid gap-6 md:grid-cols-3">
			{#each demos as demo}
				<Card
					class="relative overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div
						class="from-primary-100 dark:from-primary-900 absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br to-purple-100 opacity-50 dark:to-purple-900"
					></div>

					<div class="relative">
						<div class="mb-4 flex items-center justify-between">
							<div class="bg-primary-100 dark:bg-primary-900 rounded-lg p-2">
								<svelte:component
									this={demo.icon}
									class="text-primary-600 dark:text-primary-400 h-6 w-6"
								/>
							</div>
							<Badge color={demo.badgeColor}>{demo.badge}</Badge>
						</div>

						<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
							{demo.title}
						</h2>
						<p class="mb-6 text-sm text-gray-600 dark:text-gray-400">
							{demo.description}
						</p>

						<Button class="w-full" href={demo.href}>
							Explore
							<ArrowRightOutline class="ml-2 h-4 w-4" />
						</Button>
					</div>
				</Card>
			{/each}
		</div>

		<!-- Footer Info -->
		<div class="mt-16 text-center">
			<p class="text-sm text-gray-500 dark:text-gray-500">
				Built with SvelteKit, tRPC, Flowbite, and svstate v1.4.0
			</p>
		</div>
	</div>
</div>
