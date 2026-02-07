<script lang="ts">
	import { setContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import { EditorState } from '$lib/state/editor.svelte';
	import { buildFileRegistry } from '$lib/utils/file-registry';
	import type { PageData } from '$lib/types';
	import VSCodeShell from '$lib/components/shell/VSCodeShell.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import EditorArea from '$lib/components/editor/EditorArea.svelte';
	import CommandPalette from '$lib/components/ui/CommandPalette.svelte';
	import FloatingActions from '$lib/components/ui/FloatingActions.svelte';

	const props: { data: PageData } = $props();

	const files = buildFileRegistry(props.data);
	const readmeFile = files.find((f) => f.id === 'readme')!;
	const editor = new EditorState(readmeFile);

	setContext(CONTEXT_KEYS.EDITOR_STATE, editor);
	setContext(CONTEXT_KEYS.PORTFOLIO_DATA, props.data);
	setContext(CONTEXT_KEYS.FILE_REGISTRY, files);

	function handleKeydown(e: KeyboardEvent) {
		const meta = e.metaKey || e.ctrlKey;

		// Cmd+K — Command palette
		if (meta && e.key === 'k') {
			e.preventDefault();
			editor.toggleCommandPalette();
		}

		// Cmd+W — Close active tab
		if (meta && e.key === 'w') {
			e.preventDefault();
			if (editor.activeTabId) {
				editor.closeTab(editor.activeTabId);
			}
		}

		// Ctrl+Tab / Ctrl+Shift+Tab — Cycle tabs
		if (e.ctrlKey && e.key === 'Tab') {
			e.preventDefault();
			editor.cycleTab(e.shiftKey ? -1 : 1);
		}

		// Cmd+B — Toggle sidebar
		if (meta && e.key === 'b') {
			e.preventDefault();
			editor.toggleSidebar();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} onresize={() => editor.handleResize()} />

<VSCodeShell>
	{#snippet sidebar()}
		<Sidebar />
	{/snippet}

	{#snippet editor()}
		<EditorArea />
	{/snippet}
</VSCodeShell>

<CommandPalette />
<FloatingActions />
