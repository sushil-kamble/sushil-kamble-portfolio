import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
	R2_ACCOUNT_ID,
	R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	R2_BUCKET_NAME,
	R2_PUBLIC_URL
} from '$env/static/private';

const s3 = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

function sanitizeFilename(name: string): string {
	const ext = name.substring(name.lastIndexOf('.'));
	const base = name
		.substring(0, name.lastIndexOf('.'))
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
	const timestamp = Date.now().toString(36);
	return `${base}-${timestamp}${ext}`;
}

export async function uploadFile(file: File, path: string): Promise<{ url: string; key: string }> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const sanitized = sanitizeFilename(file.name);
	const key = `${path}/${sanitized}`;

	await s3.send(
		new PutObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: file.type
		})
	);

	return {
		url: `${R2_PUBLIC_URL}/${key}`,
		key
	};
}
