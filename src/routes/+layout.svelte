<script lang="ts">
	// ── Font imports ──
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/500.css';
	import '@fontsource/jetbrains-mono/600.css';
	import '@fontsource/jetbrains-mono/700.css';
	import '@fontsource/fira-code/400.css';
	import '@fontsource/fira-code/500.css';
	import '@fontsource/fira-code/600.css';
	import '@fontsource/fira-code/700.css';
	import '@fontsource/cascadia-code/400.css';
	import '@fontsource/cascadia-code/600.css';
	import '@fontsource/cascadia-code/700.css';
	import '@fontsource/source-code-pro/400.css';
	import '@fontsource/source-code-pro/500.css';
	import '@fontsource/source-code-pro/600.css';
	import '@fontsource/source-code-pro/700.css';
	import '@fontsource/ibm-plex-mono/400.css';
	import '@fontsource/ibm-plex-mono/500.css';
	import '@fontsource/ibm-plex-mono/600.css';
	import '@fontsource/ibm-plex-mono/700.css';
	// ── Styles ──
	import './layout.css';
	import '$lib/assets/themes.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount, setContext } from 'svelte';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import { EditorState } from '$lib/state/editor.svelte';
	import { buildFileRegistry } from '$lib/utils/file-registry';
	import type { PageData } from '$lib/types';
	import VSCodeShell from '$lib/components/shell/VSCodeShell.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import EditorArea from '$lib/components/editor/EditorArea.svelte';
	import CommandPalette from '$lib/components/ui/CommandPalette.svelte';
	import FloatingActions from '$lib/components/ui/FloatingActions.svelte';
	import SettingsPanel from '$lib/components/ui/SettingsPanel.svelte';

	const props: { children: import('svelte').Snippet; data: PageData } = $props();

	const files = buildFileRegistry(props.data);
	const editor = new EditorState();

	setContext(CONTEXT_KEYS.EDITOR_STATE, editor);
	setContext(CONTEXT_KEYS.PORTFOLIO_DATA, props.data);
	setContext(CONTEXT_KEYS.FILE_REGISTRY, files);

	// Sync URL → EditorState
	$effect(() => {
		editor.updatePathname(page.url.pathname);
	});

	// Dismiss splash with guaranteed minimum duration + cinematic reveal
	onMount(() => {
		const splash = document.getElementById('splash');
		const appContent = document.getElementById('app-content');
		if (!splash) {
			appContent?.classList.add('revealed');
			return;
		}

		// Absolute timestamp from app.html — independent of hydration speed
		const born = (window as unknown as { __splashBorn: number }).__splashBorn || Date.now();
		const GUARANTEED_MS = 4500; // Always visible for at least 4.5 seconds
		const wait = Math.max(0, GUARANTEED_MS - (Date.now() - born));

		setTimeout(() => {
			// Phase 1: "Complete" — progress bar turns green, cursor stops blinking
			splash.classList.add('splash-complete');

			// Phase 2: After a beat, exit splash and reveal content
			setTimeout(() => {
				splash.classList.add('splash-exit');
				// Content deblurs in slightly after splash starts dissolving
				setTimeout(() => appContent?.classList.add('revealed'), 150);
				// Remove splash from DOM after exit transition completes
				splash.addEventListener('transitionend', () => splash.remove(), { once: true });
				setTimeout(() => splash.remove(), 1000);
			}, 500);
		}, wait);
	});

	// Auto-close mobile sidebar on navigation
	afterNavigate(() => {
		if (editor.isMobile) {
			editor.sidebarExpanded = false;
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		const meta = e.metaKey || e.ctrlKey;

		// Cmd+K — Command palette
		if (meta && e.key === 'k') {
			e.preventDefault();
			editor.toggleCommandPalette();
		}

		// Ctrl+Tab / Ctrl+Shift+Tab — Cycle tabs
		if (e.ctrlKey && e.key === 'Tab') {
			e.preventDefault();
			goto(editor.getNextTabHref(e.shiftKey ? -1 : 1));
		}

		// Cmd+B — Toggle sidebar
		if (meta && e.key === 'b') {
			e.preventDefault();
			editor.toggleSidebar();
		}

		// Escape — Close settings panel
		if (e.key === 'Escape' && editor.settingsOpen) {
			e.preventDefault();
			editor.settingsOpen = false;
		}

		// Cmd+, — Open settings
		if (meta && e.key === ',') {
			e.preventDefault();
			editor.toggleSettings();
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>sushil.dev — VS Code</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} onresize={() => editor.handleResize()} />

<VSCodeShell>
	{#snippet sidebar()}
		<Sidebar />
	{/snippet}

	{#snippet editor()}
		<EditorArea>
			{#snippet content()}
				{@render props.children()}
			{/snippet}
		</EditorArea>
	{/snippet}
</VSCodeShell>

<CommandPalette />
<SettingsPanel />
<FloatingActions />
