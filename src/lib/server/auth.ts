import { SignJWT, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

function requireAdminPassword(): string {
	const password = env.ADMIN_PASSWORD;
	if (!password) {
		throw new Error('Missing required environment variable: ADMIN_PASSWORD');
	}
	return password;
}

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '7d';

function getSecret(): Uint8Array {
	return new TextEncoder().encode(requireAdminPassword());
}

export function getAdminPassword(): string {
	return requireAdminPassword();
}

export function getAuthCookieOptions(): Parameters<Cookies['set']>[2] {
	return {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		path: '/admin',
		maxAge: 7 * 24 * 60 * 60
	};
}

export async function createToken(): Promise<string> {
	return new SignJWT({ role: 'admin' })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(TOKEN_EXPIRY)
		.sign(getSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
	try {
		await jwtVerify(token, getSecret());
		return true;
	} catch {
		return false;
	}
}

export { COOKIE_NAME };
