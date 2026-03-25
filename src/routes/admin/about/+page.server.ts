import { db } from '$lib/server/db';
import { settings } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export async function load() {
	const row = await db.select().from(settings).where(eq(settings.key, 'about')).get();

	return {
		about: row?.value ?? ''
	};
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const value = formData.get('about');

		if (typeof value !== 'string') {
			return fail(400, { error: 'Invalid input' });
		}

		const trimmed = value.trim();

		await db
			.insert(settings)
			.values({ key: 'about', value: trimmed, updatedAt: new Date() })
			.onConflictDoUpdate({
				target: settings.key,
				set: { value: trimmed, updatedAt: new Date() }
			});

		return { success: true };
	}
};
