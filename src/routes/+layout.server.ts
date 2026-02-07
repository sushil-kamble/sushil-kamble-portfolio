import { fetchAllData } from '$lib/services/notion';
import type { PageData } from '$lib/types';

export const prerender = true;

export async function load(): Promise<PageData> {
	return await fetchAllData();
}
