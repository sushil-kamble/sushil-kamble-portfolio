<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { FileEntry } from '$lib/types';
	import { buildSidebarTree } from '$lib/utils/sidebar-tree';
	import SidebarHeader from './SidebarHeader.svelte';
	import FileTree from './FileTree.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const files = getContext<FileEntry[]>(CONTEXT_KEYS.FILE_REGISTRY);

	const tree = $derived(buildSidebarTree(files));
</script>

{#if editor.sidebarExpanded}
	<aside
		class="flex w-[260px] flex-col overflow-hidden border-r border-vsc-border bg-vsc-sidebar"
	>
		<SidebarHeader />
		<div class="flex-1 overflow-y-auto">
			<FileTree nodes={tree} />
		</div>
	</aside>
{/if}
