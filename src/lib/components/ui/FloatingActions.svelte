<script lang="ts">
	import { getContext } from 'svelte';
	import { Search, PanelLeft, ArrowUp, Settings } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import { LS_HINT_DISMISSED } from '$lib/constants/themes';
	import type { EditorState } from '$lib/state/editor.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	let showScrollTop = $state(false);
	let showHint = $state(false);
	let hintDismissing = $state(false);

	function scrollToTop() {
		const contentArea = document.querySelector('[data-content-area]');
		contentArea?.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function dismissHint() {
		hintDismissing = true;
		if (typeof window !== 'undefined') {
			localStorage.setItem(LS_HINT_DISMISSED, 'true');
		}
		setTimeout(() => {
			showHint = false;
		}, 300);
	}

	function openSettingsFromHint() {
		dismissHint();
		setTimeout(() => editor.toggleSettings(), 150);
	}

	$effect(() => {
		const contentArea = document.querySelector('[data-content-area]');
		if (!contentArea) return;

		function onScroll() {
			showScrollTop = (contentArea?.scrollTop ?? 0) > 200;
		}

		onScroll();
		contentArea.addEventListener('scroll', onScroll, { passive: true });
		return () => contentArea.removeEventListener('scroll', onScroll);
	});

	// Show customization hint after delay on first visit
	$effect(() => {
		if (typeof window === 'undefined') return;
		if (localStorage.getItem(LS_HINT_DISMISSED)) return;

		const timer = setTimeout(() => {
			showHint = true;
		}, 4500);

		const autoDismiss = setTimeout(() => {
			if (showHint && !hintDismissing) dismissHint();
		}, 14500);

		return () => {
			clearTimeout(timer);
			clearTimeout(autoDismiss);
		};
	});
</script>

<div class="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2">
	{#if showScrollTop}
		<button
			onclick={() => scrollToTop()}
			class="animate-fade-in rounded-full bg-vsc-panel p-2.5 text-vsc-text-muted shadow-lg ring-1 ring-vsc-border transition-all hover:text-vsc-text hover:ring-vsc-blue"
			aria-label="Scroll to top"
		>
			<ArrowUp size={18} />
		</button>
	{/if}

	<button
		onclick={() => editor.toggleSidebar()}
		class="rounded-full bg-vsc-panel p-2.5 text-vsc-text-muted shadow-lg ring-1 ring-vsc-border transition-all hover:text-vsc-text hover:ring-vsc-blue"
		aria-label="Toggle sidebar"
	>
		<PanelLeft size={18} />
	</button>

	<!-- Settings button with optional hint -->
	<div class="relative flex items-center gap-2">
		{#if showHint}
			<button
				onclick={openSettingsFromHint}
				class="flex items-center gap-1.5 rounded-full bg-vsc-panel/95 px-3 py-1.5 text-[11px] font-medium text-vsc-purple shadow-lg ring-1 ring-vsc-purple/30 backdrop-blur-sm transition-all hover:ring-vsc-purple/60
					{hintDismissing ? 'animate-fade-out' : 'animate-slide-up'}"
			>
				<span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-vsc-purple"></span>
				Customize theme
			</button>
		{/if}

		<button
			onclick={() => {
				if (showHint) dismissHint();
				editor.toggleSettings();
			}}
			class="relative rounded-full bg-vsc-panel p-2.5 shadow-lg ring-1 transition-all hover:text-vsc-text hover:ring-vsc-purple
				{showHint ? 'text-vsc-purple ring-vsc-purple/40' : 'text-vsc-text-muted ring-vsc-border'}"
			aria-label="Customize appearance"
			title="Customize theme & font"
		>
			<Settings size={18} />
			{#if showHint}
				<span class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-vsc-purple shadow-sm">
					<span class="absolute inset-0 animate-ping rounded-full bg-vsc-purple opacity-75"></span>
				</span>
			{/if}
		</button>
	</div>

	<button
		onclick={() => editor.toggleCommandPalette()}
		class="rounded-full bg-vsc-blue p-2.5 text-white shadow-lg transition-all hover:bg-vsc-blue/80"
		aria-label="Open command palette"
	>
		<Search size={18} />
	</button>
</div>
