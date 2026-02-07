// ── Platform detection & keyboard shortcut formatting ─────────────

import { browser } from '$app/environment';

export function isMac(): boolean {
	if (!browser) return true; // SSR default
	return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

export function modKey(): string {
	return isMac() ? '⌘' : 'Ctrl';
}

export interface ShortcutDef {
	mod: boolean;
	key: string;
}

/**
 * Formats a shortcut definition into a display string.
 * Mac: `⌘K`  Windows/Linux: `Ctrl+K`
 */
export function formatShortcut(def: ShortcutDef): string {
	if (!def.mod) return def.key;
	return isMac() ? `${modKey()}${def.key}` : `${modKey()}+${def.key}`;
}

// ── Single source of truth for all app shortcuts ──────────────────

export const SHORTCUTS = {
	COMMAND_PALETTE: { mod: true, key: 'K' } satisfies ShortcutDef,
	TOGGLE_SIDEBAR: { mod: true, key: 'B' } satisfies ShortcutDef,
	SETTINGS: { mod: true, key: ',' } satisfies ShortcutDef
} as const;
