import { db } from '$lib/server/db';
import { blogs } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const id = Number(params.id);
	const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));

	if (!blog) {
		throw error(404, 'Blog post not found');
	}

	return { blog };
}
