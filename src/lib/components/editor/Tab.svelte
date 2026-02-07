<script lang="ts">
	import { X, FileText, Braces, User, Mail, FolderCode } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { FileEntry } from '$lib/types';

	let { entry }: { entry: FileEntry } = $props();

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const isActive = $derived(editor.activeTabId === entry.id);

	const iconMap: Record<string, typeof FileText> = {
		'file-text': FileText,
		braces: Braces,
		user: User,
		mail: Mail,
		'folder-code': FolderCode
	};

	const IconComponent = $derived(iconMap[entry.icon] ?? FileText);
</script>

<div
	role="tab"
	tabindex="0"
	aria-selected={isActive}
	class="group flex h-full cursor-pointer items-center gap-2 border-r border-vsc-border px-3 text-[13px] transition-colors
		{isActive ? 'bg-vsc-bg text-vsc-text border-t-2 border-t-vsc-tab-accent' : 'bg-vsc-panel text-vsc-text-muted border-t-2 border-t-transparent hover:bg-vsc-bg/50'}"
	onclick={() => editor.setActive(entry.id)}
	onkeydown={(e) => e.key === 'Enter' && editor.setActive(entry.id)}
>
	<IconComponent size={14} class={isActive ? 'text-vsc-blue' : ''} />
	<span class="whitespace-nowrap">{entry.name}</span>
	<button
		class="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-vsc-border/50 group-hover:opacity-100
			{isActive ? 'opacity-100' : ''}"
		onclick={(e) => {
			e.stopPropagation();
			editor.closeTab(entry.id);
		}}
		aria-label="Close {entry.name}"
	>
		<X size={14} />
	</button>
</div>
