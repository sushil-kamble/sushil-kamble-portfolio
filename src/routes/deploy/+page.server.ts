import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store, max-age=0',
		'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex'
	});

	const deployHookUrl = env.VERCEL_DEPLOY_HOOK_URL;

	if (!deployHookUrl) {
		return {
			ok: false,
			status: 0,
			statusText: 'Not configured',
			responseBody: 'VERCEL_DEPLOY_HOOK_URL environment variable is not set.',
			triggeredAt: new Date().toISOString()
		};
	}
	const triggeredAt = new Date().toISOString();

	try {
		const response = await fetch(deployHookUrl, { method: 'POST' });
		const contentType = response.headers.get('content-type') ?? '';
		let responseBody = '';

		if (contentType.includes('application/json')) {
			const payload = await response.json();
			responseBody = JSON.stringify(payload, null, 2);
		} else {
			responseBody = await response.text();
		}

		return {
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			responseBody: responseBody.trim().slice(0, 1600) || null,
			triggeredAt
		};
	} catch (error) {
		return {
			ok: false,
			status: 0,
			statusText: 'Request failed',
			responseBody: error instanceof Error ? error.message : 'Unknown network error',
			triggeredAt
		};
	}
};
