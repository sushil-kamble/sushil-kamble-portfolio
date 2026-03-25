import { redirect } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';

export async function load({ cookies }) {
	const token = cookies.get(COOKIE_NAME);
	if (token && (await verifyToken(token))) {
		throw redirect(303, '/admin');
	}
	return {};
}
