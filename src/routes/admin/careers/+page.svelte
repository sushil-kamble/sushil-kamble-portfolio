<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Briefcase, MapPin, Plus, Trash2 } from 'lucide-svelte';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import * as AlertDialog from '$lib/components/admin/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button, buttonVariants } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';

	const { data } = $props();

	let deletingId = $state<number | null>(null);

	function openCareer(id: number) {
		void goto(resolve('/admin/careers/[id]', { id: String(id) }));
	}

	function handleCardKeydown(event: KeyboardEvent, id: number) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		openCareer(id);
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
	<AdminPageHeader
		title="Careers"
		description="Click to edit, {data.careers.length} {data.careers.length === 1
			? 'entry'
			: 'entries'}."
	>
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

	{#if data.careers.length === 0}
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
			{#each data.careers as career (career.id)}
				<Card.Root
					class="admin-collection-card group cursor-pointer"
					role="link"
					tabindex={0}
					aria-label={`Open ${career.company}`}
					onclick={() => openCareer(career.id)}
					onkeydown={(event) => handleCardKeydown(event, career.id)}
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
							<p class="text-foreground truncate text-sm font-semibold">{career.company}</p>
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
										<Badge variant="secondary" class="rounded-md px-1.5 py-0.5 text-[10px]"
											>{skill}</Badge
										>
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
