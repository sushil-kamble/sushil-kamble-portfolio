import { db } from '$lib/server/db';
import { careers } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load({ params }) {
	const id = Number(params.id);
	const career = await db.select().from(careers).where(eq(careers.id, id));

	if (!career.length) {
		error(404, 'Career not found');
	}

	return { career: career[0] };
}

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();

		const company = formData.get('company') as string;
		const designation = formData.get('designation') as string;
		const location = formData.get('location') as string;
		const start = formData.get('start') as string;
		const end = formData.get('end') as string;
		const details = formData.get('details') as string;
		const logo = formData.get('logo') as string;
		const link = formData.get('link') as string;
		const ordering = Number(formData.get('ordering') || 0);
		const skills = JSON.parse((formData.get('skills') as string) || '[]');
		const detailsList = JSON.parse((formData.get('detailsList') as string) || '[]');

		await db
			.update(careers)
			.set({
				company,
				designation: designation || '',
				location: location || '',
				start: start || '',
				end: end || '',
				details: details || '',
				logo: logo || '',
				link: link || '',
				ordering,
				skills,
				detailsList
			})
			.where(eq(careers.id, id));

		redirect(303, '/admin/careers');
	}
};
