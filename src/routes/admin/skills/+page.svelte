<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { SvelteSet } from 'svelte/reactivity';
	import { ArrowDown, ArrowUp, Check, Loader2, Plus, Trash2, Zap } from 'lucide-svelte';
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
		description="{categories.length} {categories.length === 1 ? 'category' : 'categories'}"
	>
		{#snippet icon()}
			<Zap class="size-4" />
		{/snippet}
	</AdminPageHeader>

	<!-- Add category form -->
	<Card.Root class="admin-surface">
		<Card.Content class="p-4">
			<form
				class="flex flex-col gap-2.5 sm:flex-row"
				onsubmit={(event) => {
					event.preventDefault();
					addCategory();
				}}
			>
				<Input
					type="text"
					bind:value={newTitle}
					placeholder="New category title…"
					class="h-10 flex-1"
				/>
				<Button type="submit" disabled={adding || !newTitle.trim()}>
					{#if adding}
						<Loader2 class="size-3.5 animate-spin" />
					{:else}
						<Plus class="size-3.5" />
					{/if}
					<span>Add category</span>
				</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if categories.length === 0}
		<AdminEmptyState
			title="No skill categories yet"
			description="Create a category and start adding skills."
		>
			{#snippet icon()}
				<Zap class="size-5" />
			{/snippet}
		</AdminEmptyState>
	{:else}
		<div class="grid gap-3">
			{#each categories as category, index (category.id)}
				{@const originalTitle =
					props.data.categories.find((item) => item.id === category.id)?.title ?? category.title}
				<Card.Root class="admin-surface">
					<Card.Content class="space-y-3 p-4">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div class="flex min-w-0 flex-1 items-center gap-2.5">
								<Input
									type="text"
									bind:value={category.title}
									onblur={() => handleTitleBlur(category, originalTitle)}
									placeholder="Category title"
									class="h-9 min-w-0 font-medium"
								/>
								<div class="flex shrink-0 items-center gap-1">
									<Badge
										variant="secondary"
										class="rounded-md px-1.5 py-0.5 text-[10px] tabular-nums"
									>
										{category.skills.length}
									</Badge>
									{#if savingIds.has(category.id)}
										<Loader2 class="text-muted-foreground size-3.5 animate-spin" />
									{:else if savedIds.has(category.id)}
										<Check class="size-3.5 text-emerald-600" />
									{/if}
								</div>
							</div>

							<div class="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon-sm"
									onclick={() => moveCategory(index, 'up')}
									disabled={index === 0}
									aria-label="Move up"
								>
									<ArrowUp class="size-3.5" />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									onclick={() => moveCategory(index, 'down')}
									disabled={index === categories.length - 1}
									aria-label="Move down"
								>
									<ArrowDown class="size-3.5" />
								</Button>

								<AlertDialog.Root>
									<AlertDialog.Trigger
										class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
									>
										<Trash2 class="size-3.5" />
										<span class="sr-only">Delete {category.title}</span>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Delete category</AlertDialog.Title>
											<AlertDialog.Description>
												Remove "{category.title}" and all its skills?
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<AlertDialog.Action
												variant="destructive"
												disabled={deletingId === category.id}
												onclick={() => deleteCategory(category.id)}
											>
												{deletingId === category.id ? 'Deleting…' : 'Delete'}
											</AlertDialog.Action>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</div>
						</div>

						<TagInput
							tags={category.skills}
							placeholder="Add a skill and press Enter…"
							onchange={(skills) => handleSkillsChange(category.id, skills)}
						/>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</section>
