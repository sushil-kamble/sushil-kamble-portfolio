<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import TagInput from '$lib/components/admin/TagInput.svelte';
	import TipTapEditor from '$lib/components/admin/TipTapEditor.svelte';

	let saving = $state(false);
	let title = $state('');
	let description = $state('');
	let blogUrl = $state('');
	let githubUrl = $state('');
	let liveUrl = $state('');
	let ordering = $state(0);
	let tags = $state<string[]>([]);
	let content = $state('');

	async function handleSubmit() {
		if (!title.trim()) return;
		saving = true;
		try {
			const res = await fetch('/admin/blogs/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim(),
					blogUrl: blogUrl.trim(),
					githubUrl: githubUrl.trim(),
					liveUrl: liveUrl.trim(),
					ordering,
					tags,
					content
				})
			});
			if (res.ok) {
				await goto('/admin/blogs');
			}
		} finally {
			saving = false;
		}
	}
</script>

<div class="page">
	<a href="/admin/blogs" class="back-link">
		<ArrowLeft size={16} />
		Back to Blog Posts
	</a>

	<h1>New Blog Post</h1>

	<form
		class="form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<div class="form-group">
			<label for="title">Title</label>
			<input id="title" type="text" bind:value={title} placeholder="Post title" required />
		</div>

		<div class="form-group">
			<label for="description">Description</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder="Brief summary of the post..."
				rows="3"
			></textarea>
		</div>

		<div class="form-group">
			<p class="field-label" id="new-blog-tags-label">Tags</p>
			<TagInput
				{tags}
				labelledBy="new-blog-tags-label"
				placeholder="Add tags..."
				onchange={(v) => (tags = v)}
			/>
		</div>

		<div class="form-group">
			<p class="field-label" id="new-blog-content-label">Content</p>
			<TipTapEditor
				{content}
				labelledBy="new-blog-content-label"
				uploadPath="Blog"
				onchange={(v) => (content = v)}
			/>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="blogUrl">Blog URL</label>
				<input id="blogUrl" type="url" bind:value={blogUrl} placeholder="https://..." />
			</div>
			<div class="form-group">
				<label for="githubUrl">GitHub URL</label>
				<input
					id="githubUrl"
					type="url"
					bind:value={githubUrl}
					placeholder="https://github.com/..."
				/>
			</div>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="liveUrl">Live URL</label>
				<input id="liveUrl" type="url" bind:value={liveUrl} placeholder="https://..." />
			</div>
			<div class="form-group">
				<label for="ordering">Order</label>
				<input id="ordering" type="number" bind:value={ordering} />
			</div>
		</div>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving || !title.trim()}>
				{saving ? 'Saving...' : 'Save Post'}
			</button>
			<a href="/admin/blogs" class="btn-cancel">Cancel</a>
		</div>
	</form>
</div>

<style>
	.page {
		max-width: 640px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: #888;
		text-decoration: none;
		margin-bottom: 20px;
		transition: color 0.15s;
	}

	.back-link:hover {
		color: #1a1a1a;
	}

	h1 {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 28px;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label,
	.field-label {
		font-size: 13px;
		font-weight: 600;
		color: #555;
		margin-bottom: 6px;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 10px 14px;
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		background: #fafaf9;
		font-size: 14px;
		color: #1a1a1a;
		box-sizing: border-box;
		font-family: inherit;
		transition: all 0.2s;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #1a1a1a;
		background: white;
		box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
	}

	.form-group textarea {
		resize: vertical;
		line-height: 1.5;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.form-actions {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-top: 8px;
	}

	.btn-save {
		display: inline-flex;
		align-items: center;
		padding: 10px 24px;
		background: #1a1a1a;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-save:hover:not(:disabled) {
		background: #333;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.btn-save:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-cancel {
		font-size: 14px;
		color: #888;
		text-decoration: none;
		padding: 10px 20px;
		border-radius: 10px;
		transition: all 0.15s;
	}

	.btn-cancel:hover {
		background: #f0ede8;
		color: #555;
	}

	@media (max-width: 500px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
