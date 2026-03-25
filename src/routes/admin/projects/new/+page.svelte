<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import TagInput from '$lib/components/admin/TagInput.svelte';
	import ImageUpload from '$lib/components/admin/ImageUpload.svelte';

	let saving = $state(false);
	let title = $state('');
	let description = $state('');
	let github = $state('');
	let direct = $state('');
	let ordering = $state(0);
	let stack = $state<string[]>([]);
	let features = $state<string[]>([]);
	let screenshots = $state<string[]>([]);

	async function handleSubmit() {
		if (!title.trim()) return;
		saving = true;
		try {
			const res = await fetch('/admin/projects/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim(),
					github: github.trim(),
					direct: direct.trim(),
					ordering,
					stack,
					features,
					screenshots
				})
			});
			if (res.ok) {
				await goto('/admin/projects');
			}
		} finally {
			saving = false;
		}
	}
</script>

<div class="page">
	<a href="/admin/projects" class="back-link">
		<ArrowLeft size={16} />
		Back to Projects
	</a>

	<h1>New Project</h1>

	<form
		class="form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<div class="form-group">
			<label for="title">Title</label>
			<input id="title" type="text" bind:value={title} placeholder="Project name" required />
		</div>

		<div class="form-group">
			<label for="description">Description</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder="Brief description of the project..."
				rows="4"
			></textarea>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="github">GitHub URL</label>
				<input id="github" type="url" bind:value={github} placeholder="https://github.com/..." />
			</div>
			<div class="form-group">
				<label for="direct">Live URL</label>
				<input id="direct" type="url" bind:value={direct} placeholder="https://..." />
			</div>
		</div>

		<div class="form-group">
			<label for="ordering">Order</label>
			<input id="ordering" type="number" bind:value={ordering} class="input-sm" />
		</div>

		<div class="form-group">
			<p class="field-label" id="new-project-stack-label">Tech Stack</p>
			<TagInput
				tags={stack}
				labelledBy="new-project-stack-label"
				placeholder="Add technologies..."
				onchange={(v) => (stack = v)}
			/>
		</div>

		<div class="form-group">
			<p class="field-label" id="new-project-features-label">Features</p>
			<TagInput
				tags={features}
				labelledBy="new-project-features-label"
				placeholder="Add features..."
				onchange={(v) => (features = v)}
			/>
		</div>

		<div class="form-group">
			<p class="field-label" id="new-project-screenshots-label">Screenshots</p>
			<ImageUpload
				images={screenshots}
				labelledBy="new-project-screenshots-label"
				path="Projects"
				onchange={(v) => (screenshots = v)}
			/>
		</div>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving || !title.trim()}>
				{saving ? 'Saving...' : 'Save Project'}
			</button>
			<a href="/admin/projects" class="btn-cancel">Cancel</a>
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

	.input-sm {
		max-width: 120px;
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
