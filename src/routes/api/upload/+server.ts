import { json, error } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';
import { uploadFile } from '$lib/server/r2';

export async function POST({ request, cookies }) {
	const token = cookies.get(COOKIE_NAME);
	if (!token || !(await verifyToken(token))) {
		throw error(401, 'Unauthorized');
	}

	const formData = await request.formData();
	const file = formData.get('file') as File;
	const path = (formData.get('path') as string) || 'uploads';

	if (!file || !(file instanceof File)) {
		throw error(400, 'No file provided');
	}

	const maxSize = 10 * 1024 * 1024; // 10MB
	if (file.size > maxSize) {
		throw error(400, 'File too large (max 10MB)');
	}

	const result = await uploadFile(file, path);
	return json(result);
}
