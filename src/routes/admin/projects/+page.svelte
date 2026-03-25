<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import {
		ArrowUpRight,
		ExternalLink,
		FolderKanban,
		Github,
		GripVertical,
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
	<AdminPageHeader
		title="Projects"
		description={`Manage ${projects.length} ${projects.length === 1 ? 'project' : 'projects'}, click any card to edit it, and drag to control portfolio order.`}
	>
		{#snippet icon()}
			<FolderKanban class="size-5" />
		{/snippet}
		{#snippet actions()}
			<Button href="/admin/projects/new" size="lg">
				<Plus class="size-4" />
				<span>Add project</span>
			</Button>
		{/snippet}
	</AdminPageHeader>

	{#if projects.length === 0}
		<AdminEmptyState
			title="No projects yet"
			description="Add the first project to populate the portfolio project list."
		>
			{#snippet icon()}
				<FolderKanban class="size-6" />
			{/snippet}
			{#snippet action()}
				<Button href="/admin/projects/new">
					<Plus class="size-4" />
					<span>Add project</span>
				</Button>
			{/snippet}
		</AdminEmptyState>
	{:else}
		<Card.Root class="admin-hero-surface overflow-hidden">
			<Card.Content class="relative grid gap-5 p-5 sm:grid-cols-[1.3fr_0.7fr] sm:p-6">
				<div class="space-y-3">
					<Badge
						variant="outline"
						class="rounded-full px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase"
					>
						Project Studio
					</Badge>
					<div class="space-y-2">
						<h2 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
							Organize the portfolio like a release deck
						</h2>
						<p class="text-muted-foreground max-w-2xl text-sm leading-6">
							Drag projects to reshape the front-page narrative, then click any card to open its
							editor. Links and delete controls stay isolated so the main interaction stays clean.
						</p>
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-2">
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Total projects</p>
						<p class="text-foreground mt-3 text-3xl font-semibold tracking-tight">
							{projects.length}
						</p>
					</div>
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">
							Interaction model
						</p>
						<p class="text-foreground mt-3 text-lg font-semibold tracking-tight">
							Click to edit. Drag to reorder.
						</p>
					</div>
				</div>

				<div
					class="pointer-events-none absolute top-4 -right-10 size-36 rounded-full bg-emerald-500/10 blur-3xl"
				></div>
				<div
					class="pointer-events-none absolute bottom-0 left-10 h-16 w-32 rounded-full bg-sky-500/10 blur-3xl"
				></div>
			</Card.Content>
		</Card.Root>

		<div class="admin-collection-stack">
			{#each projects as project, index (project.id)}
				<Card.Root
					class={`admin-collection-card group ${dropTargetId === project.id ? 'admin-collection-card-active' : ''} ${draggedId === project.id ? 'opacity-70' : ''}`}
					role="link"
					tabindex={0}
					aria-label={`Open ${project.title}`}
					onclick={() => openProject(project.id)}
					onkeydown={(event) => handleCardKeydown(event, project.id)}
					ondragover={(event) => handleDragOver(event, project.id)}
					ondragenter={(event) => handleDragOver(event, project.id)}
					ondrop={(event) => handleDrop(event, project.id)}
				>
					<div
						class="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
					></div>
					<div
						class="pointer-events-none absolute top-6 -right-8 size-24 rounded-full bg-emerald-500/8 blur-3xl"
					></div>

					<Card.Content
						class="relative flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between"
					>
						<div class="flex min-w-0 flex-1 gap-4">
							<div
								class="border-border/70 bg-muted/40 flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border"
							>
								{#if project.screenshots.length > 0}
									<img
										src={project.screenshots[0]}
										alt={project.title}
										class="size-full object-cover"
									/>
								{:else}
									<FolderKanban class="text-muted-foreground size-5" />
								{/if}
							</div>

							<div class="min-w-0 space-y-4">
								<div class="space-y-2">
									<div class="flex flex-wrap items-center gap-2">
										<Badge variant="outline" class="rounded-full px-2.5 py-1">
											Position {index + 1}
										</Badge>
										<Badge variant="secondary" class="rounded-full px-2.5 py-1">
											Order value {project.ordering}
										</Badge>
									</div>
									<div class="space-y-1">
										<h2 class="text-foreground text-xl font-semibold tracking-tight">
											{project.title}
										</h2>
										{#if project.description}
											<p class="text-muted-foreground line-clamp-2 text-sm leading-6">
												{project.description}
											</p>
										{/if}
									</div>
								</div>

								{#if project.stack.length > 0}
									<div class="flex flex-wrap gap-2">
										{#each project.stack.slice(0, 6) as tech (tech)}
											<TechBadge name={tech} variant="blue" />
										{/each}
										{#if project.stack.length > 6}
											<Badge variant="outline" class="rounded-full px-2.5 py-1">
												+{project.stack.length - 6} more
											</Badge>
										{/if}
									</div>
								{/if}

								<div class="flex flex-wrap gap-2">
									{#if project.github}
										<Button
											href={project.github}
											variant="outline"
											size="sm"
											target="_blank"
											rel="noopener"
											onclick={(event) => event.stopPropagation()}
										>
											<Github class="size-4" />
											<span>GitHub</span>
										</Button>
									{/if}
									{#if project.direct}
										<Button
											href={project.direct}
											variant="outline"
											size="sm"
											target="_blank"
											rel="noopener"
											onclick={(event) => event.stopPropagation()}
										>
											<ExternalLink class="size-4" />
											<span>Live</span>
										</Button>
									{/if}
								</div>

								<div class="admin-collection-nav-hint">
									<span>Open editor</span>
									<ArrowUpRight class="size-4" />
								</div>
							</div>
						</div>

						<div class="admin-collection-action-rail">
							<div class="admin-collection-meta lg:flex-col lg:items-end">
								<div class="admin-collection-meta-pill">
									<span
										>{project.features.length} feature{project.features.length === 1
											? ''
											: 's'}</span
									>
								</div>
								{#if reordering}
									<div class="admin-collection-meta-pill">
										<Loader2 class="size-3.5 animate-spin" />
										<span>Saving order</span>
									</div>
								{/if}
							</div>

							<div class="flex items-center gap-2 lg:justify-end">
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
									<GripVertical class="size-4" />
								</button>

								<AlertDialog.Root>
									<AlertDialog.Trigger
										class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
										onclick={(event) => event.stopPropagation()}
									>
										<Trash2 class="size-4" />
										<span class="sr-only">Delete {project.title}</span>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Delete project</AlertDialog.Title>
											<AlertDialog.Description>
												This will permanently remove {project.title} from the portfolio.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<AlertDialog.Action
												variant="destructive"
												disabled={deletingId === project.id}
												onclick={() => deleteProject(project.id)}
											>
												{deletingId === project.id ? 'Deleting...' : 'Delete'}
											</AlertDialog.Action>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</section>
