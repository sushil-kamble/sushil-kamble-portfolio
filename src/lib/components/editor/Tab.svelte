<script lang="ts">
	import { FileText, Braces, User, Mail, FolderCode, Newspaper } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { FileEntry, PageData } from '$lib/types';
	import { TAB_HREFS } from '$lib/utils/navigation';
	import type { FixedTabType } from '$lib/types';

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
		const pathname = page.url.pathname;
		if (entry.id === 'projects' && pathname.startsWith('/projects/')) {
			const id = pathname.split('/')[2];
			const project = data.projects.find((p) => p.id === id);
			return project ? `${entry.name} | ${project.title}` : entry.name;
		}
		if (entry.id === 'posts' && pathname.startsWith('/posts/')) {
			const id = pathname.split('/')[2];
			const post = data.blogs.find((b) => b.id === id);
			return post ? `${entry.name} | ${post.title}` : entry.name;
		}
		return entry.name;
	});

	const href = $derived(TAB_HREFS[entry.id as FixedTabType] ?? '/');
</script>

<a
	{href}
	role="tab"
	aria-selected={isActive}
	class="group flex h-full max-w-50 items-center gap-2 border-r border-vsc-border px-3 text-[13px] no-underline transition-colors
		{isActive
		? 'border-t-2 border-t-vsc-tab-accent bg-vsc-bg text-vsc-text'
		: 'border-t-2 border-t-transparent bg-vsc-panel text-vsc-text-muted hover:bg-vsc-bg/50'}"
	title={displayName}
>
	<IconComponent size={14} class="{isActive ? 'text-vsc-blue' : ''} shrink-0" />
	<span class="min-w-0 truncate">{displayName}</span>
</a>
