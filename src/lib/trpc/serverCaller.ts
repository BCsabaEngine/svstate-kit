import { createCallerFactory } from './init';
import { router } from './router';

export const trpcServerCaller = createCallerFactory(router)({});
