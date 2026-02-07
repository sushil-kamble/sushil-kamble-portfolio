<script lang="ts">
	import { ExternalLink, Github, BookOpen } from 'lucide-svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import type { Blog } from '$lib/types';

	let { post }: { post: Blog } = $props();
</script>

<div>
	<p class="text-sm text-vsc-green">// posts/{post.slug}.md</p>

	<div class="mt-2 flex items-start justify-between">
		{#if post.blog}
			<a
				href={post.blog}
				target="_blank"
				rel="noopener"
				class="text-xl font-bold text-vsc-blue no-underline decoration-vsc-blue/50 underline-offset-4 transition-all hover:underline"
			>
				{post.title}
			</a>
		{:else}
			<h2 class="text-xl font-bold text-vsc-blue">{post.title}</h2>
		{/if}
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
		<p class="mt-3 whitespace-pre-wrap leading-relaxed text-vsc-text">
			{post.description}</p>
	{/if}

	{#if post.tags.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each post.tags as tag (tag)}
				<TechBadge name={tag} variant="green" />
			{/each}
		</div>
	{/if}
</div>
