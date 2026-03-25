import { db } from './db';
import { settings, careers, skillCategories, projects, blogs } from './schema';
import { asc, eq } from 'drizzle-orm';
import type { Career, Project, Skill, Blog, PageData } from '$lib/types';

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function safeSlug(primary: string, fallback: string): string {
	return slugify(primary) || slugify(fallback) || fallback;
}

export async function fetchAboutMe(): Promise<string> {
	const result = await db.select().from(settings).where(eq(settings.key, 'about')).limit(1);
	return result[0]?.value ?? '';
}

export async function fetchCareers(): Promise<Career[]> {
	const rows = await db.select().from(careers).orderBy(asc(careers.ordering));
	return rows.map((row) => ({
		id: String(row.id),
		company: row.company,
		start: row.start,
		end: row.end,
		location: row.location,
		designation: row.designation,
		link: row.link,
		logo: row.logo,
		details: row.details,
		skills: row.skills as string[],
		detailsList: row.detailsList as string[]
	}));
}

export async function fetchSkills(): Promise<Skill[]> {
	const rows = await db.select().from(skillCategories).orderBy(asc(skillCategories.ordering));
	return rows.map((row) => ({
		id: String(row.id),
		title: row.title,
		skills: row.skills as string[]
	}));
}

export async function fetchProjects(): Promise<Project[]> {
	const rows = await db.select().from(projects).orderBy(asc(projects.ordering));
	return rows.map((row) => ({
		id: String(row.id),
		slug: row.slug || safeSlug(row.title, String(row.id)),
		title: row.title,
		stack: row.stack as string[],
		features: row.features as string[],
		screenshots: row.screenshots as string[],
		direct: row.direct,
		github: row.github,
		description: row.description
	}));
}

export async function fetchBlogs(): Promise<Blog[]> {
	const rows = await db.select().from(blogs).orderBy(asc(blogs.ordering));
	return rows.map((row) => ({
		id: String(row.id),
		slug: row.slug || safeSlug(row.title, String(row.id)),
		title: row.title,
		description: row.description,
		tags: row.tags as string[],
		blog: row.blogUrl,
		github: row.githubUrl,
		live: row.liveUrl,
		content: row.content,
		createdAt: row.createdAt
	}));
}

export async function fetchAllData(): Promise<PageData> {
	const [about_me, c, sk, p, b] = await Promise.all([
		fetchAboutMe(),
		fetchCareers(),
		fetchSkills(),
		fetchProjects(),
		fetchBlogs()
	]);
	return { about_me, careers: c, skills: sk, projects: p, blogs: b };
}
