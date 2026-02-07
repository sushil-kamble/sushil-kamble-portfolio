import { SvelteSet } from 'svelte/reactivity';
import type { FileEntry } from '$lib/types';
import { pathToTabId, TAB_HREFS } from '$lib/utils/navigation';

/** The 5 fixed tabs that are always open and cannot be closed */
export const FIXED_TABS: FileEntry[] = [
	{
		id: 'readme',
		name: 'README.md',
		type: 'readme',
		icon: 'file-text',
		language: 'Markdown'
	},
	{
		id: 'about',
		name: 'about_me.ts',
		type: 'about',
		icon: 'user',
		language: 'TypeScript'
	},
	{
		id: 'projects',
		name: 'projects.ts',
		type: 'projects',
		icon: 'folder-code',
		language: 'TypeScript'
	},
	{
		id: 'posts',
		name: 'posts.md',
		type: 'posts',
		icon: 'newspaper',
		language: 'Markdown'
	},
	{
		id: 'contact',
		name: 'contact.tsx',
		type: 'contact',
		icon: 'mail',
		language: 'TSX'
	}
];

export class EditorState {
	openTabs = $state<FileEntry[]>(FIXED_TABS);
	sidebarExpanded = $state<boolean>(true);
	expandedFolders = $state<Set<string>>(new SvelteSet(['portfolio', 'projects', 'posts']));
	commandPaletteOpen = $state<boolean>(false);

	/** Current pathname, synced from the layout via $app/state */
	pathname = $state<string>('/');

	/** Derived active tab ID from URL */
	activeTabId = $derived(pathToTabId(this.pathname));
	activeTab = $derived(this.openTabs.find((t) => t.id === this.activeTabId) ?? null);

	/** True when viewport is below md breakpoint (768px) */
	isMobile = $state<boolean>(false);

	constructor() {
		if (typeof window !== 'undefined') {
			this.isMobile = window.innerWidth < 768;
			this.sidebarExpanded = !this.isMobile;
		}
	}

	/** Called by layout to sync URL into state */
	updatePathname(p: string) {
		this.pathname = p;
	}

	/** Returns the href for the next/previous tab (for Ctrl+Tab cycling) */
	getNextTabHref(direction: 1 | -1 = 1): string {
		if (this.openTabs.length < 2) return '/';
		const idx = this.openTabs.findIndex((t) => t.id === this.activeTabId);
		const next = (idx + direction + this.openTabs.length) % this.openTabs.length;
		const nextTab = this.openTabs[next];
		return TAB_HREFS[nextTab.id as keyof typeof TAB_HREFS] ?? '/';
	}

	handleResize() {
		this.isMobile = window.innerWidth < 768;
	}

	toggleFolder(path: string) {
		const next = new SvelteSet(this.expandedFolders);
		if (next.has(path)) {
			next.delete(path);
		} else {
			next.add(path);
		}
		this.expandedFolders = next;
	}

	toggleSidebar() {
		this.sidebarExpanded = !this.sidebarExpanded;
	}

	toggleCommandPalette() {
		this.commandPaletteOpen = !this.commandPaletteOpen;
	}
}
