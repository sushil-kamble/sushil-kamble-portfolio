import { db } from '$lib/server/db';
import { blogs } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allBlogs = await db.select().from(blogs).orderBy(asc(blogs.ordering));
	return { blogs: allBlogs };
}

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(blogs).where(eq(blogs.id, id));
		return { success: true };
	}
};
