# SvelteKit Native

**The traditional approach using built-in SvelteKit features.**

## How It Works

- Data loaded via `+page.server.ts` load function
- Form submissions handled by SvelteKit actions
- Full page reload on submit

## Code Pattern

```typescript
// +page.server.ts
export const load: PageServerLoad = async () => {
	return {
		customers: await getCustomers(),
		products: await getProducts(),
		order: await createDefaultOrder(0, 0)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		// Process form...
	}
};
```

## Best For

- Simple CRUD applications
- Progressive enhancement (works without JS)
- SEO-critical pages
