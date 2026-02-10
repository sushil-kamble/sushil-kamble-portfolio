<script lang="ts">
	import { getContext } from 'svelte';
	import { ChevronRight, Folder, FolderOpen } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { TreeFolder } from '$lib/types';
	import FileTreeItem from './FileTreeItem.svelte';
	import Self from './FileTreeFolder.svelte';

	let { folder, depth = 0 }: { folder: TreeFolder; depth?: number } = $props();

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const isOpen = $derived(editor.expandedFolders.has(folder.path));
</script>

<div>
	<button
		onclick={() => editor.toggleFolder(folder.path)}
		class="flex w-full items-center gap-1 rounded-sm px-2 py-0.5 text-left text-[13px] text-vsc-text/70 transition-colors hover:bg-vsc-panel/50 hover:text-vsc-text active:bg-vsc-panel md:py-0"
		style="padding-left: {depth * 16 + 8}px"
	>
		<ChevronRight size={14} class="shrink-0 transition-transform {isOpen ? 'rotate-90' : ''}" />
		{#if isOpen}
			<FolderOpen size={14} class="shrink-0 text-vsc-yellow" />
		{:else}
			<Folder size={14} class="shrink-0 text-vsc-yellow" />
		{/if}
		<span class="truncate font-medium">{folder.name}</span>
	</button>

	{#if isOpen}
		<div>
			{#each folder.children as child (child.kind === 'file' ? child.entry.id : child.name)}
				{#if child.kind === 'file'}
					<FileTreeItem entry={child.entry} depth={depth + 1} />
				{:else}
					<Self folder={child} depth={depth + 1} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
