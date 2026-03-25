import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export const PUT: RequestHandler = async ({ params, request }) => {
	const id = Number(params.id);
	const data = await request.json();
	const slug = slugify(data.title);

	await db
		.update(projects)
		.set({
			slug,
			title: data.title,
			description: data.description || '',
			stack: data.stack || [],
			features: data.features || [],
			screenshots: data.screenshots || [],
			github: data.github || '',
			direct: data.direct || ''
		})
		.where(eq(projects.id, id));

	return json({ success: true });
};
