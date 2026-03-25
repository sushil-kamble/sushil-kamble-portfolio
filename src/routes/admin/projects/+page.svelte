<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import {
		ExternalLink,
		FolderKanban,
		Github,
		GripVertical,
		Images,
		Loader2,
		Plus,
		Trash2
	} from 'lucide-svelte';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import * as AlertDialog from '$lib/components/admin/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button, buttonVariants } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import type { PageData } from './$types';

	type Project = PageData['projects'][number];

	const props: { data: PageData } = $props();

	let projects = $derived.by<Project[]>(() =>
		props.data.projects.map((project) => ({
			...project,
			stack: [...project.stack],
			features: [...project.features],
			screenshots: [...project.screenshots]
		}))
	);
	let deletingId = $state<number | null>(null);
	let draggedId = $state<number | null>(null);
	let dropTargetId = $state<number | null>(null);
	let reordering = $state(false);

	function openProject(id: number) {
		void goto(`/admin/projects/${id}`);
	}

	function handleCardKeydown(event: KeyboardEvent, id: number) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		openProject(id);
	}

	function reorderItems(items: Project[], sourceId: number, targetId: number) {
		const sourceIndex = items.findIndex((item) => item.id === sourceId);
		const targetIndex = items.findIndex((item) => item.id === targetId);

		if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
			return items;
		}

		const reordered = [...items];
		const [moved] = reordered.splice(sourceIndex, 1);
		reordered.splice(targetIndex, 0, moved);

		return reordered.map((item, ordering) => ({ ...item, ordering }));
	}

	async function persistOrder(nextProjects: Project[]) {
		reordering = true;

		const formData = new FormData();
		formData.set(
			'order',
			JSON.stringify(nextProjects.map((project, ordering) => ({ id: project.id, ordering })))
		);

		try {
			await fetch('?/reorder', { method: 'POST', body: formData });
			await invalidateAll();
		} finally {
			reordering = false;
			draggedId = null;
			dropTargetId = null;
		}
	}

	function handleDragStart(event: DragEvent, id: number) {
		draggedId = id;
		event.dataTransfer?.setData('text/plain', String(id));
		event.dataTransfer!.effectAllowed = 'move';
	}

	function handleDragEnd() {
		draggedId = null;
		dropTargetId = null;
	}

	function handleDragOver(event: DragEvent, id: number) {
		if (draggedId === null || draggedId === id) return;
		event.preventDefault();
		dropTargetId = id;
	}

	async function handleDrop(event: DragEvent, targetId: number) {
		event.preventDefault();

		if (draggedId === null || draggedId === targetId || reordering) {
			dropTargetId = null;
			return;
		}

		const nextProjects = reorderItems(projects, draggedId, targetId);
		projects = nextProjects;
		await persistOrder(nextProjects);
	}

	async function deleteProject(id: number) {
		deletingId = id;
		const formData = new FormData();
		formData.set('id', String(id));
		await fetch('?/delete', { method: 'POST', body: formData });
		deletingId = null;
		await invalidateAll();
	}
</script>

<section class="admin-page-medium">
	<AdminPageHeader title="Projects" description="Drag to reorder, click to edit.">
		{#snippet icon()}
			<FolderKanban class="size-4" />
		{/snippet}
		{#snippet actions()}
			<Button href="/admin/projects/new">
				<Plus class="size-4" />
				<span>Add project</span>
			</Button>
		{/snippet}
	</AdminPageHeader>

	{#if projects.length === 0}
		<AdminEmptyState title="No projects yet" description="Add a project to populate the portfolio.">
			{#snippet icon()}
				<FolderKanban class="size-5" />
			{/snippet}
			{#snippet action()}
				<Button href="/admin/projects/new">
					<Plus class="size-4" />
					<span>Add project</span>
				</Button>
			{/snippet}
		</AdminEmptyState>
	{:else}
		<div class="admin-collection-stack">
			{#each projects as project, index (project.id)}
				<Card.Root
					class={`admin-collection-card group cursor-pointer ${dropTargetId === project.id ? 'admin-collection-card-active' : ''} ${draggedId === project.id ? 'opacity-50' : ''}`}
					role="link"
					tabindex={0}
					aria-label={`Open ${project.title}`}
					onclick={() => openProject(project.id)}
					onkeydown={(event) => handleCardKeydown(event, project.id)}
					ondragover={(event) => handleDragOver(event, project.id)}
					ondragenter={(event) => handleDragOver(event, project.id)}
					ondrop={(event) => handleDrop(event, project.id)}
				>
					<Card.Content class="flex items-center gap-3 p-3 sm:p-4">
						<div
							class="border-border bg-muted/50 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
						>
							{#if project.screenshots.length > 0}
								<img
									src={project.screenshots[0]}
									alt={project.title}
									class="size-full object-cover"
								/>
							{:else}
								<Images class="text-muted-foreground size-4" />
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="text-muted-foreground text-xs tabular-nums">#{index + 1}</span>
								<h2 class="text-foreground truncate text-sm font-semibold">{project.title}</h2>
							</div>
							{#if project.description}
								<p class="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
									{project.description}
								</p>
							{/if}

							{#if project.stack.length > 0}
								<div class="mt-1.5 flex flex-wrap gap-1">
									{#each project.stack.slice(0, 4) as tech (tech)}
										<TechBadge name={tech} variant="blue" />
									{/each}
									{#if project.stack.length > 4}
										<Badge variant="outline" class="rounded-md px-1.5 py-0.5 text-[10px]">
											+{project.stack.length - 4}
										</Badge>
									{/if}
								</div>
							{/if}
						</div>

						<div class="flex shrink-0 items-center gap-1.5">
							{#if project.github}
								<a
									href={project.github}
									target="_blank"
									rel="noopener"
									class="text-muted-foreground hover:text-foreground p-1 transition-colors"
									onclick={(event) => event.stopPropagation()}
									aria-label="GitHub"
								>
									<Github class="size-3.5" />
								</a>
							{/if}
							{#if project.direct}
								<a
									href={project.direct}
									target="_blank"
									rel="noopener"
									class="text-muted-foreground hover:text-foreground p-1 transition-colors"
									onclick={(event) => event.stopPropagation()}
									aria-label="Live site"
								>
									<ExternalLink class="size-3.5" />
								</a>
							{/if}

							{#if reordering}
								<Loader2 class="text-muted-foreground size-3.5 animate-spin" />
							{/if}

							<button
								type="button"
								class="admin-collection-handle"
								draggable="true"
								aria-label={`Drag to reorder ${project.title}`}
								title="Drag to reorder"
								ondragstart={(event) => handleDragStart(event, project.id)}
								ondragend={handleDragEnd}
								onclick={(event) => event.stopPropagation()}
							>
								<GripVertical class="size-3.5" />
							</button>

							<AlertDialog.Root>
								<AlertDialog.Trigger
									class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
									onclick={(event) => event.stopPropagation()}
								>
									<Trash2 class="size-3.5" />
									<span class="sr-only">Delete {project.title}</span>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Delete project</AlertDialog.Title>
										<AlertDialog.Description>
											Remove "{project.title}" permanently?
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											variant="destructive"
											disabled={deletingId === project.id}
											onclick={() => deleteProject(project.id)}
										>
											{deletingId === project.id ? 'Deleting…' : 'Delete'}
										</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</section>
