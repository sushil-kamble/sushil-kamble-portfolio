import { error } from '@sveltejs/kit';
import { fetchBlogs } from '$lib/services/notion';

export async function entries() {
	const blogs = await fetchBlogs();
	return blogs.map((b) => ({ id: b.id }));
}

export async function load({ params, parent }) {
	const data = await parent();
	const post = data.blogs.find((b) => b.id === params.id);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post };
}
