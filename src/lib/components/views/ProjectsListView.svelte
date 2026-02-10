<script lang="ts">
	import { getContext } from 'svelte';
	import { ExternalLink, Github, ArrowRight, FolderCode } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);
</script>

<div>
	<div class="flex items-center gap-3">
		<FolderCode size={20} class="text-vsc-blue" />
		<h1 class="text-xl font-bold text-vsc-blue">Projects</h1>
		<span class="text-sm text-vsc-text-muted">({data.projects.length} items)</span>
	</div>

	<p class="mt-2 text-sm text-vsc-green">// Browse all projects — click to view details</p>

	<div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
		{#each data.projects as project (project.id)}
			<div
				class="group relative cursor-pointer rounded-lg border border-vsc-border bg-vsc-panel p-4 text-left transition-all duration-200 hover:border-vsc-blue/50 hover:bg-vsc-bg hover:shadow-lg hover:shadow-vsc-blue/5"
			>
				<!-- Stretched card link -->
				<a href="/projects/{project.slug}" class="absolute inset-0 z-0" aria-label={project.title}
				></a>

				<!-- Title row -->
				<div class="pointer-events-none flex items-start justify-between gap-2">
					<h3 class="font-semibold text-vsc-text transition-colors group-hover:text-vsc-blue">
						{project.title}
					</h3>
					<ArrowRight
						size={16}
						class="shrink-0 text-vsc-text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-vsc-blue group-hover:opacity-100"
					/>
				</div>

				<!-- Description -->
				{#if project.description}
					<p
						class="pointer-events-none mt-2 line-clamp-2 text-sm leading-relaxed text-vsc-text-muted"
					>
						{project.description}
					</p>
				{/if}

				<!-- Stack -->
				{#if project.stack.length > 0}
					<div class="pointer-events-none mt-3 flex flex-wrap gap-1.5">
						{#each project.stack.slice(0, 4) as tech (tech)}
							<TechBadge name={tech} variant="blue" />
						{/each}
						{#if project.stack.length > 4}
							<span class="self-center text-xs text-vsc-text-muted">
								+{project.stack.length - 4}
							</span>
						{/if}
					</div>
				{/if}

				<!-- Links -->
				<div class="pointer-events-auto relative z-10 mt-3 flex gap-3">
					{#if project.github}
						<a
							href={project.github}
							target="_blank"
							rel="noopener"
							class="flex items-center gap-1 text-xs text-vsc-text-muted transition-colors hover:text-vsc-blue"
						>
							<Github size={12} />
							Source
						</a>
					{/if}
					{#if project.direct}
						<a
							href={project.direct}
							target="_blank"
							rel="noopener"
							class="flex items-center gap-1 text-xs text-vsc-text-muted transition-colors hover:text-vsc-green"
						>
							<ExternalLink size={12} />
							Live
						</a>
					{/if}
				</div>

				<!-- Hover accent line -->
				<div
					class="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-vsc-blue transition-all duration-300 group-hover:w-full"
				></div>
			</div>
		{/each}
	</div>
</div>
