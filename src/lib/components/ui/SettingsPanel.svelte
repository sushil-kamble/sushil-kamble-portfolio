<script lang="ts">
	import { getContext } from 'svelte';
	import { X, Palette, Type, Check, Monitor } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import { THEMES, FONTS } from '$lib/constants/themes';
	import type { EditorState } from '$lib/state/editor.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	/** Small color swatches to hint at the theme palette */
	const themeSwatches: Record<string, string[]> = {
		'dark-default': ['#1e1e1e', '#569cd6', '#6a9955', '#dcdcaa', '#ce9178'],
		light: ['#ffffff', '#0066b8', '#008000', '#795e26', '#a31515'],
		monokai: ['#272822', '#66d9ef', '#a6e22e', '#e6db74', '#f92672'],
		dracula: ['#282a36', '#8be9fd', '#50fa7b', '#f1fa8c', '#ff79c6'],
		'github-dark': ['#0d1117', '#58a6ff', '#3fb950', '#d29922', '#f85149'],
		palenight: ['#292d3e', '#82aaff', '#c3e88d', '#ffcb6b', '#c792ea'],
		catppuccin: ['#1e1e2e', '#89b4fa', '#a6e3a1', '#f9e2af', '#cba6f7'],
		synthwave: ['#262335', '#36f9f6', '#72f1b8', '#fede5d', '#ff7edb']
	};
</script>

{#if editor.settingsOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/40"
		onclick={() => (editor.settingsOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (editor.settingsOpen = false)}
		role="presentation"
	></div>

	<!-- Panel -->
	<div
		class="fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-vsc-border bg-vsc-bg shadow-2xl"
		style="animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-vsc-border px-4 py-3">
			<div class="flex items-center gap-2">
				<Monitor size={16} class="text-vsc-blue" />
				<span class="text-sm font-semibold text-vsc-text">Appearance</span>
			</div>
			<button
				onclick={() => (editor.settingsOpen = false)}
				class="rounded p-1 text-vsc-text-muted transition-colors hover:bg-vsc-panel hover:text-vsc-text"
				aria-label="Close settings"
			>
				<X size={16} />
			</button>
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto px-4 py-4">
			<!-- Theme Section -->
			<div class="mb-6">
				<div class="mb-3 flex items-center gap-2">
					<Palette size={14} class="text-vsc-purple" />
					<h3 class="text-xs font-semibold tracking-wider text-vsc-text-muted uppercase">
						Color Theme
					</h3>
				</div>

				<div class="flex flex-col gap-1.5">
					{#each THEMES as theme (theme.id)}
						{@const isActive = editor.currentTheme === theme.id}
						{@const swatches = themeSwatches[theme.id] ?? []}
						<button
							onclick={() => editor.setTheme(theme.id)}
							class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all
								{isActive ? 'bg-vsc-blue/15 ring-1 ring-vsc-blue/40' : 'hover:bg-vsc-panel'}"
						>
							<!-- Color swatches -->
							<div class="flex gap-0.5">
								{#each swatches as color}
									<div
										class="h-4 w-4 rounded-sm first:rounded-l-md last:rounded-r-md"
										style="background-color: {color}"
									></div>
								{/each}
							</div>

							<div class="min-w-0 flex-1">
								<div
									class="truncate text-[13px] {isActive
										? 'font-medium text-vsc-text'
										: 'text-vsc-text-muted group-hover:text-vsc-text'}"
								>
									{theme.label}
								</div>
								<div class="truncate text-[11px] text-vsc-text-muted">{theme.description}</div>
							</div>

							{#if isActive}
								<Check size={14} class="shrink-0 text-vsc-green" />
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Divider -->
			<div class="mb-6 border-t border-vsc-border"></div>

			<!-- Font Section -->
			<div>
				<div class="mb-3 flex items-center gap-2">
					<Type size={14} class="text-vsc-orange" />
					<h3 class="text-xs font-semibold tracking-wider text-vsc-text-muted uppercase">
						Font Family
					</h3>
				</div>

				<div class="flex flex-col gap-1.5">
					{#each FONTS as font (font.id)}
						{@const isActive = editor.currentFont === font.id}
						<button
							onclick={() => editor.setFont(font.id)}
							class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all
								{isActive ? 'bg-vsc-blue/15 ring-1 ring-vsc-blue/40' : 'hover:bg-vsc-panel'}"
						>
							<!-- Font preview -->
							<span
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-vsc-panel text-sm font-semibold text-vsc-text"
								style="font-family: {font.fontFamily}"
							>
								Aa
							</span>

							<div class="min-w-0 flex-1">
								<div
									class="text-[13px] {isActive
										? 'font-medium text-vsc-text'
										: 'text-vsc-text-muted group-hover:text-vsc-text'}"
									style="font-family: {font.fontFamily}"
								>
									{font.label}
								</div>
								<div class="text-[11px] text-vsc-text-muted" style="font-family: {font.fontFamily}">
									The quick brown fox jumps
								</div>
							</div>

							{#if isActive}
								<Check size={14} class="shrink-0 text-vsc-green" />
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Footer with keyboard shortcut hint -->
		<div
			class="flex items-center gap-2 border-t border-vsc-border px-4 py-2.5 text-[11px] text-vsc-text-muted"
		>
			<kbd
				class="rounded border border-vsc-border bg-vsc-panel px-1.5 py-0.5 text-[10px] font-medium"
				>⌘K</kbd
			>
			<span>then type</span>
			<kbd
				class="rounded border border-vsc-border bg-vsc-panel px-1.5 py-0.5 text-[10px] font-medium"
				>&gt;theme</kbd
			>
			<span>for quick access</span>
		</div>
	</div>
{/if}

<style>
	@keyframes slideInRight {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
