import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

const FALLBACK_DEPLOY_HOOK_URL =
	'https://api.vercel.com/v1/integrations/deploy/prj_mO2VHYOkw3YSklG59fGqINJB3GVu/Et0611BKac';

export const prerender = false;

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store, max-age=0',
		'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex'
	});

	const deployHookUrl = env.VERCEL_DEPLOY_HOOK_URL || FALLBACK_DEPLOY_HOOK_URL;
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
