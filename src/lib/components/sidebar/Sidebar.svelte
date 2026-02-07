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

	// Filter out fixed tab entries that shouldn't show in sidebar tree
	// Keep: readme (root file), sidebar entries with folders, project/post entries
	const sidebarFiles = $derived(files.filter((f) => f.id === 'readme' || f.folder));
	const tree = $derived(buildSidebarTree(sidebarFiles));
</script>

{#if editor.sidebarExpanded}
	<!-- Mobile: overlay with backdrop -->
	{#if editor.isMobile}
		<!-- Backdrop -->
		<button
			class="fixed inset-0 z-40 bg-black/50"
			onclick={() => (editor.sidebarExpanded = false)}
			aria-label="Close sidebar"
		></button>

		<aside
			class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-vsc-border bg-vsc-sidebar"
		>
			<SidebarHeader />
			<div class="flex-1 overflow-y-auto">
				<FileTree nodes={tree} />
			</div>
		</aside>
	{:else}
		<!-- Desktop: inline sidebar -->
		<aside class="flex w-65 flex-col overflow-hidden border-r border-vsc-border bg-vsc-sidebar">
			<SidebarHeader />
			<div class="flex-1 overflow-y-auto">
				<FileTree nodes={tree} />
			</div>
		</aside>
	{/if}
{/if}
