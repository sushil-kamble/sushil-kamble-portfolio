import { SvelteSet } from 'svelte/reactivity';
import type { FileEntry } from '$lib/types';
import type { ThemeId, FontId, PaletteMode } from '$lib/types/editor';
import {
	DEFAULT_THEME,
	DEFAULT_FONT,
	LS_THEME_KEY,
	LS_FONT_KEY,
	THEMES,
	FONTS
} from '$lib/constants/themes';
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
		name: 'career.ts',
		type: 'about',
		icon: 'user',
		language: 'TypeScript'
	},
	{
		id: 'projects',
		name: 'projects.md',
		type: 'projects',
		icon: 'folder-code',
		language: 'Markdown'
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
	expandedFolders = $state<Set<string>>(
		new SvelteSet(['sushilkamble-com', 'sushilkamble-com/projects', 'sushilkamble-com/posts'])
	);
	commandPaletteOpen = $state<boolean>(false);
	paletteMode = $state<PaletteMode>('files');
	settingsOpen = $state<boolean>(false);

	/** Theme & font */
	currentTheme = $state<ThemeId>(DEFAULT_THEME);
	currentFont = $state<FontId>(DEFAULT_FONT);

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

			// Restore persisted theme & font
			const savedTheme = localStorage.getItem(LS_THEME_KEY) as ThemeId | null;
			const savedFont = localStorage.getItem(LS_FONT_KEY) as FontId | null;
			if (savedTheme && THEMES.some((t) => t.id === savedTheme)) {
				this.currentTheme = savedTheme;
			}
			if (savedFont && FONTS.some((f) => f.id === savedFont)) {
				this.currentFont = savedFont;
			}
			// Apply immediately (inline script in app.html handles flash prevention)
			this.applyTheme(this.currentTheme);
			this.applyFont(this.currentFont);
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
		const wasMobile = this.isMobile;
		this.isMobile = window.innerWidth < 768;

		// Auto-close sidebar when crossing MD breakpoint to mobile
		if (!wasMobile && this.isMobile) {
			this.sidebarExpanded = false;
		}
		// Auto-open sidebar when crossing MD breakpoint to desktop
		else if (wasMobile && !this.isMobile) {
			this.sidebarExpanded = true;
		}
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

	toggleSettings() {
		this.settingsOpen = !this.settingsOpen;
	}

	toggleCommandPalette() {
		this.commandPaletteOpen = !this.commandPaletteOpen;
		if (this.commandPaletteOpen) {
			this.paletteMode = 'files';
		}
	}

	openThemePicker() {
		this.paletteMode = 'themes';
		this.commandPaletteOpen = true;
	}

	openFontPicker() {
		this.paletteMode = 'fonts';
		this.commandPaletteOpen = true;
	}

	setTheme(id: ThemeId) {
		this.currentTheme = id;
		this.applyTheme(id);
		if (typeof window !== 'undefined') {
			localStorage.setItem(LS_THEME_KEY, id);
		}
	}

	setFont(id: FontId) {
		this.currentFont = id;
		this.applyFont(id);
		if (typeof window !== 'undefined') {
			localStorage.setItem(LS_FONT_KEY, id);
		}
	}

	/** Apply data-theme attribute to <html> */
	private applyTheme(id: ThemeId) {
		const el = document.documentElement;
		if (id === DEFAULT_THEME) {
			el.removeAttribute('data-theme');
		} else {
			el.setAttribute('data-theme', id);
		}
	}

	/** Apply data-font attribute to <html> */
	private applyFont(id: FontId) {
		const el = document.documentElement;
		if (id === DEFAULT_FONT) {
			el.removeAttribute('data-font');
		} else {
			el.setAttribute('data-font', id);
		}
	}
}
