<script lang="ts">
	import {
		CheckCircleOutline,
		CloseCircleOutline,
		CloseOutline,
		ExclamationCircleOutline,
		InfoCircleOutline
	} from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';

	import { getToasts, removeToast, type ToastType } from '$lib/stores/toast.svelte.js';

	const toasts = $derived(getToasts());

	const colorClasses: Record<ToastType, string> = {
		success: 'bg-green-100 text-green-500',
		error: 'bg-red-100 text-red-500',
		warning: 'bg-orange-100 text-orange-500',
		info: 'bg-blue-100 text-blue-500'
	};
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
	{#each toasts as toast (toast.id)}
		<div
			class="flex w-full max-w-xs items-center rounded-lg bg-white p-4 shadow"
			role="alert"
			in:fly={{ x: 300, duration: 300 }}
			out:fly={{ x: 300, duration: 200 }}
		>
			<div
				class={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${colorClasses[toast.type]}`}
			>
				{#if toast.type === 'success'}
					<CheckCircleOutline class="h-5 w-5" />
				{:else if toast.type === 'error'}
					<CloseCircleOutline class="h-5 w-5" />
				{:else if toast.type === 'warning'}
					<ExclamationCircleOutline class="h-5 w-5" />
				{:else}
					<InfoCircleOutline class="h-5 w-5" />
				{/if}
			</div>
			<div class="ms-3 text-sm font-normal text-gray-900">{toast.message}</div>
			<button
				class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
				onclick={() => removeToast(toast.id)}
				type="button"
			>
				<span class="sr-only">Close</span>
				<CloseOutline class="h-5 w-5" />
			</button>
		</div>
	{/each}
</div>
