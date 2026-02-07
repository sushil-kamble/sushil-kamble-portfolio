<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import Tab from './Tab.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
</script>

{#if editor.openTabs.length > 0}
	<div
		class="flex h-9 overflow-x-auto border-b border-vsc-border bg-vsc-panel"
		role="tablist"
	>
		{#each editor.openTabs as tab (tab.id)}
			<Tab entry={tab} />
		{/each}
	</div>
{/if}
