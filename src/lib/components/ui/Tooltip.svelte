<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';

	interface Props {
		label: string;
		shortcut?: string;
		description?: string;
		position?: 'left' | 'top' | 'bottom';
		children: Snippet;
	}

	const { label, shortcut, description, position = 'left', children }: Props = $props();

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	let visible = $state(false);
	let hoverTimer: ReturnType<typeof setTimeout> | undefined;

	// Hide keyboard shortcuts on mobile
	const displayShortcut = $derived(!editor.isMobile && shortcut);

	function show() {
		hoverTimer = setTimeout(() => {
			visible = true;
		}, 200);
	}

	function hide() {
		clearTimeout(hoverTimer);
		visible = false;
	}

	// Touch support: toggle on click for mobile devices
	function handleClick() {
		if (editor.isMobile) {
			visible = !visible;
			// Auto-hide after 2 seconds on mobile
			if (visible) {
				setTimeout(() => {
					visible = false;
				}, 2000);
			}
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
<div
	class="relative inline-flex"
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	onclick={handleClick}
>
	{@render children()}

	{#if visible}
		<div
			role="tooltip"
			class="tooltip-panel animate-tooltip-in pointer-events-none absolute z-50 rounded-md border border-vsc-border bg-vsc-panel px-2.5 py-1.5 whitespace-nowrap shadow-lg
				{position === 'left' ? 'top-1/2 right-full mr-2 -translate-y-1/2' : ''}
				{position === 'top' ? 'bottom-full left-1/2 mb-2 -translate-x-1/2' : ''}
				{position === 'bottom' ? 'top-full left-1/2 mt-2 -translate-x-1/2' : ''}"
		>
			<div class="flex items-center gap-2">
				<span class="text-[11px] font-medium text-vsc-text">{label}</span>
				{#if displayShortcut}
					<kbd
						class="rounded border border-vsc-border bg-vsc-bg px-1.5 py-0.5 text-[10px] font-medium text-vsc-text-muted"
					>
						{displayShortcut}
					</kbd>
				{/if}
			</div>
			{#if description}
				<div class="mt-0.5 text-[10px] text-vsc-text-muted">{description}</div>
			{/if}

			<!-- Arrow -->
			{#if position === 'left'}
				<div
					class="absolute top-1/2 -right-1 -translate-y-1/2 rotate-45 border-t border-r border-vsc-border bg-vsc-panel"
					style="width: 6px; height: 6px;"
				></div>
			{:else if position === 'top'}
				<div
					class="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 border-r border-b border-vsc-border bg-vsc-panel"
					style="width: 6px; height: 6px;"
				></div>
			{:else if position === 'bottom'}
				<div
					class="absolute -top-1 left-1/2 -translate-x-1/2 rotate-45 border-t border-l border-vsc-border bg-vsc-panel"
					style="width: 6px; height: 6px;"
				></div>
			{/if}
		</div>
	{/if}
</div>
