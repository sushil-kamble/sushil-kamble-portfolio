import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const id = Number(params.id);
	const [project] = await db.select().from(projects).where(eq(projects.id, id));

	if (!project) {
		throw error(404, 'Project not found');
	}

	return { project };
}
