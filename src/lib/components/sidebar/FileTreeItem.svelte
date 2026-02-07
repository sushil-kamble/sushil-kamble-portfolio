<script lang="ts">
	import { getContext } from 'svelte';
	import { FileText, Braces, User, Mail, FolderCode } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { FileEntry } from '$lib/types';

	let { entry, depth = 0 }: { entry: FileEntry; depth?: number } = $props();

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);

	const isActive = $derived.by(() => {
		if (entry.type === 'project' && entry.dataId) {
			return editor.activeTabId === 'projects' && editor.selectedProjectId === entry.dataId;
		}
		if (entry.type === 'post' && entry.dataId) {
			return editor.activeTabId === 'posts' && editor.selectedPostId === entry.dataId;
		}
		if (entry.type === 'about') {
			return editor.activeTabId === 'about';
		}
		if (entry.type === 'contact') {
			return editor.activeTabId === 'contact';
		}
		return editor.activeTabId === entry.id;
	});

	const iconMap: Record<string, typeof FileText> = {
		'file-text': FileText,
		braces: Braces,
		user: User,
		mail: Mail,
		'folder-code': FolderCode
	};

	const IconComponent = $derived(iconMap[entry.icon] ?? FileText);
</script>

<button
	onclick={() => {
		if (entry.type === 'project' && entry.dataId) {
			editor.navigateToProject(entry.dataId);
		} else if (entry.type === 'post' && entry.dataId) {
			editor.navigateToPost(entry.dataId);
		} else if (entry.type === 'about') {
			editor.setActive('about');
		} else if (entry.type === 'contact') {
			editor.setActive('contact');
		} else {
			editor.setActive(entry.id);
		}
	}}
	class="flex w-full items-center gap-2 rounded-sm px-2 py-0.5 text-left text-[13px] transition-colors
		{isActive
		? 'bg-vsc-panel text-vsc-text'
		: 'text-vsc-text-muted hover:bg-vsc-panel/50 hover:text-vsc-text'}"
	style="padding-left: {depth * 16 + 8}px"
>
	<IconComponent size={14} class="shrink-0 {isActive ? 'text-vsc-blue' : ''}" />
	<span class="truncate">{entry.name}</span>
</button>
