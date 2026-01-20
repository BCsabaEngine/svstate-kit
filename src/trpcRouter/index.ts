import { mergeRouters } from '$lib/trpc/init';

import { trpcMasterData } from './masterData';
import { trpcOrder } from './order';

export const router = mergeRouters(trpcMasterData, trpcOrder);
