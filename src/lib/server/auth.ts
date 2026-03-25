import { SignJWT, jwtVerify } from 'jose';
import { ADMIN_PASSWORD } from '$env/static/private';

const secret = new TextEncoder().encode(ADMIN_PASSWORD);
const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '7d';

export async function createToken(): Promise<string> {
	return new SignJWT({ role: 'admin' })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(TOKEN_EXPIRY)
		.sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
	try {
		await jwtVerify(token, secret);
		return true;
	} catch {
		return false;
	}
}

export function getTokenCookie(token: string): string {
	const isProduction = process.env.NODE_ENV === 'production';
	return `${COOKIE_NAME}=${token}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict; Path=/admin; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearTokenCookie(): string {
	return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=0`;
}

export { COOKIE_NAME };
