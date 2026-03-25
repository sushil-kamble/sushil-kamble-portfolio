/**
 * Normalize ordering: reassign sequential 1, 2, 3, ... values to blogs, projects, and careers
 * based on their current sort order.
 *
 * Usage: npx tsx scripts/normalize-ordering.ts
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { asc, eq } from 'drizzle-orm';
import * as schema from '../src/lib/server/schema';

async function normalizeOrdering() {
	console.log('Connecting to Turso...');

	const client = createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!
	});

	const db = drizzle(client, { schema });

	// Normalize blogs
	console.log('\nNormalizing blogs...');
	const allBlogs = await db.select().from(schema.blogs).orderBy(asc(schema.blogs.ordering));
	for (const [index, blog] of allBlogs.entries()) {
		const newOrdering = index + 1;
		await db
			.update(schema.blogs)
			.set({ ordering: newOrdering })
			.where(eq(schema.blogs.id, blog.id));
		console.log(`  [${newOrdering}] ${blog.title} (was ${blog.ordering})`);
	}

	// Normalize projects
	console.log('\nNormalizing projects...');
	const allProjects = await db
		.select()
		.from(schema.projects)
		.orderBy(asc(schema.projects.ordering));
	for (const [index, project] of allProjects.entries()) {
		const newOrdering = index + 1;
		await db
			.update(schema.projects)
			.set({ ordering: newOrdering })
			.where(eq(schema.projects.id, project.id));
		console.log(`  [${newOrdering}] ${project.title} (was ${project.ordering})`);
	}

	// Normalize careers
	console.log('\nNormalizing careers...');
	const allCareers = await db
		.select()
		.from(schema.careers)
		.orderBy(asc(schema.careers.ordering));
	for (const [index, career] of allCareers.entries()) {
		const newOrdering = index + 1;
		await db
			.update(schema.careers)
			.set({ ordering: newOrdering })
			.where(eq(schema.careers.id, career.id));
		console.log(`  [${newOrdering}] ${career.company} (was ${career.ordering})`);
	}

	console.log('\nDone! Ordering is now sequential starting from 1.');
	process.exit(0);
}

normalizeOrdering().catch((err) => {
	console.error('Normalize failed:', err);
	process.exit(1);
});
