import { db } from '$lib/server/db';
import { skillCategories } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export async function load() {
	const categories = await db.select().from(skillCategories).orderBy(asc(skillCategories.ordering));

	return { categories };
}

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title');

		if (typeof title !== 'string' || !title.trim()) {
			return fail(400, { error: 'Title is required' });
		}

		const maxOrder = await db
			.select({ ordering: skillCategories.ordering })
			.from(skillCategories)
			.orderBy(asc(skillCategories.ordering))
			.all();

		const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map((r) => r.ordering)) + 1 : 0;

		await db.insert(skillCategories).values({
			title: title.trim(),
			skills: [],
			ordering: nextOrder
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const title = formData.get('title');
		const skillsRaw = formData.get('skills');

		if (!id || typeof title !== 'string' || !title.trim()) {
			return fail(400, { error: 'Invalid input' });
		}

		let skills: string[] = [];
		if (typeof skillsRaw === 'string' && skillsRaw.trim()) {
			try {
				skills = JSON.parse(skillsRaw);
			} catch {
				return fail(400, { error: 'Invalid skills data' });
			}
		}

		await db
			.update(skillCategories)
			.set({ title: title.trim(), skills })
			.where(eq(skillCategories.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) {
			return fail(400, { error: 'Invalid id' });
		}

		await db.delete(skillCategories).where(eq(skillCategories.id, id));

		return { success: true };
	},

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
				db
					.update(skillCategories)
					.set({ ordering: item.ordering })
					.where(eq(skillCategories.id, item.id))
			)
		);

		return { success: true };
	}
};
