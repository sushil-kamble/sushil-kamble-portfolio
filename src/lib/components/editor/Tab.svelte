<script lang="ts">
	import { FileText, Braces, User, Mail, FolderCode, Newspaper } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { FileEntry, PageData } from '$lib/types';

	let { entry }: { entry: FileEntry } = $props();

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);
	const isActive = $derived(editor.activeTabId === entry.id);

	const iconMap: Record<string, typeof FileText> = {
		'file-text': FileText,
		braces: Braces,
		user: User,
		mail: Mail,
		'folder-code': FolderCode,
		newspaper: Newspaper
	};

	const IconComponent = $derived(iconMap[entry.icon] ?? FileText);

	/** Dynamic tab label: append selected project/post name after a pipe */
	const displayName = $derived.by(() => {
		if (entry.id === 'projects' && editor.selectedProjectId) {
			const project = data.projects.find((p) => p.id === editor.selectedProjectId);
			return project ? `${entry.name} | ${project.title}` : entry.name;
		}
		if (entry.id === 'posts' && editor.selectedPostId) {
			const post = data.blogs.find((b) => b.id === editor.selectedPostId);
			return post ? `${entry.name} | ${post.title}` : entry.name;
		}
		return entry.name;
	});
</script>

<div
	role="tab"
	tabindex="0"
	aria-selected={isActive}
	class="group flex h-full cursor-pointer items-center gap-2 border-r border-vsc-border px-3 text-[13px] transition-colors
		{isActive
		? 'border-t-2 border-t-vsc-tab-accent bg-vsc-bg text-vsc-text'
		: 'border-t-2 border-t-transparent bg-vsc-panel text-vsc-text-muted hover:bg-vsc-bg/50'}"
	onclick={() => editor.setActive(entry.id)}
	onkeydown={(e) => e.key === 'Enter' && editor.setActive(entry.id)}
>
	<IconComponent size={14} class={isActive ? 'text-vsc-blue' : ''} />
	<span class="whitespace-nowrap">{displayName}</span>
</div>
