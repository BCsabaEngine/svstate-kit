import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import type { Router } from './router';

const t = initTRPC.create({ transformer: superjson });

export const createApiRouter = t.router;
export const mergeRouters = t.mergeRouters;
export const apiProcedure = t.procedure;

export const createCallerFactory = t.createCallerFactory;
export type ApiLocalCaller = ReturnType<
	ReturnType<typeof createCallerFactory<Router['_def']['procedures']>>
>;
