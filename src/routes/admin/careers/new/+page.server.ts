import { db } from '$lib/server/db';
import { careers } from '$lib/server/schema';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export function load() {
	return {};
}

export const actions: Actions = {
	default: async ({ request }) => {
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

		await db.insert(careers).values({
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
		});

		redirect(303, '/admin/careers');
	}
};
