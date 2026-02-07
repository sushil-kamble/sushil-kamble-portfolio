<script lang="ts">
	import { PanelLeftClose, PanelLeft } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
</script>

<div class="flex items-center justify-between px-4 py-2">
	<span class="text-[11px] font-semibold tracking-widest text-vsc-text-muted">EXPLORER</span>
	<button
		onclick={() => editor.toggleSidebar()}
		class="rounded p-0.5 text-vsc-text-muted transition-colors hover:text-vsc-text"
		aria-label="Toggle sidebar"
	>
		{#if editor.sidebarExpanded}
			<PanelLeftClose size={16} />
		{:else}
			<PanelLeft size={16} />
		{/if}
	</button>
</div>
