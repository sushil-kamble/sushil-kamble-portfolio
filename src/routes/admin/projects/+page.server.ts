import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allProjects = await db.select().from(projects).orderBy(asc(projects.ordering));
	return { projects: allProjects };
}

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(projects).where(eq(projects.id, id));
		return { success: true };
	}
};
