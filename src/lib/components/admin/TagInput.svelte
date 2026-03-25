<script lang="ts">
	import { X } from 'lucide-svelte';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';

	interface Props {
		tags: string[];
		placeholder?: string;
		labelledBy?: string;
		onchange: (tags: string[]) => void;
	}

	let { tags, placeholder = 'Type and press Enter...', labelledBy, onchange }: Props = $props();

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
				<Badge variant="secondary" class="gap-1.5 rounded-full px-2.5 py-1 text-[11px]">
					<span>{tag}</span>
					<Button
						variant="ghost"
						size="icon-xs"
						class="text-muted-foreground hover:text-foreground -mr-1 size-4 rounded-full p-0"
						aria-label={`Remove ${tag}`}
						onclick={() => removeTag(tag)}
					>
						<X class="size-3" />
					</Button>
				</Badge>
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
