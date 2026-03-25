import { redirect, type Handle } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// Protect /admin routes (except /admin/login) and the /deploy diagnostic page
	if (
		(pathname.startsWith('/admin') && pathname !== '/admin/login') ||
		pathname.startsWith('/deploy')
	) {
		const token = event.cookies.get(COOKIE_NAME);

		if (!token || !(await verifyToken(token))) {
			throw redirect(303, '/admin/login');
		}

		event.locals.authenticated = true;
	}

	return resolve(event);
};
