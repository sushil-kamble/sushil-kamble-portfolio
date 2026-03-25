<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { SvelteSet } from 'svelte/reactivity';
	import type { PageData } from './$types';
	import TagInput from '$lib/components/admin/TagInput.svelte';
	import {
		Zap,
		Plus,
		Trash2,
		GripVertical,
		Loader2,
		Check,
		ArrowUp,
		ArrowDown
	} from 'lucide-svelte';

	const props: { data: PageData } = $props();

	let categories = $derived(props.data.categories.map((c) => ({ ...c, skills: [...c.skills] })));
	let savingIds = new SvelteSet<number>();
	let savedIds = new SvelteSet<number>();
	let deletingId = $state<number | null>(null);
	let confirmDeleteId = $state<number | null>(null);
	let adding = $state(false);
	let newTitle = $state('');

	async function saveCategory(cat: (typeof categories)[0]) {
		savingIds.add(cat.id);

		const formData = new FormData();
		formData.set('id', String(cat.id));
		formData.set('title', cat.title);
		formData.set('skills', JSON.stringify(cat.skills));

		await fetch('?/update', { method: 'POST', body: formData });

		savingIds.delete(cat.id);

		savedIds.add(cat.id);
		setTimeout(() => {
			savedIds.delete(cat.id);
		}, 2000);
	}

	async function deleteCategory(id: number) {
		deletingId = id;
		const formData = new FormData();
		formData.set('id', String(id));

		await fetch('?/delete', { method: 'POST', body: formData });

		deletingId = null;
		confirmDeleteId = null;
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

		const order = reordered.map((cat, i) => ({ id: cat.id, ordering: i }));

		const formData = new FormData();
		formData.set('order', JSON.stringify(order));

		await fetch('?/reorder', { method: 'POST', body: formData });
		await invalidateAll();
	}

	function handleSkillsChange(catId: number, newSkills: string[]) {
		const cat = categories.find((c) => c.id === catId);
		if (cat) {
			cat.skills = newSkills;
			saveCategory(cat);
		}
	}

	function handleTitleBlur(cat: (typeof categories)[0], originalTitle: string) {
		if (cat.title.trim() && cat.title !== originalTitle) {
			saveCategory(cat);
		}
	}
</script>

<div class="page">
	<header class="page-header">
		<div class="page-header-left">
			<div class="page-header-icon">
				<Zap size={20} strokeWidth={1.8} />
			</div>
			<div>
				<h1>Skills</h1>
				<p class="page-subtitle">
					{categories.length}
					{categories.length === 1 ? 'category' : 'categories'}
				</p>
			</div>
		</div>
	</header>

	<!-- Add Category -->
	<div class="add-section">
		<form
			class="add-form"
			onsubmit={(e) => {
				e.preventDefault();
				addCategory();
			}}
		>
			<input
				type="text"
				bind:value={newTitle}
				placeholder="New category title..."
				class="add-input"
			/>
			<button type="submit" class="add-btn" disabled={adding || !newTitle.trim()}>
				{#if adding}
					<Loader2 size={16} class="spin" />
				{:else}
					<Plus size={16} />
				{/if}
				<span>Add Category</span>
			</button>
		</form>
	</div>

	<!-- Categories List -->
	{#if categories.length === 0}
		<div class="empty-state">
			<div class="empty-icon">
				<Zap size={32} strokeWidth={1.2} />
			</div>
			<p class="empty-title">No skill categories yet</p>
			<p class="empty-desc">Add your first category above to get started</p>
		</div>
	{:else}
		<div class="categories-list">
			{#each categories as cat, i (cat.id)}
				{@const originalTitle =
					props.data.categories.find((c) => c.id === cat.id)?.title ?? cat.title}
				<div class="category-card">
					<div class="category-header">
						<div class="category-drag-handle">
							<GripVertical size={16} />
						</div>

						<input
							type="text"
							class="category-title-input"
							bind:value={cat.title}
							onblur={() => handleTitleBlur(cat, originalTitle)}
							placeholder="Category title"
						/>

						<div class="category-actions">
							<!-- Reorder buttons -->
							<button
								class="icon-btn"
								onclick={() => moveCategory(i, 'up')}
								disabled={i === 0}
								aria-label="Move up"
								title="Move up"
							>
								<ArrowUp size={14} />
							</button>
							<button
								class="icon-btn"
								onclick={() => moveCategory(i, 'down')}
								disabled={i === categories.length - 1}
								aria-label="Move down"
								title="Move down"
							>
								<ArrowDown size={14} />
							</button>

							<!-- Save indicator -->
							{#if savingIds.has(cat.id)}
								<span class="save-indicator">
									<Loader2 size={14} class="spin" />
								</span>
							{:else if savedIds.has(cat.id)}
								<span class="save-indicator saved">
									<Check size={14} />
								</span>
							{/if}

							<!-- Delete -->
							{#if confirmDeleteId === cat.id}
								<button
									class="icon-btn danger confirm"
									onclick={() => deleteCategory(cat.id)}
									disabled={deletingId === cat.id}
									aria-label="Confirm delete"
									title="Confirm delete"
								>
									{#if deletingId === cat.id}
										<Loader2 size={14} class="spin" />
									{:else}
										<Check size={14} />
									{/if}
								</button>
								<button
									class="icon-btn"
									onclick={() => (confirmDeleteId = null)}
									aria-label="Cancel delete"
									title="Cancel"
								>
									Cancel
								</button>
							{:else}
								<button
									class="icon-btn danger"
									onclick={() => (confirmDeleteId = cat.id)}
									aria-label="Delete category"
									title="Delete"
								>
									<Trash2 size={14} />
								</button>
							{/if}
						</div>
					</div>

					<div class="category-body">
						<TagInput
							tags={cat.skills}
							placeholder="Add a skill and press Enter..."
							onchange={(newSkills) => handleSkillsChange(cat.id, newSkills)}
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 720px;
	}

	/* ── Page Header ── */
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.page-header-left {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.page-header-icon {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fef3c7;
		border-radius: 10px;
		color: #d97706;
		flex-shrink: 0;
	}

	.page-header h1 {
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0;
		line-height: 1.2;
	}

	.page-subtitle {
		font-size: 14px;
		color: #888;
		margin: 2px 0 0;
	}

	/* ── Add Section ── */
	.add-section {
		margin-bottom: 20px;
	}

	.add-form {
		display: flex;
		gap: 10px;
	}

	.add-input {
		flex: 1;
		padding: 10px 16px;
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		font-size: 14px;
		background: #fafaf9;
		color: #1a1a1a;
		outline: none;
		transition: all 0.2s;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
	}

	.add-input:focus {
		border-color: #1a1a1a;
		background: white;
		box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
	}

	.add-input::placeholder {
		color: #aaa;
	}

	.add-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 18px;
		border: none;
		border-radius: 10px;
		background: #1a1a1a;
		color: white;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		letter-spacing: -0.005em;
		white-space: nowrap;
	}

	.add-btn:hover:not(:disabled) {
		background: #333;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.add-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* ── Empty State ── */
	.empty-state {
		text-align: center;
		padding: 60px 20px;
		background: white;
		border: 1px solid #e8e5e0;
		border-radius: 12px;
	}

	.empty-icon {
		width: 64px;
		height: 64px;
		margin: 0 auto 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f3f0;
		border-radius: 16px;
		color: #aaa;
	}

	.empty-title {
		font-size: 16px;
		font-weight: 600;
		margin: 0 0 4px;
		color: #555;
	}

	.empty-desc {
		font-size: 14px;
		color: #aaa;
		margin: 0;
	}

	/* ── Categories List ── */
	.categories-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.category-card {
		background: white;
		border: 1px solid #e8e5e0;
		border-radius: 12px;
		overflow: hidden;
		transition: border-color 0.2s;
	}

	.category-card:hover {
		border-color: #d0cdc6;
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px 16px;
		border-bottom: 1px solid #f0ede8;
	}

	.category-drag-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ccc;
		flex-shrink: 0;
		cursor: grab;
	}

	.category-title-input {
		flex: 1;
		border: 1px solid transparent;
		background: transparent;
		font-size: 15px;
		font-weight: 600;
		color: #1a1a1a;
		outline: none;
		padding: 6px 10px;
		border-radius: 8px;
		transition: all 0.2s;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		letter-spacing: -0.01em;
		min-width: 0;
	}

	.category-title-input:hover {
		background: #fafaf9;
		border-color: #e8e5e0;
	}

	.category-title-input:focus {
		background: white;
		border-color: #1a1a1a;
		box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
	}

	.category-actions {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border: none;
		background: none;
		border-radius: 8px;
		cursor: pointer;
		color: #aaa;
		transition: all 0.15s;
		padding: 0;
		font-size: 12px;
		font-weight: 500;
	}

	.icon-btn:hover:not(:disabled) {
		background: #f5f3f0;
		color: #555;
	}

	.icon-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.icon-btn.danger:hover:not(:disabled) {
		background: #fef2f2;
		color: #dc2626;
	}

	.icon-btn.danger.confirm {
		background: #fef2f2;
		color: #dc2626;
	}

	/* Cancel button in delete confirmation is text-like */
	.icon-btn:not(.danger):last-child {
		width: auto;
		padding: 0 8px;
		font-size: 12px;
		color: #888;
	}

	.save-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		color: #aaa;
	}

	.save-indicator.saved {
		color: #22c55e;
	}

	.category-body {
		padding: 14px 16px;
	}

	/* ── Responsive ── */
	@media (max-width: 480px) {
		.add-form {
			flex-direction: column;
		}

		.add-btn {
			justify-content: center;
		}

		.category-header {
			flex-wrap: wrap;
		}

		.category-actions {
			width: 100%;
			justify-content: flex-end;
			margin-top: 4px;
			padding-left: 24px;
		}
	}
</style>
