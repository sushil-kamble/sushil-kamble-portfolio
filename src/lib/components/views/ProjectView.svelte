<script lang="ts">
	import { ExternalLink, Github, X, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import type { Project } from '$lib/types';

	let { project }: { project: Project } = $props();

	const titleHref = $derived(project.direct || project.github || '');
	let activeScreenshotIndex = $state<number | null>(null);

	const hasMultipleScreenshots = $derived(project.screenshots.length > 1);
	const activeScreenshotUrl = $derived(
		activeScreenshotIndex === null ? '' : (project.screenshots[activeScreenshotIndex] ?? '')
	);

	function openScreenshot(index: number): void {
		activeScreenshotIndex = index;
	}

	function closeScreenshot(): void {
		activeScreenshotIndex = null;
	}

	function showNextScreenshot(): void {
		if (activeScreenshotIndex === null || project.screenshots.length < 2) return;
		activeScreenshotIndex = (activeScreenshotIndex + 1) % project.screenshots.length;
	}

	function showPreviousScreenshot(): void {
		if (activeScreenshotIndex === null || project.screenshots.length < 2) return;
		activeScreenshotIndex =
			(activeScreenshotIndex - 1 + project.screenshots.length) % project.screenshots.length;
	}

	function handleModalKeydown(e: KeyboardEvent): void {
		if (activeScreenshotIndex === null) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			closeScreenshot();
			return;
		}

		if (e.key === 'ArrowRight') {
			e.preventDefault();
			showNextScreenshot();
			return;
		}

		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			showPreviousScreenshot();
		}
	}
</script>

<svelte:window onkeydown={handleModalKeydown} />

<div>
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm text-vsc-green">
				// projects/{project.slug}.ts
			</p>
			{#if titleHref}
				<a
					href={titleHref}
					target="_blank"
					rel="noopener"
					class="mt-2 block text-xl font-bold text-vsc-blue no-underline decoration-vsc-blue/50 underline-offset-4 transition-all hover:underline"
				>
					{project.title}
				</a>
			{:else}
				<h2 class="mt-2 text-xl font-bold text-vsc-blue">{project.title}</h2>
			{/if}
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
		<p class="mt-3 leading-relaxed text-vsc-text">{project.description}</p>
	{/if}

	<!-- Stack -->
	{#if project.stack.length > 0}
		<div class="mt-4">
			<p class="text-sm font-medium text-vsc-yellow">Tech Stack</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each project.stack as tech (tech)}
					<TechBadge name={tech} variant="blue" />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Features -->
	{#if project.features.length > 0}
		<div class="mt-4">
			<p class="text-sm font-medium text-vsc-yellow">Features</p>
			<ul class="mt-2 space-y-1 pl-5">
				{#each project.features as feature (feature)}
					<li class="list-disc text-sm text-vsc-text">{feature}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Screenshots -->
	{#if project.screenshots.length > 0}
		<div class="mt-4">
			<p class="text-sm font-medium text-vsc-yellow">Screenshots</p>
			<div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
				{#each project.screenshots as url, i (url)}
					<button
						type="button"
						class="group relative overflow-hidden rounded border border-vsc-border text-left transition-all hover:border-vsc-blue/60"
						onclick={() => openScreenshot(i)}
						aria-label="Open screenshot {i + 1} of {project.title}"
					>
						<img
							src={url}
							alt="{project.title} screenshot {i + 1}"
							class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
							loading="lazy"
							decoding="async"
						/>
						<div
							class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
						></div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

{#if activeScreenshotIndex !== null}
	<div
		class="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-label="{project.title} screenshot preview"
		tabindex="-1"
	>
		<button
			type="button"
			class="absolute inset-0"
			aria-label="Close preview backdrop"
			onclick={closeScreenshot}
		></button>

		<div class="relative w-full max-w-6xl">
			<img
				src={activeScreenshotUrl}
				alt="{project.title} screenshot {activeScreenshotIndex + 1}"
				class="max-h-[86vh] w-full rounded-lg border border-vsc-border bg-vsc-bg object-contain"
			/>

			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-lg bg-linear-to-t from-black/72 via-black/28 to-transparent"
			></div>

			<div class="absolute bottom-3 left-3">
				<p class="text-sm font-medium text-white">{project.title}</p>
				<p class="text-xs text-white/75">
					Image {activeScreenshotIndex + 1} of {project.screenshots.length}
				</p>
			</div>

			<button
				type="button"
				class="absolute top-3 right-3 rounded-md border border-white/20 bg-black/45 p-2 text-white/90 transition-colors hover:bg-black/65 hover:text-white"
				aria-label="Close preview"
				onclick={closeScreenshot}
			>
				<X size={16} />
			</button>

			{#if hasMultipleScreenshots}
				<button
					type="button"
					class="absolute top-1/2 left-3 -translate-y-1/2 rounded-md border border-white/20 bg-black/45 p-2 text-white/90 transition-colors hover:bg-black/65 hover:text-white"
					aria-label="Previous image"
					onclick={showPreviousScreenshot}
				>
					<ChevronLeft size={18} />
				</button>

				<button
					type="button"
					class="absolute top-1/2 right-3 -translate-y-1/2 rounded-md border border-white/20 bg-black/45 p-2 text-white/90 transition-colors hover:bg-black/65 hover:text-white"
					aria-label="Next image"
					onclick={showNextScreenshot}
				>
					<ChevronRight size={18} />
				</button>
			{/if}
		</div>
	</div>
{/if}
