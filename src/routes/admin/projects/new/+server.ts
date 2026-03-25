import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import type { RequestHandler } from './$types';

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const slug = slugify(data.title);

	await db.insert(projects).values({
		slug,
		title: data.title,
		description: data.description || '',
		stack: data.stack || [],
		features: data.features || [],
		screenshots: data.screenshots || [],
		github: data.github || '',
		direct: data.direct || '',
		ordering: Number(data.ordering) || 0
	});

	return json({ success: true });
};
