import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const data = await parent();
	const project = data.projects.find((p) => p.id === params.id);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return { project };
}
