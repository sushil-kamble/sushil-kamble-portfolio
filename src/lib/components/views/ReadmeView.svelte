<script lang="ts">
	import { getContext } from 'svelte';
	import {
		Terminal,
		Sparkles,
		ArrowRight,
		Github,
		ExternalLink,
		Mail,
		Send,
		FolderCode,
		Newspaper
	} from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import CalloutBox from '$lib/components/ui/CalloutBox.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);

	const variants: Array<'blue' | 'green' | 'purple' | 'orange' | 'yellow'> = [
		'blue',
		'green',
		'purple',
		'orange',
		'yellow'
	];

	const featuredProjects = $derived(data.projects.slice(0, 3));
	const recentPosts = $derived(data.blogs.slice(0, 3));
</script>

<div>
	<!-- Heading -->
	<div class="flex items-center gap-3">
		<Terminal size={24} class="text-vsc-green" />
		<h1 class="text-2xl font-bold text-vsc-blue">
			Hello World! <span class="text-vsc-yellow">I'm Sushil</span>
		</h1>
	</div>

	<!-- Comment block -->
	<div class="mt-4 text-sm leading-relaxed text-vsc-green">
		<p>/**</p>
		<p class="pl-2">* Full-stack developer crafting elegant solutions.</p>
		<p class="pl-2">* Passionate about clean code, great UX, and shipping fast.</p>
		<p>*/</p>
	</div>

	<!-- About -->
	{#if data.about_me}
		<p class="mt-4 leading-relaxed text-vsc-text">{data.about_me}</p>
	{/if}

	<!-- Skills heading -->
	<h2 class="mt-4 text-lg font-semibold text-vsc-green">
		<span class="text-vsc-purple">##</span> SKILL.md
	</h2>

	<!-- Tech stack — categorized badges -->
	<div class="mt-3 rounded-lg border border-vsc-border bg-vsc-panel p-4">
		<p class="text-sm text-vsc-yellow">&lbrace;</p>

		<div class="pl-4">
			<p class="text-sm">
				<span class="text-vsc-blue">"version"</span><span class="text-vsc-text">:</span>
				<span class="text-vsc-orange">"1.0.0"</span><span class="text-vsc-text">,</span>
			</p>

			{#each data.skills as category, i (category.title)}
				<div class="mt-3">
					<p class="text-sm">
						<span class="text-vsc-blue">"{category.title}"</span><span class="text-vsc-text"
							>: &lbrace;</span
						>
					</p>
					<div class="flex flex-wrap gap-2 py-2 pl-4">
						{#each category.skills as skill (skill)}
							<TechBadge name={skill} variant={variants[i % variants.length]} />
						{/each}
					</div>
					<p class="text-sm text-vsc-text">
						&rbrace;{i < data.skills.length - 1 ? ',' : ''}
					</p>
				</div>
			{/each}
		</div>

		<p class="text-sm text-vsc-yellow">&rbrace;</p>
	</div>

	<!-- ═══════════════════════════════════════════ -->
	<!-- FEATURED PROJECTS                           -->
	<!-- ═══════════════════════════════════════════ -->
	{#if featuredProjects.length > 0}
		<div class="mt-8">
			<div class="flex items-center gap-2">
				<FolderCode size={18} class="text-vsc-blue" />
				<h2 class="text-lg font-semibold text-vsc-blue">
					<span class="text-vsc-purple">##</span> PROJECTS.featured
				</h2>
			</div>
			<p class="mt-1 text-sm text-vsc-green">// Top projects — click to explore</p>

			<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
				{#each featuredProjects as project, i (project.id)}
					<div
						class="group relative overflow-hidden rounded-lg border border-vsc-border bg-vsc-panel p-4 text-left transition-all duration-300 hover:border-vsc-blue/60 hover:shadow-lg hover:shadow-vsc-blue/10"
						style="animation-delay: {i * 80}ms"
					>
						<!-- Stretched card link -->
						<a href="/projects/{project.id}" class="absolute inset-0 z-0" aria-label={project.title}
						></a>

						<!-- Subtle gradient overlay on hover -->
						<div
							class="pointer-events-none absolute inset-0 bg-linear-to-br from-vsc-blue/0 to-vsc-blue/0 transition-all duration-300 group-hover:from-vsc-blue/5 group-hover:to-transparent"
						></div>

						<!-- Project title -->
						<div class="relative flex items-center justify-between">
							<h3 class="text-sm font-semibold text-vsc-text group-hover:text-vsc-blue">
								{project.title}
							</h3>
							<ArrowRight
								size={14}
								class="text-vsc-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-vsc-blue group-hover:opacity-100"
							/>
						</div>

						<!-- Description -->
						{#if project.description}
							<p class="relative mt-2 line-clamp-2 text-xs leading-relaxed text-vsc-text-muted">
								{project.description}
							</p>
						{/if}

						<!-- Stack badges -->
						{#if project.stack.length > 0}
							<div class="relative mt-3 flex flex-wrap gap-1">
								{#each project.stack.slice(0, 3) as tech (tech)}
									<span class="rounded bg-vsc-blue/10 px-1.5 py-0.5 text-[10px] text-vsc-blue">
										{tech}
									</span>
								{/each}
								{#if project.stack.length > 3}
									<span class="self-center text-[10px] text-vsc-text-muted">
										+{project.stack.length - 3}
									</span>
								{/if}
							</div>
						{/if}

						<!-- External links -->
						<div class="relative z-10 mt-3 flex gap-2">
							{#if project.github}
								<a
									href={project.github}
									target="_blank"
									rel="noopener"
									class="text-vsc-text-muted transition-colors hover:text-vsc-text"
									title="Source code"
								>
									<Github size={13} />
								</a>
							{/if}
							{#if project.direct}
								<a
									href={project.direct}
									target="_blank"
									rel="noopener"
									class="text-vsc-text-muted transition-colors hover:text-vsc-green"
									title="Live demo"
								>
									<ExternalLink size={13} />
								</a>
							{/if}
						</div>

						<!-- Bottom accent -->
						<div
							class="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-vsc-blue to-vsc-purple transition-all duration-300 group-hover:w-full"
						></div>
					</div>
				{/each}
			</div>

			<!-- View all link -->
			<a
				href="/projects"
				class="mt-3 flex items-center gap-1.5 text-sm text-vsc-blue no-underline transition-colors hover:text-vsc-text"
			>
				View all {data.projects.length} projects
				<ArrowRight size={14} />
			</a>
		</div>
	{/if}

	<!-- ═══════════════════════════════════════════ -->
	<!-- RECENT POSTS                                -->
	<!-- ═══════════════════════════════════════════ -->
	{#if recentPosts.length > 0}
		<div class="mt-8">
			<div class="flex items-center gap-2">
				<Newspaper size={18} class="text-vsc-green" />
				<h2 class="text-lg font-semibold text-vsc-green">
					<span class="text-vsc-purple">##</span> POSTS.recent
				</h2>
			</div>
			<p class="mt-1 text-sm text-vsc-green">// Latest writings and articles</p>

			<div class="mt-4 space-y-2.5">
				{#each recentPosts as post, i (post.id)}
					<a
						href="/posts/{post.id}"
						class="group flex w-full items-start gap-3 rounded-lg border border-vsc-border bg-vsc-panel p-3 text-left no-underline transition-all duration-200 hover:border-vsc-green/50 hover:bg-vsc-bg"
						style="animation-delay: {i * 80}ms"
					>
						<!-- Index number -->
						<span
							class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-vsc-green/10 text-xs font-bold text-vsc-green"
						>
							{i + 1}
						</span>

						<div class="min-w-0 flex-1">
							<h3 class="text-sm font-medium text-vsc-text group-hover:text-vsc-green">
								{post.title}
							</h3>
							{#if post.description}
								<p class="mt-1 line-clamp-1 text-xs text-vsc-text-muted">
									{post.description}
								</p>
							{/if}
							{#if post.tags.length > 0}
								<div class="mt-1.5 flex flex-wrap gap-1">
									{#each post.tags.slice(0, 3) as tag (tag)}
										<Badge text={tag} variant="green" />
									{/each}
								</div>
							{/if}
						</div>

						<ArrowRight
							size={14}
							class="mt-1 shrink-0 text-vsc-text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-vsc-green group-hover:opacity-100"
						/>
					</a>
				{/each}
			</div>

			<!-- View all link -->
			<a
				href="/posts"
				class="mt-3 flex items-center gap-1.5 text-sm text-vsc-green no-underline transition-colors hover:text-vsc-text"
			>
				View all {data.blogs.length} posts
				<ArrowRight size={14} />
			</a>
		</div>
	{/if}

	<!-- ═══════════════════════════════════════════ -->
	<!-- QUICK CONTACT                               -->
	<!-- ═══════════════════════════════════════════ -->
	<div class="mt-8">
		<div class="flex items-center gap-2">
			<Mail size={18} class="text-vsc-orange" />
			<h2 class="text-lg font-semibold text-vsc-orange">
				<span class="text-vsc-purple">##</span> CONTACT.info
			</h2>
		</div>

		<div class="mt-3 rounded-lg border border-vsc-border bg-vsc-panel p-4">
			<p class="text-sm text-vsc-green">// Quick ways to reach me</p>

			<div class="mt-3 flex flex-col gap-2 text-sm">
				<div class="flex items-center gap-2 text-vsc-text-muted">
					<Mail size={14} class="text-vsc-orange" />
					<span class="text-vsc-blue">"email"</span>
					<span class="text-vsc-text">:</span>
					<a
						href="mailto:iamsushil303@gmail.com"
						class="text-vsc-orange transition-colors hover:text-vsc-yellow"
					>
						"iamsushil303@gmail.com"
					</a>
				</div>
				<div class="flex items-center gap-2 text-vsc-text-muted">
					<Github size={14} class="text-vsc-text" />
					<span class="text-vsc-blue">"github"</span>
					<span class="text-vsc-text">:</span>
					<a
						href="https://github.com/sushil-kamble"
						target="_blank"
						rel="noopener"
						class="text-vsc-orange transition-colors hover:text-vsc-yellow"
					>
						"github.com/sushil-kamble"
					</a>
				</div>
				<div class="flex items-center gap-2 text-vsc-text-muted">
					<ExternalLink size={14} class="text-vsc-text" />
					<span class="text-vsc-blue">"linkedin"</span>
					<span class="text-vsc-text">:</span>
					<a
						href="https://www.linkedin.com/in/sushil-kamble/"
						target="_blank"
						rel="noopener"
						class="text-vsc-orange transition-colors hover:text-vsc-yellow"
					>
						"linkedin.com/in/sushil-kamble"
					</a>
				</div>
				<div class="flex items-center gap-2 text-vsc-text-muted">
					<Send size={14} class="text-vsc-text" />
					<span class="text-vsc-blue">"x"</span>
					<span class="text-vsc-text">:</span>
					<a
						href="https://x.com/SushilK28005811"
						target="_blank"
						rel="noopener"
						class="text-vsc-orange transition-colors hover:text-vsc-yellow"
					>
						"x.com/SushilK28005811"
					</a>
				</div>
			</div>

			<a
				href="/contact"
				class="mt-4 flex items-center gap-2 rounded-md border border-vsc-border bg-vsc-bg px-4 py-2 text-sm text-vsc-text no-underline transition-all hover:border-vsc-orange/50 hover:text-vsc-orange"
			>
				<Send size={14} />
				Open full contact form
				<ArrowRight size={14} />
			</a>
		</div>
	</div>

	<!-- Callout -->
	<CalloutBox type="info">
		<p class="flex items-center gap-1.5">
			<Sparkles size={14} class="text-vsc-yellow" />
			Press <kbd class="rounded bg-vsc-panel px-1.5 py-0.5 text-xs text-vsc-blue">Cmd+K</kbd> to search
			files — or explore the sidebar.
		</p>
	</CalloutBox>
</div>
