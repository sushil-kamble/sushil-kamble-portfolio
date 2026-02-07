<script lang="ts">
	import { getContext } from 'svelte';
	import { Search, PanelLeft, ArrowUp } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	function scrollToTop() {
		const contentArea = document.querySelector('[data-content-area]');
		contentArea?.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div class="fixed right-4 bottom-4 z-40 flex flex-col gap-2">
	<button
		onclick={() => scrollToTop()}
		class="rounded-full bg-vsc-panel p-2.5 text-vsc-text-muted shadow-lg ring-1 ring-vsc-border transition-all hover:text-vsc-text hover:ring-vsc-blue"
		aria-label="Scroll to top"
	>
		<ArrowUp size={18} />
	</button>

	<button
		onclick={() => editor.toggleSidebar()}
		class="rounded-full bg-vsc-panel p-2.5 text-vsc-text-muted shadow-lg ring-1 ring-vsc-border transition-all hover:text-vsc-text hover:ring-vsc-blue"
		aria-label="Toggle sidebar"
	>
		<PanelLeft size={18} />
	</button>

	<button
		onclick={() => editor.toggleCommandPalette()}
		class="rounded-full bg-vsc-blue p-2.5 text-white shadow-lg transition-all hover:bg-vsc-blue/80"
		aria-label="Open command palette"
	>
		<Search size={18} />
	</button>
</div>
