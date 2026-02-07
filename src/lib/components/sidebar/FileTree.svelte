<script lang="ts">
	import type { TreeNode } from '$lib/types';
	import FileTreeItem from './FileTreeItem.svelte';
	import FileTreeFolder from './FileTreeFolder.svelte';

	let { nodes }: { nodes: TreeNode[] } = $props();
</script>

<nav class="flex flex-col gap-0.5 px-1 py-1" aria-label="File explorer">
	{#each nodes as node}
		{#if node.kind === 'file'}
			<FileTreeItem entry={node.entry} />
		{:else}
			<FileTreeFolder folder={node} />
		{/if}
	{/each}
</nav>
