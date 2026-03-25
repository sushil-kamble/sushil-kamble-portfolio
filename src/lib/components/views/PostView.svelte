<script lang="ts">
	import { ExternalLink, Github, BookOpen, Calendar } from 'lucide-svelte';
	import { marked } from 'marked';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import type { Blog } from '$lib/types';

	let { post }: { post: Blog } = $props();

	const summary = $derived(post.description?.trim() ?? '');
	const hasContent = $derived(Boolean(post.content?.trim()));
	const bodySource = $derived(hasContent ? post.content!.trim() : summary);
	const bodyHtml = $derived(
		bodySource
			? marked.parse(bodySource, {
					gfm: true,
					breaks: true
				})
			: ''
	);
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

	{#if post.createdAt}
		<div class="mt-2 flex items-center gap-1.5 text-xs text-vsc-text-muted">
			<Calendar size={12} />
			<time datetime={post.createdAt}>
				{new Date(post.createdAt).toLocaleDateString('en-US', {
					weekday: 'short',
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</time>
		</div>
	{/if}

	{#if hasContent && summary}
		<p
			class="mt-3 rounded-lg border border-vsc-border bg-vsc-panel/60 px-4 py-3 leading-relaxed text-vsc-text"
		>
			{summary}
		</p>
	{/if}

	{#if post.tags.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each post.tags as tag (tag)}
				<TechBadge name={tag} variant="green" />
			{/each}
		</div>
	{/if}

	{#if bodyHtml}
		<article class="post-body mt-6">
			{@html bodyHtml}
		</article>
	{/if}
</div>

<style>
	.post-body {
		color: var(--color-vsc-text);
	}

	.post-body :global(*) {
		max-width: 100%;
	}

	.post-body :global(h1),
	.post-body :global(h2),
	.post-body :global(h3),
	.post-body :global(h4) {
		color: var(--color-vsc-green);
		font-weight: 700;
		line-height: 1.2;
		margin-top: 1.6rem;
		margin-bottom: 0.8rem;
	}

	.post-body :global(h1) {
		font-size: 1.55rem;
	}

	.post-body :global(h2) {
		font-size: 1.3rem;
	}

	.post-body :global(h3) {
		font-size: 1.1rem;
	}

	.post-body :global(p),
	.post-body :global(ul),
	.post-body :global(ol),
	.post-body :global(blockquote),
	.post-body :global(pre) {
		margin: 0.95rem 0;
	}

	.post-body :global(p),
	.post-body :global(li) {
		color: var(--color-vsc-text);
		line-height: 1.8;
	}

	.post-body :global(ul),
	.post-body :global(ol) {
		padding-left: 1.35rem;
	}

	.post-body :global(li + li) {
		margin-top: 0.45rem;
	}

	.post-body :global(a) {
		color: var(--color-vsc-blue);
		text-decoration: underline;
		text-underline-offset: 0.2rem;
	}

	.post-body :global(blockquote) {
		border-left: 3px solid var(--color-vsc-green);
		background: color-mix(in srgb, var(--color-vsc-panel) 78%, transparent);
		border-radius: 0.4rem;
		padding: 0.85rem 1rem;
		color: var(--color-vsc-text-muted);
	}

	.post-body :global(code) {
		background: var(--color-vsc-panel);
		border: 1px solid var(--color-vsc-border);
		border-radius: 0.35rem;
		padding: 0.15rem 0.35rem;
		color: var(--color-vsc-yellow);
		font-size: 0.92em;
	}

	.post-body :global(pre) {
		background: var(--color-vsc-panel);
		border: 1px solid var(--color-vsc-border);
		border-radius: 0.8rem;
		overflow-x: auto;
		padding: 1rem 1.1rem;
	}

	.post-body :global(pre code) {
		background: transparent;
		border: 0;
		padding: 0;
		color: inherit;
	}

	.post-body :global(hr) {
		border: 0;
		border-top: 1px solid var(--color-vsc-border);
		margin: 1.4rem 0;
	}

	.post-body :global(img) {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--color-vsc-border);
		border-radius: 0.9rem;
		margin: 1.2rem 0;
	}

	.post-body :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	.post-body :global(th),
	.post-body :global(td) {
		border: 1px solid var(--color-vsc-border);
		padding: 0.65rem 0.8rem;
		text-align: left;
	}
</style>
