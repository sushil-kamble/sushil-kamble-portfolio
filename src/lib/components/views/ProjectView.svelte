<script lang="ts">
	import { ExternalLink, Github } from 'lucide-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { Project } from '$lib/types';

	let { project }: { project: Project } = $props();
</script>

<div class="max-w-3xl">
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm text-vsc-green">// projects/{project.title.toLowerCase().replace(/\s+/g, '-')}.ts</p>
			<h2 class="mt-2 text-xl font-bold text-vsc-blue">{project.title}</h2>
		</div>
		<div class="flex gap-2">
			{#if project.direct}
				<a
					href={project.direct}
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1 rounded border border-vsc-border px-3 py-1.5 text-xs text-vsc-text transition-colors hover:border-vsc-blue hover:text-vsc-blue"
				>
					<ExternalLink size={12} />
					Live Demo
				</a>
			{/if}
			{#if project.github}
				<a
					href={project.github}
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1 rounded border border-vsc-border px-3 py-1.5 text-xs text-vsc-text transition-colors hover:border-vsc-blue hover:text-vsc-blue"
				>
					<Github size={12} />
					Source
				</a>
			{/if}
		</div>
	</div>

	{#if project.description}
		<p class="mt-3 leading-relaxed text-vsc-text-muted">{project.description}</p>
	{/if}

	<!-- Stack -->
	{#if project.stack.length > 0}
		<div class="mt-4">
			<p class="text-sm font-medium text-vsc-yellow">Tech Stack</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each project.stack as tech}
					<Badge text={tech} variant="blue" />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Features -->
	{#if project.features.length > 0}
		<div class="mt-4">
			<p class="text-sm font-medium text-vsc-yellow">Features</p>
			<ul class="mt-2 space-y-1 pl-5">
				{#each project.features as feature}
					<li class="list-disc text-sm text-vsc-text-muted">{feature}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Screenshots -->
	{#if project.screenshots.length > 0}
		<div class="mt-4">
			<p class="text-sm font-medium text-vsc-yellow">Screenshots</p>
			<div class="mt-2 grid grid-cols-2 gap-2">
				{#each project.screenshots as url}
					<img src={url} alt="{project.title} screenshot" class="rounded border border-vsc-border" loading="lazy" />
				{/each}
			</div>
		</div>
	{/if}
</div>
