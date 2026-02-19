import { error } from '@sveltejs/kit';
import { fetchProjects } from '$lib/services/notion';

export async function entries() {
	const projects = await fetchProjects();
	return projects
		.filter((project) => Boolean(project.slug))
		.map((project) => ({ slug: project.slug }));
}

export async function load({ params, parent }) {
	const data = await parent();
	const project = data.projects.find((p) => p.slug === params.slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return { project };
}
