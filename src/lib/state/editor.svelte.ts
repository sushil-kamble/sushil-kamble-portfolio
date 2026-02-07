import { SvelteSet } from 'svelte/reactivity';
import type { FileEntry } from '$lib/types';

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
	activeTabId = $state<string>('readme');
	sidebarExpanded = $state<boolean>(true);
	expandedFolders = $state<Set<string>>(new SvelteSet(['portfolio', 'projects', 'posts']));
	commandPaletteOpen = $state<boolean>(false);

	/** Currently selected project ID (shown inside the Projects tab) */
	selectedProjectId = $state<string | null>(null);
	/** Currently selected post ID (shown inside the Posts tab) */
	selectedPostId = $state<string | null>(null);

	activeTab = $derived(this.openTabs.find((t) => t.id === this.activeTabId) ?? null);

	/** True when viewport is below md breakpoint (768px) */
	isMobile = $state<boolean>(false);

	constructor() {
		if (typeof window !== 'undefined') {
			this.isMobile = window.innerWidth < 768;
			this.sidebarExpanded = !this.isMobile;
		}
	}

	/** Navigate to a specific fixed tab */
	setActive(id: string) {
		this.activeTabId = id;
		// Auto-close sidebar on mobile
		if (this.isMobile) {
			this.sidebarExpanded = false;
		}
	}

	/** Navigate to the Projects tab and show a specific project's detail */
	navigateToProject(projectId: string) {
		this.selectedProjectId = projectId;
		this.activeTabId = 'projects';
		if (this.isMobile) {
			this.sidebarExpanded = false;
		}
	}

	/** Navigate to the Posts tab and show a specific post's detail */
	navigateToPost(postId: string) {
		this.selectedPostId = postId;
		this.activeTabId = 'posts';
		if (this.isMobile) {
			this.sidebarExpanded = false;
		}
	}

	/** Show the projects list (clear selected project) */
	showProjectsList() {
		this.selectedProjectId = null;
		this.activeTabId = 'projects';
	}

	/** Show the posts list (clear selected post) */
	showPostsList() {
		this.selectedPostId = null;
		this.activeTabId = 'posts';
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

	cycleTab(direction: 1 | -1 = 1) {
		if (this.openTabs.length < 2) return;
		const idx = this.openTabs.findIndex((t) => t.id === this.activeTabId);
		const next = (idx + direction + this.openTabs.length) % this.openTabs.length;
		this.activeTabId = this.openTabs[next].id;
	}
}
