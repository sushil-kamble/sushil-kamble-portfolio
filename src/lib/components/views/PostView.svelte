<script lang="ts">
	import { ExternalLink, Github, BookOpen } from 'lucide-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { Blog } from '$lib/types';

	let { post }: { post: Blog } = $props();
</script>

<div>
	<p class="text-sm text-vsc-green">// posts/{post.title.toLowerCase().replace(/\s+/g, '-')}.md</p>

	<div class="mt-2 flex items-start justify-between">
		<h2 class="text-xl font-bold text-vsc-blue">{post.title}</h2>
		<div class="flex gap-2">
			{#if post.blog}
				<a
					href={post.blog}
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1 rounded border border-vsc-border px-3 py-1.5 text-xs text-vsc-text transition-colors hover:border-vsc-blue hover:text-vsc-blue"
				>
					<BookOpen size={12} />
					Read
				</a>
			{/if}
			{#if post.live}
				<a
					href={post.live}
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1 rounded border border-vsc-border px-3 py-1.5 text-xs text-vsc-text transition-colors hover:border-vsc-blue hover:text-vsc-blue"
				>
					<ExternalLink size={12} />
					Demo
				</a>
			{/if}
			{#if post.github}
				<a
					href={post.github}
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1 rounded border border-vsc-border px-3 py-1.5 text-xs text-vsc-text transition-colors hover:border-vsc-blue hover:text-vsc-blue"
				>
					<Github size={12} />
					Code
				</a>
			{/if}
		</div>
	</div>

	{#if post.description}
		<p class="mt-3 leading-relaxed text-vsc-text-muted">{post.description}</p>
	{/if}

	{#if post.tags.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each post.tags as tag (tag)}
				<Badge text={tag} variant="green" />
			{/each}
		</div>
	{/if}
</div>
