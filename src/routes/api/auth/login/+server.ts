import { json } from '@sveltejs/kit';
import { ADMIN_PASSWORD } from '$env/static/private';
import { createToken, getTokenCookie } from '$lib/server/auth';

export async function POST({ request }) {
	const { password } = await request.json();

	if (password !== ADMIN_PASSWORD) {
		return json({ error: 'Invalid password' }, { status: 401 });
	}

	const token = await createToken();

	return json(
		{ success: true },
		{
			headers: {
				'Set-Cookie': getTokenCookie(token)
			}
		}
	);
}
