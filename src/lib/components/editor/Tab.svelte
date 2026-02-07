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

	/** Truncate text to a max length */
	function truncate(text: string, max: number): string {
		return text.length > max ? text.slice(0, max) + '…' : text;
	}

	/** Dynamic tab label: VS Code-style disambiguation for project/post detail views */
	const displayLabel = $derived.by(() => {
		const pathname = page.url.pathname;
		if (entry.id === 'projects' && pathname.startsWith('/projects/')) {
			const id = pathname.split('/')[2];
			const project = data.projects.find((p) => p.id === id);
			return project
				? { name: truncate(project.title, 20), path: '../projects' }
				: { name: entry.name, path: '' };
		}
		if (entry.id === 'posts' && pathname.startsWith('/posts/')) {
			const id = pathname.split('/')[2];
			const post = data.blogs.find((b) => b.id === id);
			return post
				? { name: truncate(post.title, 20), path: '../posts' }
				: { name: entry.name, path: '' };
		}
		return { name: entry.name, path: '' };
	});

	const displayName = $derived(
		displayLabel.path ? `${displayLabel.name} ${displayLabel.path}` : displayLabel.name
	);

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
	<span class="min-w-0 truncate">
		{displayLabel.name}{#if displayLabel.path}<span class="ml-1 text-vsc-text-muted opacity-60"
				>{displayLabel.path}</span
			>{/if}
	</span>
</a>
