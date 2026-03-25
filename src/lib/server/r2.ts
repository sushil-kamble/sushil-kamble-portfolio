import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

interface R2Config {
	accountId: string;
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
	publicUrl: string;
}

function requireEnv(name: string): string {
	const value = env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

let configCache: R2Config | null = null;
let s3Client: S3Client | null = null;

function getConfig(): R2Config {
	if (!configCache) {
		configCache = {
			accountId: requireEnv('R2_ACCOUNT_ID'),
			accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
			secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
			bucketName: requireEnv('R2_BUCKET_NAME'),
			publicUrl: requireEnv('R2_PUBLIC_URL')
		};
	}

	return configCache;
}

function getS3Client(): S3Client {
	if (!s3Client) {
		const config = getConfig();
		s3Client = new S3Client({
			region: 'auto',
			endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId: config.accessKeyId,
				secretAccessKey: config.secretAccessKey
			}
		});
	}

	return s3Client;
}

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
	const config = getConfig();
	const buffer = Buffer.from(await file.arrayBuffer());
	const sanitized = sanitizeFilename(file.name);
	const key = `${path}/${sanitized}`;

	await getS3Client().send(
		new PutObjectCommand({
			Bucket: config.bucketName,
			Key: key,
			Body: buffer,
			ContentType: file.type
		})
	);

	return {
		url: `${config.publicUrl}/${key}`,
		key
	};
}
