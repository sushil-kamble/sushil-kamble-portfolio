import { json } from '@sveltejs/kit';
import { COOKIE_NAME, createToken, getAdminPassword, getAuthCookieOptions } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	const { password } = await request.json();

	if (password !== getAdminPassword()) {
		return json({ error: 'Invalid password' }, { status: 401 });
	}

	const token = await createToken();
	cookies.set(COOKIE_NAME, token, getAuthCookieOptions());

	return json({ success: true });
}
