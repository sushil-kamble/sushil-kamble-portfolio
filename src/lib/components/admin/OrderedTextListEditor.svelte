<script lang="ts">
	import { ArrowDown, ArrowUp, GripVertical, Plus, Sparkles, Trash2 } from 'lucide-svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';

	interface Props {
		items: string[];
		labelledBy?: string;
		placeholder?: string;
		addLabel?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		showTechBadges?: boolean;
		onchange: (items: string[]) => void;
	}

	let {
		items,
		labelledBy,
		placeholder = 'Add an item...',
		addLabel = 'Add item',
		emptyTitle = 'Nothing here yet',
		emptyDescription = 'Add your first item to build this section.',
		showTechBadges = false,
		onchange
	}: Props = $props();

	let draft = $state('');
	let draggedIndex = $state<number | null>(null);
	let dropIndex = $state<number | null>(null);

	function normalizeItems(nextItems: string[]): string[] {
		return nextItems.map((item) => item.trim()).filter(Boolean);
	}

	function commit(nextItems: string[]) {
		onchange(normalizeItems(nextItems));
	}

	function addItem() {
		const value = draft.trim();
		if (!value) return;

		const exists = items.some((item) => item.toLowerCase() === value.toLowerCase());
		if (!exists) {
			commit([...items, value]);
		}

		draft = '';
	}

	function updateItem(index: number, value: string) {
		const nextItems = [...items];
		nextItems[index] = value;
		onchange(nextItems);
	}

	function finalizeItem(index: number) {
		const nextItems = [...items];
		const normalized = nextItems[index]?.trim() ?? '';

		if (!normalized) {
			nextItems.splice(index, 1);
			commit(nextItems);
			return;
		}

		nextItems[index] = normalized;
		onchange(nextItems);
	}

	function removeItem(index: number) {
		const nextItems = [...items];
		nextItems.splice(index, 1);
		onchange(nextItems);
	}

	function moveItem(index: number, direction: 'up' | 'down') {
		const swapIndex = direction === 'up' ? index - 1 : index + 1;
		if (swapIndex < 0 || swapIndex >= items.length) return;

		const nextItems = [...items];
		[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
		onchange(nextItems);
	}

	function handleDraftKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		addItem();
	}

	function handleItemKeydown(event: KeyboardEvent, index: number) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'ArrowUp') {
			event.preventDefault();
			moveItem(index, 'up');
			return;
		}

		if ((event.metaKey || event.ctrlKey) && event.key === 'ArrowDown') {
			event.preventDefault();
			moveItem(index, 'down');
			return;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			finalizeItem(index);
		}
	}

	function handleDragStart(event: DragEvent, index: number) {
		draggedIndex = index;
		event.dataTransfer?.setData('text/plain', String(index));
		event.dataTransfer!.effectAllowed = 'move';
	}

	function handleDragOver(event: DragEvent, index: number) {
		if (draggedIndex === null || draggedIndex === index) return;
		event.preventDefault();
		dropIndex = index;
	}

	function handleDragEnd() {
		draggedIndex = null;
		dropIndex = null;
	}

	function handleDrop(event: DragEvent, index: number) {
		event.preventDefault();
		if (draggedIndex === null || draggedIndex === index) {
			dropIndex = null;
			return;
		}

		const nextItems = [...items];
		const [moved] = nextItems.splice(draggedIndex, 1);
		nextItems.splice(index, 0, moved);
		onchange(nextItems);

		draggedIndex = null;
		dropIndex = null;
	}
</script>

<div class="admin-surface space-y-4 rounded-[1.65rem] p-4 sm:p-5" aria-labelledby={labelledBy}>
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div class="space-y-1">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="outline" class="rounded-full px-2.5 py-1">
					{items.length} item{items.length === 1 ? '' : 's'}
				</Badge>
				<Badge variant="secondary" class="rounded-full px-2.5 py-1">
					Reorder by drag or arrows
				</Badge>
			</div>
		</div>

		<div class="flex w-full gap-2 sm:w-auto sm:min-w-[22rem]">
			<Input
				type="text"
				bind:value={draft}
				onkeydown={handleDraftKeydown}
				{placeholder}
				class="h-10"
			/>
			<Button type="button" variant="secondary" class="shrink-0" onclick={addItem}>
				<Plus class="size-4" />
				<span>{addLabel}</span>
			</Button>
		</div>
	</div>

	{#if items.length === 0}
		<div
			class="border-border/70 bg-background/70 rounded-[1.35rem] border border-dashed px-4 py-6 text-center"
		>
			<div class="admin-icon-shell mx-auto mb-3 size-11 rounded-2xl">
				<Sparkles class="size-4" />
			</div>
			<p class="text-foreground text-sm font-medium">{emptyTitle}</p>
			<p class="text-muted-foreground mx-auto mt-1 max-w-md text-sm leading-6">
				{emptyDescription}
			</p>
		</div>
	{:else}
		<div class="grid gap-3">
			{#each items as item, index (`${index}:${item}`)}
				<div
					class={`border-border/70 bg-background/75 rounded-[1.35rem] border p-3 transition-all ${dropIndex === index ? 'border-primary/45 ring-primary/15 ring-4' : ''}`}
					role="presentation"
					ondragover={(event) => handleDragOver(event, index)}
					ondragenter={(event) => handleDragOver(event, index)}
					ondrop={(event) => handleDrop(event, index)}
				>
					<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
						<div class="flex min-w-0 items-start gap-3">
							<button
								type="button"
								class="admin-collection-handle mt-0.5 shrink-0"
								draggable="true"
								aria-label={`Drag item ${index + 1} to reorder`}
								title="Drag to reorder"
								ondragstart={(event) => handleDragStart(event, index)}
								ondragend={handleDragEnd}
							>
								<GripVertical class="size-4" />
							</button>

							<div class="min-w-0 flex-1 space-y-3">
								<div class="flex flex-wrap items-center gap-2">
									<Badge variant="outline" class="rounded-full px-2.5 py-1">
										#{index + 1}
									</Badge>
									{#if showTechBadges && item.trim()}
										<div class="max-w-full overflow-hidden rounded-md">
											<TechBadge name={item.trim()} variant="blue" />
										</div>
									{/if}
								</div>

								<Input
									type="text"
									value={item}
									oninput={(event) => updateItem(index, event.currentTarget.value)}
									onblur={() => finalizeItem(index)}
									onkeydown={(event) => handleItemKeydown(event, index)}
									{placeholder}
									class="h-11"
								/>
							</div>
						</div>

						<div class="flex items-center gap-2 lg:pl-3">
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								disabled={index === 0}
								aria-label="Move item up"
								onclick={() => moveItem(index, 'up')}
							>
								<ArrowUp class="size-4" />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								disabled={index === items.length - 1}
								aria-label="Move item down"
								onclick={() => moveItem(index, 'down')}
							>
								<ArrowDown class="size-4" />
							</Button>
							<Button
								type="button"
								variant="destructive"
								size="icon-sm"
								aria-label={`Remove item ${index + 1}`}
								onclick={() => removeItem(index)}
							>
								<Trash2 class="size-4" />
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
