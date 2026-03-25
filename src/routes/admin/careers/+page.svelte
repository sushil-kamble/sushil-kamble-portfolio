<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ArrowUpRight, Briefcase, Calendar, MapPin, Plus, Trash2 } from 'lucide-svelte';
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
		description={`Manage ${data.careers.length} ${data.careers.length === 1 ? 'career entry' : 'career entries'} shown on the portfolio. Each card now opens directly into the editor.`}
	>
		{#snippet icon()}
			<Briefcase class="size-5" />
		{/snippet}
		{#snippet actions()}
			<Button href={resolve('/admin/careers/new')} size="lg">
				<Plus class="size-4" />
				<span>Add career</span>
			</Button>
		{/snippet}
	</AdminPageHeader>

	{#if data.careers.length === 0}
		<AdminEmptyState
			title="No careers yet"
			description="Create the first entry to start showing your work history on the portfolio."
		>
			{#snippet icon()}
				<Briefcase class="size-6" />
			{/snippet}
			{#snippet action()}
				<Button href={resolve('/admin/careers/new')}>
					<Plus class="size-4" />
					<span>Add career</span>
				</Button>
			{/snippet}
		</AdminEmptyState>
	{:else}
		<Card.Root class="admin-hero-surface overflow-hidden">
			<Card.Content class="relative grid gap-5 p-5 sm:grid-cols-[1.35fr_0.65fr] sm:p-6">
				<div class="space-y-3">
					<Badge
						variant="outline"
						class="rounded-full px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase"
					>
						Career Timeline
					</Badge>
					<div class="space-y-2">
						<h2 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
							Review the professional story at a glance
						</h2>
						<p class="text-muted-foreground max-w-2xl text-sm leading-6">
							Each entry is built as a full editing surface now. Open a role by clicking the card
							instead of hunting for a small icon.
						</p>
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-2">
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Entries</p>
						<p class="text-foreground mt-3 text-3xl font-semibold tracking-tight">
							{data.careers.length}
						</p>
					</div>
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Interaction</p>
						<p class="text-foreground mt-3 text-lg font-semibold tracking-tight">
							Card-first editing
						</p>
					</div>
				</div>

				<div
					class="pointer-events-none absolute top-6 -right-12 size-40 rounded-full bg-sky-500/10 blur-3xl"
				></div>
				<div
					class="pointer-events-none absolute bottom-0 left-8 h-16 w-32 rounded-full bg-amber-500/10 blur-3xl"
				></div>
			</Card.Content>
		</Card.Root>

		<div class="admin-collection-stack">
			{#each data.careers as career (career.id)}
				<Card.Root
					class="admin-collection-card group"
					role="link"
					tabindex={0}
					aria-label={`Open ${career.company}`}
					onclick={() => openCareer(career.id)}
					onkeydown={(event) => handleCardKeydown(event, career.id)}
				>
					<div
						class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"
					></div>
					<div
						class="pointer-events-none absolute top-6 -right-8 size-24 rounded-full bg-sky-500/8 blur-3xl"
					></div>

					<Card.Content
						class="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between"
					>
						<div class="min-w-0 flex-1 space-y-4">
							<div class="flex items-start gap-4">
								<div
									class="border-border/70 bg-muted/40 flex size-14 items-center justify-center overflow-hidden rounded-[1.2rem] border"
								>
									{#if career.logo}
										<img
											src={career.logo}
											alt={`${career.company} logo`}
											class="size-full object-contain p-2"
										/>
									{:else}
										<Briefcase class="text-muted-foreground size-4" />
									{/if}
								</div>
								<div class="min-w-0 space-y-2">
									<div class="space-y-1">
										<h2 class="text-foreground truncate text-xl font-semibold tracking-tight">
											{career.company}
										</h2>
										{#if career.designation}
											<p class="text-muted-foreground text-sm">{career.designation}</p>
										{/if}
									</div>

									<div class="admin-collection-meta">
										{#if career.location}
											<div class="admin-collection-meta-pill">
												<MapPin class="size-3.5" />
												<span>{career.location}</span>
											</div>
										{/if}
										{#if career.start}
											<div class="admin-collection-meta-pill">
												<Calendar class="size-3.5" />
												<span>{career.start}{career.end ? ` - ${career.end}` : ' - Present'}</span>
											</div>
										{/if}
									</div>
								</div>
							</div>

							{#if career.skills?.length}
								<div class="flex flex-wrap gap-2">
									{#each career.skills.slice(0, 6) as skill (skill)}
										<Badge variant="secondary" class="rounded-full px-2.5 py-1">{skill}</Badge>
									{/each}
									{#if career.skills.length > 6}
										<Badge variant="outline" class="rounded-full px-2.5 py-1">
											+{career.skills.length - 6} more
										</Badge>
									{/if}
								</div>
							{/if}

							<div class="admin-collection-nav-hint">
								<span>Open editor</span>
								<ArrowUpRight class="size-4" />
							</div>
						</div>

						<div class="admin-collection-action-rail">
							<div class="admin-collection-meta lg:flex-col lg:items-end">
								<div class="admin-collection-meta-pill">
									<span
										>{career.skills?.length ?? 0} skill{career.skills?.length === 1
											? ''
											: 's'}</span
									>
								</div>
							</div>

							<AlertDialog.Root>
								<AlertDialog.Trigger
									class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
									onclick={(event) => event.stopPropagation()}
								>
									<Trash2 class="size-4" />
									<span class="sr-only">Delete {career.company}</span>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Delete career</AlertDialog.Title>
										<AlertDialog.Description>
											This will permanently remove {career.company} from the admin panel and portfolio.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											variant="destructive"
											disabled={deletingId === career.id}
											onclick={() => deleteCareer(career.id)}
										>
											{deletingId === career.id ? 'Deleting...' : 'Delete'}
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
