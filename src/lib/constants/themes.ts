import type { ThemeDefinition, FontDefinition, ThemeId, FontId } from '$lib/types/editor';

// ── Theme definitions ──────────────────────────────────────────────

export const THEMES: ThemeDefinition[] = [
	{
		id: 'dark-default',
		label: 'Dark+ (Default)',
		description: 'The classic VS Code dark theme'
	},
	{
		id: 'light',
		label: 'Light+ (Default)',
		description: 'Clean light theme with bright accents'
	},
	{
		id: 'monokai',
		label: 'Monokai',
		description: 'Warm dark theme with vibrant colors'
	},
	{
		id: 'dracula',
		label: 'Dracula',
		description: 'Cool dark theme with purple accents'
	},
	{
		id: 'github-dark',
		label: 'GitHub Dark',
		description: 'Muted dark theme from GitHub'
	},
	{
		id: 'palenight',
		label: 'Palenight',
		description: 'Soft purple-tinted dark theme'
	},
	{
		id: 'catppuccin',
		label: 'Catppuccin Mocha',
		description: 'Warm pastel dark theme'
	},
	{
		id: 'synthwave',
		label: "Synthwave '84",
		description: 'Retro neon dark theme'
	}
];

// ── Font definitions ───────────────────────────────────────────────

export const FONTS: FontDefinition[] = [
	{
		id: 'jetbrains-mono',
		label: 'JetBrains Mono',
		fontFamily: "'JetBrains Mono', monospace"
	},
	{
		id: 'fira-code',
		label: 'Fira Code',
		fontFamily: "'Fira Code', monospace"
	},
	{
		id: 'cascadia-code',
		label: 'Cascadia Code',
		fontFamily: "'Cascadia Code', monospace"
	},
	{
		id: 'source-code-pro',
		label: 'Source Code Pro',
		fontFamily: "'Source Code Pro', monospace"
	},
	{
		id: 'ibm-plex-mono',
		label: 'IBM Plex Mono',
		fontFamily: "'IBM Plex Mono', monospace"
	}
];

// ── Defaults ───────────────────────────────────────────────────────

export const DEFAULT_THEME: ThemeId = 'dark-default';
export const DEFAULT_FONT: FontId = 'jetbrains-mono';

// ── LocalStorage keys ──────────────────────────────────────────────

export const LS_THEME_KEY = 'portfolio-theme';
export const LS_FONT_KEY = 'portfolio-font';
export const LS_HINT_DISMISSED = 'portfolio-hint-dismissed';
export const LS_SEARCH_HINT_DISMISSED = 'portfolio-search-hint-dismissed';
