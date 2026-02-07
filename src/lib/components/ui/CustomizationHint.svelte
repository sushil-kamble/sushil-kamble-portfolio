<script lang="ts">
	import { getContext } from 'svelte';
	import { Settings, X, Sparkles } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	let visible = $state(false);
	let dismissing = $state(false);

	function dismiss() {
		dismissing = true;
		setTimeout(() => {
			visible = false;
		}, 300);
	}

	function openSettings() {
		dismiss();
		// Small delay so the hint fades before panel opens
		setTimeout(() => {
			editor.settingsOpen = true;
		}, 150);
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		const timer = setTimeout(() => {
			visible = true;
		}, 4500);

		// Auto-dismiss after 12 seconds if ignored
		const autoDismiss = setTimeout(() => {
			if (visible && !dismissing) dismiss();
		}, 16500);

		return () => {
			clearTimeout(timer);
			clearTimeout(autoDismiss);
		};
	});
</script>

{#if visible}
	<div
		class="fixed bottom-4 left-4 z-40 max-w-xs {dismissing
			? 'animate-fade-out'
			: 'animate-slide-up'}"
	>
		<div
			class="relative overflow-hidden rounded-xl border border-vsc-border bg-vsc-panel/95 p-4 shadow-2xl backdrop-blur-sm"
		>
			<!-- Subtle accent line at top -->
			<div
				class="absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-vsc-purple via-vsc-blue to-vsc-green"
			></div>

			<!-- Close button -->
			<button
				onclick={dismiss}
				class="absolute top-2 right-2 rounded p-1 text-vsc-text-muted transition-colors hover:bg-vsc-border/50 hover:text-vsc-text"
				aria-label="Dismiss"
			>
				<X size={12} />
			</button>

			<!-- Content -->
			<div class="flex items-start gap-3">
				<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-vsc-purple/15">
					<Sparkles size={16} class="text-vsc-purple" />
				</div>

				<div class="flex-1 pr-4">
					<p class="text-[13px] leading-snug font-medium text-vsc-text">Make it yours</p>
					<p class="mt-0.5 text-[11px] leading-relaxed text-vsc-text-muted">
						Customize themes, fonts, and more to match your style.
					</p>
				</div>
			</div>

			<button
				onclick={openSettings}
				class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-vsc-purple/15 px-3 py-2 text-[12px] font-medium text-vsc-purple transition-all hover:bg-vsc-purple/25"
			>
				<Settings size={13} />
				Open Appearance Settings
			</button>
		</div>
	</div>
{/if}
