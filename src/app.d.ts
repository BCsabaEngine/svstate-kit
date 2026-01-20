import type { Container } from '$lib/server/container';
import type { ApiLocalCaller } from '$lib/trpc/init';
import type { UserSessionWithPermissionChecker } from '$types/UserSession';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			apiCaller: ApiLocalCaller;
			container: Container;
			user: UserSessionWithPermissionChecker | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
