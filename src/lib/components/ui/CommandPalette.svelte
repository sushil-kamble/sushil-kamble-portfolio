<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		Search,
		FileText,
		Braces,
		User,
		Mail,
		FolderCode,
		Palette,
		Type,
		Check
	} from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import { THEMES, FONTS, DEFAULT_THEME, DEFAULT_FONT } from '$lib/constants/themes';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { FileEntry } from '$lib/types';
	import type { ThemeId, FontId, PaletteCommand } from '$lib/types/editor';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const files = getContext<FileEntry[]>(CONTEXT_KEYS.FILE_REGISTRY);

	let query = $state('');
	let selectedIndex = $state(0);
	let inputEl: HTMLInputElement | undefined = $state();

	/** Stash the original theme/font so we can revert on Escape */
	let previewTheme: ThemeId | null = $state(null);
	let previewFont: FontId | null = $state(null);

	// ── Commands available via ">" prefix ──

	const commands: PaletteCommand[] = [
		{
			id: 'change-theme',
			label: 'Preferences: Color Theme',
			description: 'Change the color theme of the editor',
			action: () => {
				editor.paletteMode = 'themes';
				query = '';
				selectedIndex = 0;
			}
		},
		{
			id: 'change-font',
			label: 'Preferences: Font Family',
			description: 'Change the editor font family',
			action: () => {
				editor.paletteMode = 'fonts';
				query = '';
				selectedIndex = 0;
			}
		}
	];

	// ── Derived filtered lists ──

	const filteredFiles = $derived(
		query.trim()
			? files.filter(
					(f) =>
						f.name.toLowerCase().includes(query.toLowerCase()) ||
						(f.folder?.toLowerCase().includes(query.toLowerCase()) ?? false)
				)
			: files
	);

	const commandQuery = $derived(query.startsWith('>') ? query.slice(1).trim().toLowerCase() : '');

	const filteredCommands = $derived(
		commandQuery ? commands.filter((c) => c.label.toLowerCase().includes(commandQuery)) : commands
	);

	const filteredThemes = $derived(
		query.trim()
			? THEMES.filter(
					(t) =>
						t.label.toLowerCase().includes(query.toLowerCase()) ||
						t.description.toLowerCase().includes(query.toLowerCase())
				)
			: THEMES
	);

	const filteredFonts = $derived(
		query.trim() ? FONTS.filter((f) => f.label.toLowerCase().includes(query.toLowerCase())) : FONTS
	);

	/** The number of items in the current list */
	const listLength = $derived(
		editor.paletteMode === 'themes'
			? filteredThemes.length
			: editor.paletteMode === 'fonts'
				? filteredFonts.length
				: query.startsWith('>')
					? filteredCommands.length
					: filteredFiles.length
	);

	/** Placeholder text per mode */
	const placeholder = $derived(
		editor.paletteMode === 'themes'
			? 'Select Color Theme (↑↓ to preview)'
			: editor.paletteMode === 'fonts'
				? 'Select Font Family (↑↓ to preview)'
				: 'Type > for commands, or search files...'
	);

	const iconMap: Record<string, typeof FileText> = {
		'file-text': FileText,
		braces: Braces,
		user: User,
		mail: Mail,
		'folder-code': FolderCode
	};

	// ── Actions ──

	function close() {
		// Revert any live preview
		if (previewTheme !== null) {
			editor.setTheme(previewTheme);
			previewTheme = null;
		}
		if (previewFont !== null) {
			editor.setFont(previewFont);
			previewFont = null;
		}
		editor.commandPaletteOpen = false;
		editor.paletteMode = 'files';
		query = '';
	}

	function selectFile(entry: FileEntry) {
		if (entry.href) {
			goto(entry.href);
		}
		editor.commandPaletteOpen = false;
		editor.paletteMode = 'files';
		query = '';
	}

	function selectCommand(cmd: PaletteCommand) {
		cmd.action();
	}

	function selectTheme(id: ThemeId) {
		previewTheme = null; // commit — no revert needed
		previewFont = null;
		editor.setTheme(id);
		editor.commandPaletteOpen = false;
		editor.paletteMode = 'files';
		query = '';
	}

	function selectFont(id: FontId) {
		previewFont = null; // commit
		previewTheme = null;
		editor.setFont(id);
		editor.commandPaletteOpen = false;
		editor.paletteMode = 'files';
		query = '';
	}

	/** Live-preview theme on hover/arrow navigation */
	function previewThemeById(id: ThemeId) {
		if (previewTheme === null) {
			previewTheme = editor.currentTheme; // stash original
		}
		editor.setTheme(id);
	}

	/** Live-preview font on hover/arrow navigation */
	function previewFontById(id: FontId) {
		if (previewFont === null) {
			previewFont = editor.currentFont; // stash original
		}
		editor.setFont(id);
	}

	// ── Scroll the selected item into view ──

	function scrollSelectedIntoView() {
		requestAnimationFrame(() => {
			const container = document.querySelector('[data-palette-results]');
			if (!container) return;
			const items = container.querySelectorAll('[data-palette-item]');
			const item = items[selectedIndex];
			item?.scrollIntoView({ block: 'nearest' });
		});
	}

	// ── Keyboard ──

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, listLength - 1);
			triggerPreviewForIndex(selectedIndex);
			scrollSelectedIntoView();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
			triggerPreviewForIndex(selectedIndex);
			scrollSelectedIntoView();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			confirmSelection();
		} else if (e.key === 'Escape') {
			close();
		} else if (e.key === 'Backspace' && query === '' && editor.paletteMode !== 'files') {
			// Backspace on empty in sub-mode → go back to files
			editor.paletteMode = 'files';
			if (previewTheme !== null) {
				editor.setTheme(previewTheme);
				previewTheme = null;
			}
			if (previewFont !== null) {
				editor.setFont(previewFont);
				previewFont = null;
			}
		}
	}

	function triggerPreviewForIndex(idx: number) {
		if (editor.paletteMode === 'themes' && filteredThemes[idx]) {
			previewThemeById(filteredThemes[idx].id);
		} else if (editor.paletteMode === 'fonts' && filteredFonts[idx]) {
			previewFontById(filteredFonts[idx].id);
		}
	}

	function confirmSelection() {
		if (editor.paletteMode === 'themes' && filteredThemes[selectedIndex]) {
			selectTheme(filteredThemes[selectedIndex].id);
		} else if (editor.paletteMode === 'fonts' && filteredFonts[selectedIndex]) {
			selectFont(filteredFonts[selectedIndex].id);
		} else if (query.startsWith('>') && filteredCommands[selectedIndex]) {
			selectCommand(filteredCommands[selectedIndex]);
		} else if (filteredFiles[selectedIndex]) {
			selectFile(filteredFiles[selectedIndex]);
		}
	}

	// ── Lifecycle ──

	$effect(() => {
		if (editor.commandPaletteOpen) {
			selectedIndex = 0;
			query = '';
			previewTheme = null;
			previewFont = null;
			requestAnimationFrame(() => inputEl?.focus());
		}
	});

	// Reset selectedIndex when query changes
	$effect(() => {
		query; // track
		selectedIndex = 0;
	});
</script>

{#if editor.commandPaletteOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/50"
		onclick={close}
		onkeydown={(e) => e.key === 'Escape' && close()}
		role="presentation"
	></div>

	<!-- Palette -->
	<div class="fixed top-[15%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2">
		<div class="overflow-hidden rounded-lg border border-vsc-border bg-vsc-panel shadow-2xl">
			<!-- Search input -->
			<div class="flex items-center gap-2 border-b border-vsc-border px-3 py-2">
				{#if editor.paletteMode === 'themes'}
					<Palette size={16} class="text-vsc-text-muted" />
				{:else if editor.paletteMode === 'fonts'}
					<Type size={16} class="text-vsc-text-muted" />
				{:else}
					<Search size={16} class="text-vsc-text-muted" />
				{/if}
				<input
					bind:this={inputEl}
					bind:value={query}
					onkeydown={onKeydown}
					type="text"
					{placeholder}
					class="w-full appearance-none border-none bg-transparent text-sm text-vsc-text shadow-none ring-0 outline-none placeholder:text-vsc-text-muted focus:border-none focus:shadow-none focus:ring-0 focus:outline-none"
				/>
			</div>

			<!-- Results -->
			<div class="max-h-72 overflow-y-auto py-1" data-palette-results>
				{#if editor.paletteMode === 'themes'}
					<!-- Theme list -->
					{#each filteredThemes as theme, i (theme.id)}
						<button
							data-palette-item
							class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors
								{i === selectedIndex ? 'bg-vsc-blue/20 text-vsc-text' : 'text-vsc-text-muted hover:bg-vsc-blue/10'}"
							onclick={() => selectTheme(theme.id)}
							onmouseenter={() => {
								selectedIndex = i;
								previewThemeById(theme.id);
							}}
						>
							{#if editor.currentTheme === theme.id && previewTheme === null}
								<Check size={14} class="shrink-0 text-vsc-green" />
							{:else}
								<Palette size={14} class="shrink-0 text-vsc-blue" />
							{/if}
							<span class="flex-1 truncate">{theme.label}</span>
							<span class="text-xs text-vsc-text-muted">{theme.description}</span>
						</button>
					{/each}

					{#if filteredThemes.length === 0}
						<p class="px-3 py-4 text-center text-sm text-vsc-text-muted">No themes found</p>
					{/if}
				{:else if editor.paletteMode === 'fonts'}
					<!-- Font list -->
					{#each filteredFonts as font, i (font.id)}
						<button
							data-palette-item
							class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors
								{i === selectedIndex ? 'bg-vsc-blue/20 text-vsc-text' : 'text-vsc-text-muted hover:bg-vsc-blue/10'}"
							onclick={() => selectFont(font.id)}
							onmouseenter={() => {
								selectedIndex = i;
								previewFontById(font.id);
							}}
						>
							{#if editor.currentFont === font.id && previewFont === null}
								<Check size={14} class="shrink-0 text-vsc-green" />
							{:else}
								<Type size={14} class="shrink-0 text-vsc-blue" />
							{/if}
							<span class="flex-1 truncate" style="font-family: {font.fontFamily}"
								>{font.label}</span
							>
						</button>
					{/each}

					{#if filteredFonts.length === 0}
						<p class="px-3 py-4 text-center text-sm text-vsc-text-muted">No fonts found</p>
					{/if}
				{:else if query.startsWith('>')}
					<!-- Command list -->
					{#each filteredCommands as cmd, i (cmd.id)}
						<button
							data-palette-item
							class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors
								{i === selectedIndex ? 'bg-vsc-blue/20 text-vsc-text' : 'text-vsc-text-muted hover:bg-vsc-blue/10'}"
							onclick={() => selectCommand(cmd)}
							onmouseenter={() => (selectedIndex = i)}
						>
							{#if cmd.id === 'change-theme'}
								<Palette size={14} class="shrink-0 text-vsc-purple" />
							{:else if cmd.id === 'change-font'}
								<Type size={14} class="shrink-0 text-vsc-orange" />
							{:else}
								<Search size={14} class="shrink-0 text-vsc-blue" />
							{/if}
							<span class="flex-1 truncate">{cmd.label}</span>
							{#if cmd.description}
								<span class="text-xs text-vsc-text-muted">{cmd.description}</span>
							{/if}
						</button>
					{/each}

					{#if filteredCommands.length === 0}
						<p class="px-3 py-4 text-center text-sm text-vsc-text-muted">No matching commands</p>
					{/if}
				{:else}
					<!-- File list (default) -->
					{#each filteredFiles as entry, i (entry.id)}
						{@const Icon = iconMap[entry.icon] ?? FileText}
						<button
							data-palette-item
							class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors
								{i === selectedIndex ? 'bg-vsc-blue/20 text-vsc-text' : 'text-vsc-text-muted hover:bg-vsc-panel'}"
							onclick={() => selectFile(entry)}
							onmouseenter={() => (selectedIndex = i)}
						>
							<Icon size={14} class="shrink-0 text-vsc-blue" />
							<span class="flex-1 truncate">{entry.name}</span>
							{#if entry.folder}
								<span class="text-xs text-vsc-text-muted">{entry.folder}/</span>
							{/if}
						</button>
					{/each}

					{#if filteredFiles.length === 0}
						<p class="px-3 py-4 text-center text-sm text-vsc-text-muted">No files found</p>
					{/if}
				{/if}
			</div>

			<!-- Mode hint -->
			<div class="flex items-center justify-between border-t border-vsc-border px-3 py-1.5">
				<span class="text-[11px] text-vsc-text-muted">
					{#if editor.paletteMode === 'themes' || editor.paletteMode === 'fonts'}
						↑↓ preview · Enter confirm · Esc cancel
					{:else}
						Type &gt; for commands
					{/if}
				</span>
			</div>
		</div>
	</div>
{/if}
