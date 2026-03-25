<script lang="ts">
	import { enhance } from '$app/forms';
	import { User, Save, Loader2, Check } from 'lucide-svelte';

	const props = $props();

	let bio = $state(props.data.about);
	let saving = $state(false);
	let saved = $state(false);

	const charCount = $derived(bio.length);
	const isDirty = $derived(bio !== props.data.about);
</script>

<div class="page">
	<header class="page-header">
		<div class="page-header-icon">
			<User size={20} strokeWidth={1.8} />
		</div>
		<div>
			<h1>About</h1>
			<p class="page-subtitle">Your bio and personal description</p>
		</div>
	</header>

	<div class="card">
		<form
			method="POST"
			use:enhance={() => {
				saving = true;
				saved = false;
				return async ({ update }) => {
					await update();
					saving = false;
					saved = true;
					setTimeout(() => (saved = false), 2500);
				};
			}}
		>
			<div class="form-group">
				<label for="about-textarea">Bio</label>
				<textarea
					id="about-textarea"
					name="about"
					bind:value={bio}
					rows={10}
					placeholder="Write about yourself..."
				></textarea>
				<div class="textarea-footer">
					<span class="char-count">{charCount} characters</span>
					{#if isDirty}
						<span class="unsaved-badge">Unsaved changes</span>
					{/if}
				</div>
			</div>

			{#if props.form?.error}
				<p class="error-msg">{props.form.error}</p>
			{/if}

			<div class="form-actions">
				<button type="submit" class="save-btn" disabled={saving || !isDirty}>
					{#if saving}
						<Loader2 size={16} class="spin" />
						<span>Saving...</span>
					{:else if saved}
						<Check size={16} />
						<span>Saved</span>
					{:else}
						<Save size={16} />
						<span>Save changes</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.page {
		max-width: 720px;
	}

	/* ── Page Header ── */
	.page-header {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 24px;
	}

	.page-header-icon {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f0ede8;
		border-radius: 10px;
		color: #555;
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

	/* ── Card ── */
	.card {
		background: white;
		border: 1px solid #e8e5e0;
		border-radius: 12px;
		padding: 24px;
	}

	/* ── Form ── */
	.form-group {
		margin-bottom: 20px;
	}

	.form-group label {
		display: block;
		font-size: 13px;
		font-weight: 600;
		color: #555;
		margin-bottom: 8px;
		letter-spacing: -0.005em;
	}

	textarea {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		font-size: 14px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		line-height: 1.7;
		background: #fafaf9;
		color: #1a1a1a;
		outline: none;
		transition: all 0.2s;
		resize: vertical;
		min-height: 200px;
		box-sizing: border-box;
	}

	textarea:focus {
		border-color: #1a1a1a;
		background: white;
		box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
	}

	textarea::placeholder {
		color: #aaa;
	}

	.textarea-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 8px;
	}

	.char-count {
		font-size: 12px;
		color: #aaa;
	}

	.unsaved-badge {
		font-size: 12px;
		color: #d97706;
		font-weight: 500;
	}

	.error-msg {
		font-size: 13px;
		color: #dc2626;
		margin: 0 0 16px;
	}

	/* ── Actions ── */
	.form-actions {
		display: flex;
		justify-content: flex-end;
	}

	.save-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px;
		border: none;
		border-radius: 10px;
		background: #1a1a1a;
		color: white;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		letter-spacing: -0.005em;
	}

	.save-btn:hover:not(:disabled) {
		background: #333;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.save-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (min-width: 768px) {
		.card {
			padding: 32px;
		}
	}
</style>
