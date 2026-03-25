<script lang="ts">
	import { X } from 'lucide-svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';

	interface Props {
		tags: string[];
		placeholder?: string;
		labelledBy?: string;
		showTechBadges?: boolean;
		onchange: (tags: string[]) => void;
	}

	let {
		tags,
		placeholder = 'Type and press Enter...',
		labelledBy,
		showTechBadges = false,
		onchange
	}: Props = $props();

	let input = $state('');

	function addTag(event: KeyboardEvent) {
		if (event.key !== 'Enter' && event.key !== ',') return;
		event.preventDefault();
		const value = input.trim().replace(/,$/g, '');
		if (value && !tags.includes(value)) {
			onchange([...tags, value]);
		}
		input = '';
	}

	function removeTag(tag: string) {
		onchange(tags.filter((current) => current !== tag));
	}
</script>

<div class="admin-surface flex flex-col gap-3 rounded-2xl p-3">
	{#if tags.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each tags as tag (tag)}
				<div
					class="border-border/70 bg-secondary/60 flex max-w-full items-center gap-1.5 rounded-full border px-1.5 py-1"
				>
					{#if showTechBadges}
						<div class="max-w-full overflow-hidden rounded-md">
							<TechBadge name={tag} variant="blue" />
						</div>
					{:else}
						<Badge variant="secondary" class="rounded-full px-2 py-0.5 text-[11px]">
							<span>{tag}</span>
						</Badge>
					{/if}
					<Button
						variant="ghost"
						size="icon-xs"
						class="text-muted-foreground hover:text-foreground -mr-0.5 size-4 rounded-full p-0"
						aria-label={`Remove ${tag}`}
						onclick={() => removeTag(tag)}
					>
						<X class="size-3" />
					</Button>
				</div>
			{/each}
		</div>
	{/if}

	<Input
		type="text"
		bind:value={input}
		onkeydown={addTag}
		{placeholder}
		aria-labelledby={labelledBy}
		class="border-dashed"
	/>
</div>
