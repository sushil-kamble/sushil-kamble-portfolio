import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load() {
	const allProjects = await db.select().from(projects).orderBy(asc(projects.ordering));
	return { projects: allProjects };
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
				db.update(projects).set({ ordering: item.ordering }).where(eq(projects.id, item.id))
			)
		);

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(projects).where(eq(projects.id, id));
		return { success: true };
	}
};
