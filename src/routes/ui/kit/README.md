# SvelteKit Native

**The traditional approach using built-in SvelteKit features.**

## How It Works

- Data loaded via `+page.server.ts` load function
- Form submissions handled by SvelteKit actions (order posted as hidden `orderJson`)
- Malformed input returns `fail(400)`; valid input goes through the shared server-side `submitOrder` (customer/product checks, catalog prices, recomputed total)
- The page shows the action result (`form.error` / `form.success`)
- Full page reload on submit

## Code Pattern

```typescript
// +page.server.ts
export const load: PageServerLoad = async () => {
	return {
		customers: await getCustomers(),
		products: await getProducts(),
		order: await createDefaultOrder(0)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const parsed = parseOrderJson((await event.request.formData()).get('orderJson'));
		if (!parsed?.success) return fail(400, { error: 'Invalid order data' });

		const error = await submitOrder(parsed.data);
		if (error) return fail(400, { error });
		return { success: true };
	}
};
```

## Best For

- Simple CRUD applications
- Native form posts without client-side API plumbing
- SEO-critical pages
