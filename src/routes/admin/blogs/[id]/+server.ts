import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blogs } from '$lib/server/schema';
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
		.update(blogs)
		.set({
			slug,
			title: data.title,
			description: data.description || '',
			tags: data.tags || [],
			content: data.content || '',
			blogUrl: data.blogUrl || '',
			githubUrl: data.githubUrl || '',
			liveUrl: data.liveUrl || '',
			ordering: Number(data.ordering) || 0
		})
		.where(eq(blogs.id, id));

	return json({ success: true });
};
