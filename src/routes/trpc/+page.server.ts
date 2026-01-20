import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	return {
		passwordExpirationAt: user?.passwordExpirationAt,
		passwordExpired: user && user.passwordExpirationAt && user.passwordExpirationAt < new Date()
	};
};
