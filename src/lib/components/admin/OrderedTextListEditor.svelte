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
		showItemNumbers?: boolean;
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
		showItemNumbers = true,
		onchange
	}: Props = $props();

	let draft = $state('');
	let draggedIndex = $state<number | null>(null);
	let dropIndex = $state<number | null>(null);
	let itemKeys = $state<number[]>([]);
	let nextItemKey = $state(0);

	$effect(() => {
		if (items.length > itemKeys.length) {
			itemKeys = [
				...itemKeys,
				...Array.from({ length: items.length - itemKeys.length }, () => nextItemKey++)
			];
			return;
		}

		if (items.length < itemKeys.length) {
			itemKeys = itemKeys.slice(0, items.length);
		}
	});

	function normalizeItems(nextItems: string[]): string[] {
		return nextItems.map((item) => item.trim()).filter(Boolean);
	}

	function commit(nextItems: string[]) {
		onchange(normalizeItems(nextItems));
	}

	function appendItemKey() {
		itemKeys = [...itemKeys, nextItemKey++];
	}

	function removeItemKey(index: number) {
		const nextKeys = [...itemKeys];
		nextKeys.splice(index, 1);
		itemKeys = nextKeys;
	}

	function swapItemKeys(index: number, swapIndex: number) {
		const nextKeys = [...itemKeys];
		[nextKeys[index], nextKeys[swapIndex]] = [nextKeys[swapIndex], nextKeys[index]];
		itemKeys = nextKeys;
	}

	function reorderItemKeys(sourceIndex: number, targetIndex: number) {
		const nextKeys = [...itemKeys];
		const [moved] = nextKeys.splice(sourceIndex, 1);
		nextKeys.splice(targetIndex, 0, moved);
		itemKeys = nextKeys;
	}

	function addItem() {
		const value = draft.trim();
		if (!value) return;

		const exists = items.some((item) => item.toLowerCase() === value.toLowerCase());
		if (!exists) {
			appendItemKey();
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
			removeItemKey(index);
			commit(nextItems);
			return;
		}

		nextItems[index] = normalized;
		onchange(nextItems);
	}

	function removeItem(index: number) {
		const nextItems = [...items];
		nextItems.splice(index, 1);
		removeItemKey(index);
		onchange(nextItems);
	}

	function moveItem(index: number, direction: 'up' | 'down') {
		const swapIndex = direction === 'up' ? index - 1 : index + 1;
		if (swapIndex < 0 || swapIndex >= items.length) return;

		const nextItems = [...items];
		[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
		swapItemKeys(index, swapIndex);
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
		reorderItemKeys(draggedIndex, index);
		onchange(nextItems);

		draggedIndex = null;
		dropIndex = null;
	}
</script>

<div class="space-y-4" aria-labelledby={labelledBy}>
	<div
		class="border-border/60 grid gap-3 border-b pb-4 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,36rem)] xl:items-end"
	>
		<div class="min-w-0 space-y-1">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="outline" class="rounded-full px-2.5 py-1">
					{items.length} item{items.length === 1 ? '' : 's'}
				</Badge>
				<Badge variant="secondary" class="rounded-full px-2.5 py-1">
					Reorder by drag or arrows
				</Badge>
			</div>
		</div>

		<div class="flex w-full min-w-0 gap-2">
			<Input
				type="text"
				bind:value={draft}
				onkeydown={handleDraftKeydown}
				{placeholder}
				class="bg-background/80 h-10 flex-1 rounded-md"
			/>
			<Button
				type="button"
				variant="outline"
				size="lg"
				class="h-10 shrink-0 rounded-sm px-4"
				onclick={addItem}
			>
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
			{#each items as item, index (itemKeys[index] ?? index)}
				<div
					class={`border-border/65 bg-background/45 rounded-[1.25rem] border px-3 py-3 transition-colors sm:px-4 ${dropIndex === index ? 'border-primary/45 ring-primary/12 ring-4' : ''}`}
					role="presentation"
					ondragover={(event) => handleDragOver(event, index)}
					ondragenter={(event) => handleDragOver(event, index)}
					ondrop={(event) => handleDrop(event, index)}
				>
					<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
						<div class="flex min-w-0 flex-1 items-start gap-3">
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

							<div class="min-w-0 flex-1 space-y-2.5">
								<div class="flex flex-wrap items-center gap-2">
									{#if showItemNumbers}
										<Badge variant="outline" class="rounded-full px-2.5 py-1">
											#{index + 1}
										</Badge>
									{/if}
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
									class="bg-background/85 h-10 w-full rounded-md"
								/>
							</div>
						</div>

						<div class="flex shrink-0 items-center gap-2 lg:ml-auto">
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
