import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { router } from '$lib/trpc/router';
import { createTRPCHandle } from '$lib/trpc/server';

export const handle: Handle = sequence(createTRPCHandle(router, '/trpc', async () => ({})));
