import { db } from '$lib/server/db';
import { blogs } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load() {
	const allBlogs = await db.select().from(blogs).orderBy(asc(blogs.ordering));
	return { blogs: allBlogs };
}

export const actions: Actions = {
	reorder: async ({ request }) => {
		const formData = await request.formData();
		const orderRaw = formData.get('order');

		if (typeof orderRaw !== 'string') {
			return fail(400, { error: 'Invalid order data' });
		}

		let order: { id: number; ordering: number }[];
		try {
			order = JSON.parse(orderRaw);
		} catch {
			return fail(400, { error: 'Invalid order data' });
		}

		await Promise.all(
			order.map((item) =>
				db.update(blogs).set({ ordering: item.ordering }).where(eq(blogs.id, item.id))
			)
		);

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(blogs).where(eq(blogs.id, id));
		return { success: true };
	}
};
