import type { Career, PageData } from '$lib/types';

export function calculateExperience(careers: Career[]): string {
	if (careers.length === 0) return '0 years';

	const starts = careers
		.map((c) => parseCareerDate(c.start))
		.filter((d): d is Date => d !== null);

	if (starts.length === 0) return '0 years';

	const earliest = new Date(Math.min(...starts.map((d) => d.getTime())));
	const now = new Date();
	const years = Math.floor((now.getTime() - earliest.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
	return `${years}+ years`;
}

export function projectCount(data: PageData): string {
	return `${data.projects.length} shipped`;
}

export function skillCount(data: PageData): string {
	const total = data.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
	return `${total} technologies`;
}

function parseCareerDate(dateStr: string): Date | null {
	if (!dateStr) return null;
	// Handle formats like "Jan 2020", "2020", "Present"
	if (dateStr.toLowerCase() === 'present') return new Date();
	const parsed = new Date(dateStr);
	return isNaN(parsed.getTime()) ? null : parsed;
}
