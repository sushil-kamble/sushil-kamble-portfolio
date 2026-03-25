<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Briefcase, GripVertical, Loader2, MapPin, Plus, Trash2 } from 'lucide-svelte';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import * as AlertDialog from '$lib/components/admin/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button, buttonVariants } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import type { PageData } from './$types';

	type Career = PageData['careers'][number];

	const props: { data: PageData } = $props();

	let careers = $derived.by<Career[]>(() =>
		props.data.careers.map((career) => ({
			...career,
			skills: [...(career.skills ?? [])],
			detailsList: [...(career.detailsList ?? [])]
		}))
	);
	let deletingId = $state<number | null>(null);
	let draggedId = $state<number | null>(null);
	let dropTargetId = $state<number | null>(null);
	let reorderingIds = $state(new Set<number>());

	function openCareer(id: number) {
		void goto(resolve('/admin/careers/[id]', { id: String(id) }));
	}

	function handleCardKeydown(event: KeyboardEvent, id: number) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		openCareer(id);
	}

	function reorderItems(items: Career[], sourceId: number, targetId: number) {
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

	async function persistOrder(nextCareers: Career[], sourceId: number, targetId: number) {
		reorderingIds = new Set([sourceId, targetId]);

		const formData = new FormData();
		formData.set(
			'order',
			JSON.stringify(nextCareers.map((career, ordering) => ({ id: career.id, ordering })))
		);

		try {
			await fetch('?/reorder', { method: 'POST', body: formData });
			await invalidateAll();
		} finally {
			reorderingIds = new Set();
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

		if (draggedId === null || draggedId === targetId || reorderingIds.size > 0) {
			dropTargetId = null;
			return;
		}

		const sourceId = draggedId;
		const nextCareers = reorderItems(careers, draggedId, targetId);
		careers = nextCareers;
		await persistOrder(nextCareers, sourceId, targetId);
	}

	async function deleteCareer(id: number) {
		deletingId = id;
		const formData = new FormData();
		formData.set('id', String(id));
		await fetch('?/delete', { method: 'POST', body: formData });
		deletingId = null;
		await invalidateAll();
	}
</script>

<section class="admin-page-medium">
	<AdminPageHeader title="Careers" description="Drag to reorder, click to edit.">
		{#snippet icon()}
			<Briefcase class="size-4" />
		{/snippet}
		{#snippet actions()}
			<Button href={resolve('/admin/careers/new')}>
				<Plus class="size-4" />
				<span>Add career</span>
			</Button>
		{/snippet}
	</AdminPageHeader>

	{#if careers.length === 0}
		<AdminEmptyState
			title="No careers yet"
			description="Create the first entry to show your work history."
		>
			{#snippet icon()}
				<Briefcase class="size-5" />
			{/snippet}
			{#snippet action()}
				<Button href={resolve('/admin/careers/new')}>
					<Plus class="size-4" />
					<span>Add career</span>
				</Button>
			{/snippet}
		</AdminEmptyState>
	{:else}
		<div class="admin-collection-stack">
			{#each careers as career, index (career.id)}
				<Card.Root
					class={`admin-collection-card group cursor-pointer ${dropTargetId === career.id ? 'admin-collection-card-active' : ''} ${draggedId === career.id ? 'opacity-50' : ''}`}
					role="link"
					tabindex={0}
					aria-label={`Open ${career.company}`}
					onclick={() => openCareer(career.id)}
					onkeydown={(event) => handleCardKeydown(event, career.id)}
					ondragover={(event) => handleDragOver(event, career.id)}
					ondragenter={(event) => handleDragOver(event, career.id)}
					ondrop={(event) => handleDrop(event, career.id)}
				>
					<Card.Content class="flex items-center gap-3 p-3 sm:p-4">
						<div
							class="border-border bg-muted/50 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
						>
							{#if career.logo}
								<img
									src={career.logo}
									alt={`${career.company} logo`}
									class="size-full object-contain p-1.5"
								/>
							{:else}
								<Briefcase class="text-muted-foreground size-4" />
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="text-muted-foreground text-xs tabular-nums">#{index + 1}</span>
								<p class="text-foreground truncate text-sm font-semibold">{career.company}</p>
							</div>
							<div
								class="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs"
							>
								{#if career.designation}
									<span>{career.designation}</span>
								{/if}
								{#if career.location}
									<span class="flex items-center gap-0.5">
										<MapPin class="size-3" />
										{career.location}
									</span>
								{/if}
								{#if career.start}
									<span>{career.start}{career.end ? ` – ${career.end}` : ' – Present'}</span>
								{/if}
							</div>

							{#if career.skills?.length}
								<div class="mt-1.5 flex flex-wrap gap-1">
									{#each career.skills.slice(0, 4) as skill (skill)}
										<TechBadge name={skill} variant="blue" />
									{/each}
									{#if career.skills.length > 4}
										<Badge variant="outline" class="rounded-md px-1.5 py-0.5 text-[10px]">
											+{career.skills.length - 4}
										</Badge>
									{/if}
								</div>
							{/if}
						</div>

						<div class="flex shrink-0 items-center gap-1.5">
							{#if reorderingIds.has(career.id)}
								<Loader2 class="text-muted-foreground size-3.5 animate-spin" />
							{/if}

							<button
								type="button"
								class="admin-collection-handle"
								draggable={!reorderingIds.has(career.id)}
								aria-label={`Drag to reorder ${career.company}`}
								title="Drag to reorder"
								ondragstart={(event) => handleDragStart(event, career.id)}
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
									<span class="sr-only">Delete {career.company}</span>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Delete career</AlertDialog.Title>
										<AlertDialog.Description>
											Remove {career.company} permanently?
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											variant="destructive"
											disabled={deletingId === career.id}
											onclick={() => deleteCareer(career.id)}
										>
											{deletingId === career.id ? 'Deleting…' : 'Delete'}
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
