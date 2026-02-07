<script lang="ts">
	import { getContext } from 'svelte';
	import { Search, PanelLeft, ArrowUp, Settings } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import { formatShortcut, SHORTCUTS } from '$lib/utils/platform';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { EditorState } from '$lib/state/editor.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	let showScrollTop = $state(false);

	// ── Settings hint state ──────────────────────────────────────
	let showHint = $state(false);
	let hintDismissing = $state(false);

	// ── Search / Command Palette hint state ──────────────────────
	let showSearchHint = $state(false);
	let searchHintDismissing = $state(false);

	function scrollToTop() {
		const contentArea = document.querySelector('[data-content-area]');
		contentArea?.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function dismissHint() {
		hintDismissing = true;
		setTimeout(() => {
			showHint = false;
		}, 300);
	}

	function dismissSearchHint() {
		searchHintDismissing = true;
		setTimeout(() => {
			showSearchHint = false;
		}, 300);
	}

	function openSettingsFromHint() {
		dismissHint();
		setTimeout(() => editor.toggleSettings(), 150);
	}

	function openPaletteFromHint() {
		dismissSearchHint();
		setTimeout(() => editor.toggleCommandPalette(), 150);
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

	// Show customization hint after delay
	$effect(() => {
		if (typeof window === 'undefined') return;

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

	// Show search hint after settings hint (13s delay)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const timer = setTimeout(() => {
			showSearchHint = true;
		}, 13000);

		const autoDismiss = setTimeout(() => {
			if (showSearchHint && !searchHintDismissing) dismissSearchHint();
		}, 23000);

		return () => {
			clearTimeout(timer);
			clearTimeout(autoDismiss);
		};
	});

	const isMobile = $derived(typeof window !== 'undefined' && window.innerWidth < 768);
</script>

<div class="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2">
	{#if showScrollTop}
		<Tooltip label="Scroll to top">
			<button
				onclick={() => scrollToTop()}
				class="animate-fade-in rounded-full bg-vsc-panel p-3 text-vsc-text-muted shadow-lg ring-1 ring-vsc-border transition-all hover:text-vsc-text hover:ring-vsc-blue active:ring-vsc-blue active:bg-vsc-border"
				aria-label="Scroll to top"
			>
				<ArrowUp size={18} />
			</button>
		</Tooltip>
	{/if}

	<Tooltip label="Toggle Sidebar" shortcut={formatShortcut(SHORTCUTS.TOGGLE_SIDEBAR)}>
		<button
			onclick={() => editor.toggleSidebar()}
			class="rounded-full bg-vsc-panel p-3 text-vsc-text-muted shadow-lg ring-1 ring-vsc-border transition-all hover:text-vsc-text hover:ring-vsc-blue active:ring-vsc-blue active:bg-vsc-border"
			aria-label="Toggle sidebar"
		>
			<PanelLeft size={18} />
		</button>
	</Tooltip>

	<!-- Settings button with optional hint -->
	<div class="relative flex items-center gap-2">
		{#if showHint}
			<button
				onclick={openSettingsFromHint}
				class="relative flex items-center gap-1.5 rounded-full bg-vsc-panel/95 px-3 py-1.5 text-[11px] font-medium text-vsc-purple shadow-lg ring-1 ring-vsc-purple/30 backdrop-blur-sm transition-all hover:ring-vsc-purple/60
					{hintDismissing ? 'animate-fade-out' : 'animate-slide-up'}"
			>
				<span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-vsc-purple"></span>
				Customize theme
				<!-- Right-pointing arrow -->
				<span
					class="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-[5px] border-l-[6px] border-y-transparent border-l-vsc-panel/95"
				></span>
			</button>
		{/if}

		<Tooltip
			label="Settings"
			shortcut={formatShortcut(SHORTCUTS.SETTINGS)}
			description="Customize theme & font"
		>
			<button
				onclick={() => {
					if (showHint) dismissHint();
					editor.toggleSettings();
				}}
				class="relative rounded-full bg-vsc-panel p-3 shadow-lg ring-1 transition-all hover:text-vsc-text hover:ring-vsc-purple active:ring-vsc-purple active:bg-vsc-border
					{showHint ? 'text-vsc-purple ring-vsc-purple/40' : 'text-vsc-text-muted ring-vsc-border'}"
				aria-label="Customize appearance"
			>
				<Settings size={18} />
				{#if showHint}
					<span
						class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-vsc-purple shadow-sm"
					>
						<span class="absolute inset-0 animate-ping rounded-full bg-vsc-purple opacity-75"
						></span>
					</span>
				{/if}
			</button>
		</Tooltip>
	</div>

	<!-- Command Palette button with optional search hint -->
	<div class="relative flex items-center gap-2">
		{#if showSearchHint}
			<button
				onclick={openPaletteFromHint}
				class="relative flex items-center gap-1.5 rounded-full bg-vsc-panel/95 px-3 py-1.5 text-[11px] font-medium text-vsc-blue shadow-lg ring-1 ring-vsc-blue/30 backdrop-blur-sm transition-all hover:ring-vsc-blue/60
					{searchHintDismissing ? 'animate-fade-out' : 'animate-slide-up'}"
			>
				<span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-vsc-blue"></span>
				{#if isMobile}
					Search files & commands
				{:else}
					Try {formatShortcut(SHORTCUTS.COMMAND_PALETTE)} to search
				{/if}
				<!-- Right-pointing arrow -->
				<span
					class="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-[5px] border-l-[6px] border-y-transparent border-l-vsc-panel/95"
				></span>
			</button>
		{/if}

		<Tooltip
			label="Command Palette"
			shortcut={formatShortcut(SHORTCUTS.COMMAND_PALETTE)}
			description="Search files & commands"
		>
			<button
				onclick={() => {
					if (showSearchHint) dismissSearchHint();
					editor.toggleCommandPalette();
				}}
				class="relative rounded-full bg-vsc-blue p-3 text-white shadow-lg transition-all hover:bg-vsc-blue/80 active:bg-vsc-blue/60"
				aria-label="Open command palette"
			>
				<Search size={18} />
				{#if showSearchHint}
					<span class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-vsc-blue shadow-sm">
						<span class="absolute inset-0 animate-ping rounded-full bg-vsc-blue opacity-75"></span>
					</span>
				{/if}
			</button>
		</Tooltip>
	</div>
</div>
