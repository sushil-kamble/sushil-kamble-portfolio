import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const data = await parent();
	const post = data.blogs.find((b) => b.id === params.id);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post };
}
