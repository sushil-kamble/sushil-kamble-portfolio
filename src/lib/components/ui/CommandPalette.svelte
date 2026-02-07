<script lang="ts">
	import { getContext } from 'svelte';
	import { Search, FileText, Braces, User, Mail, FolderCode } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { FileEntry } from '$lib/types';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const files = getContext<FileEntry[]>(CONTEXT_KEYS.FILE_REGISTRY);

	let query = $state('');
	let selectedIndex = $state(0);
	let inputEl: HTMLInputElement | undefined = $state();

	const filtered = $derived(
		query.trim()
			? files.filter((f) =>
					f.name.toLowerCase().includes(query.toLowerCase()) ||
					(f.folder?.toLowerCase().includes(query.toLowerCase()) ?? false)
				)
			: files
	);

	const iconMap: Record<string, typeof FileText> = {
		'file-text': FileText,
		braces: Braces,
		user: User,
		mail: Mail,
		'folder-code': FolderCode
	};

	function select(entry: FileEntry) {
		editor.openFile(entry);
		editor.commandPaletteOpen = false;
		query = '';
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter' && filtered[selectedIndex]) {
			e.preventDefault();
			select(filtered[selectedIndex]);
		} else if (e.key === 'Escape') {
			editor.commandPaletteOpen = false;
			query = '';
		}
	}

	$effect(() => {
		if (editor.commandPaletteOpen) {
			selectedIndex = 0;
			query = '';
			// Focus input after mount
			requestAnimationFrame(() => inputEl?.focus());
		}
	});
</script>

{#if editor.commandPaletteOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/50"
		onclick={() => {
			editor.commandPaletteOpen = false;
			query = '';
		}}
		onkeydown={(e) => e.key === 'Escape' && (editor.commandPaletteOpen = false)}
		role="presentation"
	></div>

	<!-- Palette -->
	<div class="fixed top-[15%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2">
		<div class="overflow-hidden rounded-lg border border-vsc-border bg-vsc-panel shadow-2xl">
			<!-- Search input -->
			<div class="flex items-center gap-2 border-b border-vsc-border px-3 py-2">
				<Search size={16} class="text-vsc-text-muted" />
				<input
					bind:this={inputEl}
					bind:value={query}
					onkeydown={onKeydown}
					type="text"
					placeholder="Search files..."
					class="w-full border-none bg-transparent text-sm text-vsc-text placeholder:text-vsc-text-muted focus:outline-none"
				/>
			</div>

			<!-- Results -->
			<div class="max-h-64 overflow-y-auto py-1">
				{#each filtered as entry, i (entry.id)}
					{@const Icon = iconMap[entry.icon] ?? FileText}
					<button
						class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors
							{i === selectedIndex ? 'bg-vsc-blue/20 text-vsc-text' : 'text-vsc-text-muted hover:bg-vsc-panel'}"
						onclick={() => select(entry)}
						onmouseenter={() => (selectedIndex = i)}
					>
						<Icon size={14} class="shrink-0 text-vsc-blue" />
						<span class="flex-1 truncate">{entry.name}</span>
						{#if entry.folder}
							<span class="text-xs text-vsc-text-muted">{entry.folder}/</span>
						{/if}
					</button>
				{/each}

				{#if filtered.length === 0}
					<p class="px-3 py-4 text-center text-sm text-vsc-text-muted">No files found</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
