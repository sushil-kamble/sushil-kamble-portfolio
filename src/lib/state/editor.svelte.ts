import { SvelteSet } from 'svelte/reactivity';
import type { FileEntry } from '$lib/types';

export class EditorState {
	openTabs = $state<FileEntry[]>([]);
	activeTabId = $state<string | null>(null);
	sidebarExpanded = $state<boolean>(true);
	expandedFolders = $state<Set<string>>(new SvelteSet(['portfolio', 'projects', 'posts']));
	commandPaletteOpen = $state<boolean>(false);

	activeTab = $derived(this.openTabs.find((t) => t.id === this.activeTabId) ?? null);

	/** True when viewport is below md breakpoint (768px) */
	isMobile = $state<boolean>(false);

	constructor(initialFile?: FileEntry) {
		if (initialFile) {
			this.openTabs = [initialFile];
			this.activeTabId = initialFile.id;
		}
		if (typeof window !== 'undefined') {
			this.isMobile = window.innerWidth < 768;
			this.sidebarExpanded = !this.isMobile;
		}
	}

	openFile(entry: FileEntry) {
		if (!this.openTabs.some((t) => t.id === entry.id)) {
			this.openTabs = [...this.openTabs, entry];
		}
		this.activeTabId = entry.id;

		// Auto-close sidebar on mobile after selecting a file
		if (this.isMobile) {
			this.sidebarExpanded = false;
		}
	}

	handleResize() {
		this.isMobile = window.innerWidth < 768;
	}

	closeTab(id: string) {
		const idx = this.openTabs.findIndex((t) => t.id === id);
		this.openTabs = this.openTabs.filter((t) => t.id !== id);

		if (this.activeTabId === id) {
			const next = this.openTabs[Math.min(idx, this.openTabs.length - 1)];
			this.activeTabId = next?.id ?? null;
		}
	}

	setActive(id: string) {
		this.activeTabId = id;
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
