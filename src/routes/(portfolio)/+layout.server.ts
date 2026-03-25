import { fetchAllData } from '$lib/server/data';
import type { PageData } from '$lib/types';

export const prerender = true;

export async function load(): Promise<PageData> {
	return await fetchAllData();
}
