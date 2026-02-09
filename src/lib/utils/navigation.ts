import type { FileEntry, FixedTabType } from '$lib/types';

/** Maps each fixed tab ID to its URL path */
export const TAB_HREFS: Record<FixedTabType, string> = {
	readme: '/',
	career: '/career',
	projects: '/projects',
	posts: '/posts',
	contact: '/contact'
};

/** Derives the active tab ID from a URL pathname */
export function pathToTabId(pathname: string): string {
	if (pathname === '/') return 'readme';
	const segment = pathname.split('/')[1];
	if (segment === 'career') return 'career';
	if (segment === 'projects') return 'projects';
	if (segment === 'posts') return 'posts';
	if (segment === 'contact') return 'contact';
	return 'readme';
}

/** Computes the href for any FileEntry */
export function fileEntryHref(entry: FileEntry): string {
	if (entry.type === 'project' && entry.dataId) return `/projects/${entry.dataId}`;
	if (entry.type === 'post' && entry.dataId) return `/posts/${entry.dataId}`;
	const tabId = entry.type as string;
	if (tabId in TAB_HREFS) return TAB_HREFS[tabId as FixedTabType];
	return '/';
}
