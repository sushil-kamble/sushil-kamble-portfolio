import { useAxios } from './axios';
import type { Career, Project, Skill, Blog, PageData } from '$lib/types';

// Notion resource IDs
const ABOUT_ME_BLOCK = 'bf58048fe08343169150555224cf344d';
const CAREERS_DB = '94c276962ca049e48cc291faf624b5e1';
const SKILLS_DB = '1da77e9a57504380adb46b899fc54551';
const PROJECTS_DB = '0c5b1a1234f4404b89bf0b71b9a06bd7';
const BLOGS_DB = '106fce9b3e304e28a7c38c1856e27501';

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

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export async function fetchAboutMe(): Promise<string> {
	const api = useAxios();
	const res = await api.get(`/blocks/${ABOUT_ME_BLOCK}/children`);
	return res.data.results?.[0]?.paragraph?.rich_text?.[0]?.plain_text || '';
}

export async function fetchCareers(): Promise<Career[]> {
	const api = useAxios();
	const res = await api.post(`/databases/${CAREERS_DB}/query`, {
		sorts: [{ property: 'ID', direction: 'ascending' }]
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return res.data.results.map((item: any) => ({
		id: item.id,
		company: titleText(item, 'company'),
		start: richText(item, 'start'),
		end: richText(item, 'end'),
		location: richText(item, 'location'),
		designation: richText(item, 'designation'),
		link: richText(item, 'link'),
		logo: richText(item, 'logo'),
		details: richText(item, 'details'),
		skills: multiSelect(item, 'skills'),
		detailsList: multiSelect(item, 'details-list')
	}));
}

export async function fetchSkills(): Promise<Skill[]> {
	const api = useAxios();
	const res = await api.post(`/databases/${SKILLS_DB}/query`, {
		sorts: [{ property: 'id', direction: 'ascending' }]
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return res.data.results.map((item: any) => ({
		id: item.id,
		title: titleText(item, 'title'),
		skills: multiSelect(item, 'skills')
	}));
}

export async function fetchProjects(): Promise<Project[]> {
	const api = useAxios();
	const res = await api.post(`/databases/${PROJECTS_DB}/query`, {
		sorts: [{ property: 'ordering', direction: 'ascending' }]
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return res.data.results.map((item: any) => {
		const title = titleText(item, 'title');
		return {
			id: item.id,
			slug: slugify(title),
			title,
			stack: multiSelect(item, 'stack'),
			features: multiSelect(item, 'features'),
			screenshots: multiSelect(item, 'screenshots'),
			direct: urlProp(item, 'direct'),
			github: urlProp(item, 'github'),
			description: richText(item, 'description')
		};
	});
}

export async function fetchBlogs(): Promise<Blog[]> {
	const api = useAxios();
	const res = await api.post(`/databases/${BLOGS_DB}/query`, {
		sorts: [{ property: 'ordering', direction: 'ascending' }]
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return res.data.results.map((item: any) => {
		const title = titleText(item, 'title');
		return {
			id: item.id,
			slug: slugify(title),
			title,
			description: richText(item, 'description'),
			tags: multiSelect(item, 'tags'),
			blog: urlProp(item, 'blog'),
			github: urlProp(item, 'github'),
			live: urlProp(item, 'live')
		};
	});
}

export async function fetchAllData(): Promise<PageData> {
	const [about_me, careers, skills, projects, blogs] = await Promise.all([
		fetchAboutMe(),
		fetchCareers(),
		fetchSkills(),
		fetchProjects(),
		fetchBlogs()
	]);
	return { about_me, careers, skills, projects, blogs };
}
