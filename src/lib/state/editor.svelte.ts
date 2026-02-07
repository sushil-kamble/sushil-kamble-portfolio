import type { FileEntry } from '$lib/types';

export class EditorState {
	openTabs = $state<FileEntry[]>([]);
	activeTabId = $state<string | null>(null);
	sidebarExpanded = $state(true);
	expandedFolders = $state<Set<string>>(new Set(['portfolio', 'projects', 'posts']));
	commandPaletteOpen = $state(false);

	activeTab = $derived(this.openTabs.find((t) => t.id === this.activeTabId) ?? null);

	constructor(initialFile?: FileEntry) {
		if (initialFile) {
			this.openTabs = [initialFile];
			this.activeTabId = initialFile.id;
		}
	}

	openFile(entry: FileEntry) {
		if (!this.openTabs.some((t) => t.id === entry.id)) {
			this.openTabs = [...this.openTabs, entry];
		}
		this.activeTabId = entry.id;
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
		const next = new Set(this.expandedFolders);
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
