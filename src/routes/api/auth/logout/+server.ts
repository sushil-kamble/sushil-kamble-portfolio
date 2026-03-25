import { json } from '@sveltejs/kit';
import { COOKIE_NAME, getAuthCookieOptions } from '$lib/server/auth';

export async function POST({ cookies }) {
	cookies.delete(COOKIE_NAME, {
		...getAuthCookieOptions(),
		maxAge: 0
	});

	return json({ success: true });
}
