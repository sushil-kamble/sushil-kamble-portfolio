/**
 * Seed script: Migrate data from Notion to Turso.
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires NOTION_TOKEN, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN in .env
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/lib/server/schema';

// ── Notion helpers ──

const NOTION_TOKEN = process.env.INTEGRATION_TOKEN || process.env.NOTION_TOKEN;
const NOTION_BASE = 'https://api.notion.com/v1';

const ABOUT_ME_BLOCK = 'bf58048fe08343169150555224cf344d';
const CAREERS_DB = '94c276962ca049e48cc291faf624b5e1';
const SKILLS_DB = '1da77e9a57504380adb46b899fc54551';
const PROJECTS_DB = '0c5b1a1234f4404b89bf0b71b9a06bd7';
const BLOGS_DB = '106fce9b3e304e28a7c38c1856e27501';

async function notionGet(path: string) {
	const res = await fetch(`${NOTION_BASE}${path}`, {
		headers: {
			Authorization: `Bearer ${NOTION_TOKEN}`,
			'Notion-Version': '2022-06-28'
		}
	});
	return res.json();
}

async function notionPost(path: string, body: object) {
	const res = await fetch(`${NOTION_BASE}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${NOTION_TOKEN}`,
			'Notion-Version': '2022-06-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const richText = (item: any, field: string): string =>
	item.properties[field]?.rich_text?.map((r: { plain_text: string }) => r.plain_text).join('') ||
	'';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const multiSelect = (item: any, field: string): string[] =>
	item.properties[field]?.multi_select?.map((i: { name: string }) => i.name) || [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titleText = (item: any, field: string): string =>
	item.properties[field]?.title?.[0]?.plain_text || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const urlProp = (item: any, field: string): string => item.properties[field]?.url || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const numberProp = (item: any, field: string): number => item.properties[field]?.number ?? 0;

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function safeSlug(primary: string, fallback: string): string {
	return slugify(primary) || slugify(fallback) || fallback;
}

// ── Main seed function ──

async function seed() {
	console.log('Connecting to Turso...');

	const client = createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!
	});

	const db = drizzle(client, { schema });

	// 1. About
	console.log('Fetching About...');
	const aboutRes = await notionGet(`/blocks/${ABOUT_ME_BLOCK}/children`);
	const aboutText = aboutRes.results?.[0]?.paragraph?.rich_text?.[0]?.plain_text || '';

	await db
		.insert(schema.settings)
		.values({ key: 'about', value: aboutText, updatedAt: new Date() })
		.onConflictDoUpdate({
			target: schema.settings.key,
			set: { value: aboutText, updatedAt: new Date() }
		});
	console.log(`  -> About: "${aboutText.substring(0, 50)}..."`);

	// 2. Careers
	console.log('Fetching Careers...');
	const careersRes = await notionPost(`/databases/${CAREERS_DB}/query`, {
		sorts: [{ property: 'ID', direction: 'ascending' }]
	});

	for (const item of careersRes.results) {
		const career = {
			company: titleText(item, 'company'),
			designation: richText(item, 'designation'),
			details: richText(item, 'details'),
			detailsList: multiSelect(item, 'details-list'),
			logo: richText(item, 'logo'),
			link: richText(item, 'link'),
			location: richText(item, 'location'),
			start: richText(item, 'start'),
			end: richText(item, 'end'),
			skills: multiSelect(item, 'skills'),
			ordering: numberProp(item, 'ID')
		};
		await db.insert(schema.careers).values(career);
		console.log(`  -> Career: ${career.company} (${career.designation})`);
	}

	// 3. Skills
	console.log('Fetching Skills...');
	const skillsRes = await notionPost(`/databases/${SKILLS_DB}/query`, {
		sorts: [{ property: 'id', direction: 'ascending' }]
	});

	for (const item of skillsRes.results) {
		const skill = {
			title: titleText(item, 'title'),
			skills: multiSelect(item, 'skills'),
			ordering: numberProp(item, 'id')
		};
		await db.insert(schema.skillCategories).values(skill);
		console.log(`  -> Skill Category: ${skill.title} (${skill.skills.length} skills)`);
	}

	// 4. Projects
	console.log('Fetching Projects...');
	const projectsRes = await notionPost(`/databases/${PROJECTS_DB}/query`, {
		sorts: [{ property: 'ordering', direction: 'ascending' }]
	});

	for (const [index, item] of projectsRes.results.entries()) {
		const title = titleText(item, 'title');
		const project = {
			slug: safeSlug(title, item.id),
			title,
			description: richText(item, 'description'),
			stack: multiSelect(item, 'stack'),
			features: multiSelect(item, 'features'),
			screenshots: multiSelect(item, 'screenshots'),
			github: urlProp(item, 'github'),
			direct: urlProp(item, 'direct'),
			ordering: index + 1
		};
		await db.insert(schema.projects).values(project);
		console.log(`  -> Project: ${project.title} (${project.slug})`);
	}

	// 5. Blogs
	console.log('Fetching Blogs...');
	const blogsRes = await notionPost(`/databases/${BLOGS_DB}/query`, {
		sorts: [{ property: 'ordering', direction: 'ascending' }]
	});

	for (const [index, item] of blogsRes.results.entries()) {
		const title = titleText(item, 'title');
		const blog = {
			slug: safeSlug(title, item.id),
			title,
			description: richText(item, 'description'),
			tags: multiSelect(item, 'tags'),
			content: '',
			blogUrl: urlProp(item, 'blog'),
			githubUrl: urlProp(item, 'github'),
			liveUrl: urlProp(item, 'live'),
			ordering: index + 1,
			createdAt: item.created_time
		};
		await db.insert(schema.blogs).values(blog);
		console.log(`  -> Blog: ${blog.title} (${blog.slug})`);
	}

	console.log('\nSeed complete!');
	process.exit(0);
}

seed().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
