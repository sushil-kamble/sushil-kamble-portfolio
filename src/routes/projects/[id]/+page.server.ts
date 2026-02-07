import { error } from '@sveltejs/kit';
import { fetchProjects } from '$lib/services/notion';

export async function entries() {
	const projects = await fetchProjects();
	return projects.map((p) => ({ id: p.id }));
}

export async function load({ params, parent }) {
	const data = await parent();
	const project = data.projects.find((p) => p.id === params.id);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return { project };
}
