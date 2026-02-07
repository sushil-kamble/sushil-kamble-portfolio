<script lang="ts">
	import { getContext } from 'svelte';
	import { BookOpen, ExternalLink, Github, ArrowRight } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import Badge from '$lib/components/ui/Badge.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);
</script>

<div>
	<div class="flex items-center gap-3">
		<BookOpen size={20} class="text-vsc-green" />
		<h1 class="text-xl font-bold text-vsc-green">Posts</h1>
		<span class="text-sm text-vsc-text-muted">({data.blogs.length} items)</span>
	</div>

	<p class="mt-2 text-sm text-vsc-green">// Blog posts, articles, and write-ups</p>

	<div class="mt-5 space-y-3">
		{#each data.blogs as post (post.id)}
			<div
				class="group relative w-full cursor-pointer rounded-lg border border-vsc-border bg-vsc-panel p-4 text-left transition-all duration-200 hover:border-vsc-green/50 hover:bg-vsc-bg hover:shadow-lg hover:shadow-vsc-green/5"
			>
				<!-- Stretched card link -->
				<a href="/posts/{post.id}" class="absolute inset-0 z-0" aria-label={post.title}></a>

				<div class="pointer-events-none flex items-start justify-between gap-3">
					<div class="flex-1">
						<!-- Title -->
						<h3 class="font-semibold text-vsc-text transition-colors group-hover:text-vsc-green">
							{post.title}
						</h3>

						<!-- Description -->
						{#if post.description}
							<p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-vsc-text-muted">
								{post.description}
							</p>
						{/if}

						<!-- Tags + Links row -->
						<div class="pointer-events-auto relative z-10 mt-3 flex flex-wrap items-center gap-2">
							{#each post.tags.slice(0, 3) as tag (tag)}
								<Badge text={tag} variant="green" />
							{/each}
							{#if post.tags.length > 3}
								<span class="text-xs text-vsc-text-muted">+{post.tags.length - 3}</span>
							{/if}

							<span class="mx-1 text-vsc-border">|</span>

							{#if post.blog}
								<a
									href={post.blog}
									target="_blank"
									rel="noopener"
									class="flex items-center gap-1 text-xs text-vsc-text-muted transition-colors hover:text-vsc-green"
								>
									<BookOpen size={11} />
									Read
								</a>
							{/if}
							{#if post.github}
								<a
									href={post.github}
									target="_blank"
									rel="noopener"
									class="flex items-center gap-1 text-xs text-vsc-text-muted transition-colors hover:text-vsc-blue"
								>
									<Github size={11} />
									Code
								</a>
							{/if}
							{#if post.live}
								<a
									href={post.live}
									target="_blank"
									rel="noopener"
									class="flex items-center gap-1 text-xs text-vsc-text-muted transition-colors hover:text-vsc-orange"
								>
									<ExternalLink size={11} />
									Demo
								</a>
							{/if}
						</div>
					</div>

					<ArrowRight
						size={16}
						class="mt-1 shrink-0 text-vsc-text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-vsc-green group-hover:opacity-100"
					/>
				</div>

				<!-- Hover accent line -->
				<div
					class="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-vsc-green transition-all duration-300 group-hover:w-full"
				></div>
			</div>
		{/each}
	</div>
</div>
