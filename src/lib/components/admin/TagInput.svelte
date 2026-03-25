<script lang="ts">
	import { X } from 'lucide-svelte';

	interface Props {
		tags: string[];
		placeholder?: string;
		labelledBy?: string;
		onchange: (tags: string[]) => void;
	}

	const { tags, placeholder = 'Type and press Enter...', labelledBy, onchange }: Props = $props();

	let input = $state('');

	function addTag(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			const val = input.trim().replace(/,$/g, '');
			if (val && !tags.includes(val)) {
				onchange([...tags, val]);
			}
			input = '';
		}
	}

	function removeTag(tag: string) {
		onchange(tags.filter((t) => t !== tag));
	}
</script>

<div class="tag-input-wrapper">
	{#if tags.length > 0}
		<div class="tags-list">
			{#each tags as tag (tag)}
				<span class="tag">
					{tag}
					<button
						type="button"
						class="tag-remove"
						onclick={() => removeTag(tag)}
						aria-label="Remove {tag}"
					>
						<X size={12} />
					</button>
				</span>
			{/each}
		</div>
	{/if}
	<input
		type="text"
		bind:value={input}
		onkeydown={addTag}
		{placeholder}
		aria-labelledby={labelledBy}
		class="tag-input"
	/>
</div>

<style>
	.tag-input-wrapper {
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		padding: 8px;
		background: #fafaf9;
		transition: all 0.2s;
	}

	.tag-input-wrapper:focus-within {
		border-color: #1a1a1a;
		background: white;
		box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 6px;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		background: #f0ede8;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		color: #444;
	}

	.tag-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: none;
		background: none;
		border-radius: 50%;
		cursor: pointer;
		color: #888;
		transition: all 0.15s;
		padding: 0;
	}

	.tag-remove:hover {
		background: #dc2626;
		color: white;
	}

	.tag-input {
		width: 100%;
		border: none;
		background: none;
		outline: none;
		font-size: 14px;
		padding: 4px;
		color: #1a1a1a;
	}

	.tag-input::placeholder {
		color: #aaa;
	}
</style>
