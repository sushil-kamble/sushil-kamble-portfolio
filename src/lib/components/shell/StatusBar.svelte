<script lang="ts">
	import { getContext } from 'svelte';
	import { GitBranch, Bell, CheckCircle2, Palette, Type } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import { THEMES, FONTS } from '$lib/constants/themes';
	import type { EditorState } from '$lib/state/editor.svelte';

	let { language = 'TypeScript' }: { language?: string } = $props();

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	const themeLabel = $derived(THEMES.find((t) => t.id === editor.currentTheme)?.label ?? 'Dark+');
	const fontLabel = $derived(
		FONTS.find((f) => f.id === editor.currentFont)?.label ?? 'JetBrains Mono'
	);
</script>

<footer
	class="flex h-6 items-center justify-between border-t border-vsc-border bg-vsc-statusbar px-3 text-[11px] text-vsc-text-muted select-none"
>
	<div class="flex items-center gap-3">
		<span class="flex items-center gap-1">
			<GitBranch size={12} />
			main
		</span>
		<span class="flex items-center gap-1">
			<CheckCircle2 size={12} />
			0 problems
		</span>
	</div>

	<div class="flex items-center gap-3">
		<button
			class="flex items-center gap-1 transition-colors hover:text-vsc-text"
			onclick={() => editor.openThemePicker()}
			title="Change Color Theme"
		>
			<Palette size={12} />
			{themeLabel}
		</button>
		<button
			class="flex items-center gap-1 transition-colors hover:text-vsc-text"
			onclick={() => editor.openFontPicker()}
			title="Change Font Family"
		>
			<Type size={12} />
			{fontLabel}
		</button>
		<span>UTF-8</span>
		<span>{language}</span>
		<span class="flex items-center gap-1">
			<Bell size={12} />
		</span>
	</div>
</footer>
