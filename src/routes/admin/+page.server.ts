import { db } from '$lib/server/db';
import { careers, skillCategories, projects, blogs } from '$lib/server/schema';
import { count } from 'drizzle-orm';

export async function load() {
	const [careerCount, skillCount, projectCount, blogCount] = await Promise.all([
		db.select({ count: count() }).from(careers),
		db.select({ count: count() }).from(skillCategories),
		db.select({ count: count() }).from(projects),
		db.select({ count: count() }).from(blogs)
	]);

	return {
		counts: {
			careers: careerCount[0].count,
			skills: skillCount[0].count,
			projects: projectCount[0].count,
			blogs: blogCount[0].count
		}
	};
}
