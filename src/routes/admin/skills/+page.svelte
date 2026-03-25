<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		ArrowDown,
		ArrowUp,
		Check,
		GripVertical,
		Loader2,
		Plus,
		Trash2,
		Zap
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import TagInput from '$lib/components/admin/TagInput.svelte';
	import * as AlertDialog from '$lib/components/admin/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button, buttonVariants } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';

	const props: { data: PageData } = $props();

	let categories = $derived(
		props.data.categories.map((category) => ({ ...category, skills: [...category.skills] }))
	);
	let savingIds = new SvelteSet<number>();
	let savedIds = new SvelteSet<number>();
	let deletingId = $state<number | null>(null);
	let adding = $state(false);
	let newTitle = $state('');

	async function saveCategory(category: (typeof categories)[0]) {
		savingIds.add(category.id);

		const formData = new FormData();
		formData.set('id', String(category.id));
		formData.set('title', category.title);
		formData.set('skills', JSON.stringify(category.skills));

		await fetch('?/update', { method: 'POST', body: formData });

		savingIds.delete(category.id);
		savedIds.add(category.id);
		setTimeout(() => savedIds.delete(category.id), 2000);
	}

	async function deleteCategory(id: number) {
		deletingId = id;
		const formData = new FormData();
		formData.set('id', String(id));

		await fetch('?/delete', { method: 'POST', body: formData });

		deletingId = null;
		await invalidateAll();
	}

	async function addCategory() {
		if (!newTitle.trim()) return;
		adding = true;

		const formData = new FormData();
		formData.set('title', newTitle.trim());

		await fetch('?/create', { method: 'POST', body: formData });

		newTitle = '';
		adding = false;
		await invalidateAll();
	}

	async function moveCategory(index: number, direction: 'up' | 'down') {
		const swapIndex = direction === 'up' ? index - 1 : index + 1;
		if (swapIndex < 0 || swapIndex >= categories.length) return;

		const reordered = [...categories];
		[reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];

		const order = reordered.map((category, ordering) => ({ id: category.id, ordering }));

		const formData = new FormData();
		formData.set('order', JSON.stringify(order));

		await fetch('?/reorder', { method: 'POST', body: formData });
		await invalidateAll();
	}

	function handleSkillsChange(categoryId: number, skills: string[]) {
		const category = categories.find((item) => item.id === categoryId);
		if (!category) return;
		category.skills = skills;
		saveCategory(category);
	}

	function handleTitleBlur(category: (typeof categories)[0], originalTitle: string) {
		if (category.title.trim() && category.title !== originalTitle) {
			saveCategory(category);
		}
	}
</script>

<section class="admin-page-medium">
	<AdminPageHeader
		title="Skills"
		description={`Manage ${categories.length} ${categories.length === 1 ? 'category' : 'categories'} and keep skills grouped consistently.`}
	>
		{#snippet icon()}
			<Zap class="size-5" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface">
		<Card.Content class="p-5">
			<form
				class="flex flex-col gap-3 sm:flex-row"
				onsubmit={(event) => {
					event.preventDefault();
					addCategory();
				}}
			>
				<Input
					type="text"
					bind:value={newTitle}
					placeholder="New category title..."
					class="flex-1"
				/>
				<Button type="submit" size="lg" disabled={adding || !newTitle.trim()}>
					{#if adding}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<Plus class="size-4" />
					{/if}
					<span>Add category</span>
				</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if categories.length === 0}
		<AdminEmptyState
			title="No skill categories yet"
			description="Create the first category and start adding the skills that should appear on the portfolio."
		>
			{#snippet icon()}
				<Zap class="size-6" />
			{/snippet}
		</AdminEmptyState>
	{:else}
		<div class="grid gap-4">
			{#each categories as category, index (category.id)}
				{@const originalTitle =
					props.data.categories.find((item) => item.id === category.id)?.title ?? category.title}
				<Card.Root class="admin-surface">
					<Card.Content class="space-y-4 p-5">
						<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
							<div class="flex min-w-0 items-start gap-3">
								<div class="admin-icon-shell size-10 shrink-0 rounded-xl">
									<GripVertical class="size-4" />
								</div>
								<div class="min-w-0 space-y-2">
									<Input
										type="text"
										bind:value={category.title}
										onblur={() => handleTitleBlur(category, originalTitle)}
										placeholder="Category title"
										class="h-10 min-w-0 font-medium"
									/>
									<div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
										<Badge variant="outline" class="rounded-full px-2.5 py-1">
											{category.skills.length} skill{category.skills.length === 1 ? '' : 's'}
										</Badge>
										{#if savingIds.has(category.id)}
											<Badge variant="secondary" class="gap-1.5 rounded-full px-2.5 py-1">
												<Loader2 class="size-3.5 animate-spin" />
												<span>Saving</span>
											</Badge>
										{:else if savedIds.has(category.id)}
											<Badge
												variant="secondary"
												class="gap-1.5 rounded-full px-2.5 py-1 text-emerald-700"
											>
												<Check class="size-3.5" />
												<span>Saved</span>
											</Badge>
										{/if}
									</div>
								</div>
							</div>

							<div class="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon-sm"
									onclick={() => moveCategory(index, 'up')}
									disabled={index === 0}
									aria-label="Move category up"
								>
									<ArrowUp class="size-4" />
								</Button>
								<Button
									variant="outline"
									size="icon-sm"
									onclick={() => moveCategory(index, 'down')}
									disabled={index === categories.length - 1}
									aria-label="Move category down"
								>
									<ArrowDown class="size-4" />
								</Button>

								<AlertDialog.Root>
									<AlertDialog.Trigger
										class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
									>
										<Trash2 class="size-4" />
										<span class="sr-only">Delete {category.title}</span>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Delete category</AlertDialog.Title>
											<AlertDialog.Description>
												This will remove {category.title} and all of its skills from the admin panel.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<AlertDialog.Action
												variant="destructive"
												disabled={deletingId === category.id}
												onclick={() => deleteCategory(category.id)}
											>
												{deletingId === category.id ? 'Deleting...' : 'Delete'}
											</AlertDialog.Action>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</div>
						</div>

						<TagInput
							tags={category.skills}
							placeholder="Add a skill and press Enter..."
							onchange={(skills) => handleSkillsChange(category.id, skills)}
						/>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</section>
