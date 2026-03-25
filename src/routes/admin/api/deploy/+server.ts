import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ fetch }) => {
	const deployHookUrl = env.VERCEL_DEPLOY_HOOK_URL;

	if (!deployHookUrl) {
		throw error(503, 'Deploy hook URL not configured');
	}

	try {
		const response = await fetch(deployHookUrl, { method: 'POST' });
		return json({ ok: response.ok, status: response.status });
	} catch {
		throw error(502, 'Deploy hook request failed');
	}
};
