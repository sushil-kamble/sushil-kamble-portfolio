<script lang="ts">
	import { page } from '$app/state';
	import { FileText, Braces, User, Mail, FolderCode } from 'lucide-svelte';
	import type { FileEntry } from '$lib/types';

	let { entry, depth = 0 }: { entry: FileEntry; depth?: number } = $props();

	const isActive = $derived(entry.href ? page.url.pathname === entry.href : false);

	const iconMap: Record<string, typeof FileText> = {
		'file-text': FileText,
		braces: Braces,
		user: User,
		mail: Mail,
		'folder-code': FolderCode
	};

	const IconComponent = $derived(iconMap[entry.icon] ?? FileText);
</script>

<a
	href={entry.href ?? '/'}
	class="flex w-full items-center gap-2 rounded-sm px-2 py-0.5 text-left text-[13px] no-underline transition-colors
		{isActive
		? 'bg-vsc-panel text-vsc-text'
		: 'text-vsc-text-muted hover:bg-vsc-panel/50 hover:text-vsc-text'}"
	style="padding-left: {depth * 16 + 8}px"
>
	<IconComponent size={14} class="shrink-0 {isActive ? 'text-vsc-blue' : ''}" />
	<span class="truncate">{entry.name}</span>
</a>
