import { mergeRouters } from '$lib/trpc/init';

import { trpcMasterData } from './masterData';
import { trpcOrder } from './order';
import { trpcValidation } from './validation';

export const router = mergeRouters(trpcMasterData, trpcOrder, trpcValidation);
