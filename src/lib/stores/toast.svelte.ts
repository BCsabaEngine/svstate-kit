export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: number;
	type: ToastType;
	message: string;
}

const toasts = $state<Toast[]>([]);
let nextId = 0;

export function getToasts(): Toast[] {
	return toasts;
}

export function addToast(type: ToastType, message: string): number {
	const id = nextId++;
	toasts.push({ id, type, message });

	setTimeout(() => {
		removeToast(id);
	}, 4000);

	return id;
}

export function removeToast(id: number): void {
	const index = toasts.findIndex((t) => t.id === id);
	if (index !== -1) toasts.splice(index, 1);
}
