<script lang="ts">
	import { getContext } from 'svelte';
	import TitleBar from './TitleBar.svelte';
	import StatusBar from './StatusBar.svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { Snippet } from 'svelte';

	let { sidebar, editor }: { sidebar: Snippet; editor: Snippet } = $props();

	const editorState = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const language = $derived(editorState.activeTab?.language ?? 'TypeScript');
</script>

<div class="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden bg-vsc-bg">
	<TitleBar />

	<main class="grid min-h-0 grid-cols-[auto_1fr] overflow-hidden">
		{@render sidebar()}
		{@render editor()}
	</main>

	<StatusBar {language} />
</div>
