import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { min } from 'drizzle-orm';
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

	const [{ minOrdering }] = await db.select({ minOrdering: min(projects.ordering) }).from(projects);
	const ordering = (minOrdering ?? 1) - 1;

	await db.insert(projects).values({
		slug,
		title: data.title,
		description: data.description || '',
		stack: data.stack || [],
		features: data.features || [],
		screenshots: data.screenshots || [],
		github: data.github || '',
		direct: data.direct || '',
		ordering
	});

	return json({ success: true });
};
