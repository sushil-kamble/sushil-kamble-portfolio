import { db } from '$lib/server/db';
import { careers } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allCareers = await db.select().from(careers).orderBy(asc(careers.ordering));
	return { careers: allCareers };
}

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(careers).where(eq(careers.id, id));
		return { success: true };
	}
};
