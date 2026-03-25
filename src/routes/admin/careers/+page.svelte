<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Plus, Pencil, Trash2, Briefcase, MapPin, Calendar } from 'lucide-svelte';

	const { data } = $props();
</script>

<div class="careers-page">
	<div class="page-header">
		<div>
			<h1>Careers</h1>
			<p class="subtitle">
				{data.careers.length}
				{data.careers.length === 1 ? 'entry' : 'entries'}
			</p>
		</div>
		<a href={resolve('/admin/careers/new')} class="add-btn">
			<Plus size={18} />
			<span>Add Career</span>
		</a>
	</div>

	{#if data.careers.length === 0}
		<div class="empty-state">
			<div class="empty-icon">
				<Briefcase size={32} />
			</div>
			<p class="empty-title">No careers yet</p>
			<p class="empty-desc">Add your first career entry to get started.</p>
			<a href={resolve('/admin/careers/new')} class="add-btn" style="margin-top: 8px;">
				<Plus size={16} />
				<span>Add Career</span>
			</a>
		</div>
	{:else}
		<div class="careers-grid">
			{#each data.careers as career (career.id)}
				<div class="career-card">
					<div class="card-body">
						<div class="card-top">
							{#if career.logo}
								<img src={career.logo} alt="{career.company} logo" class="company-logo" />
							{:else}
								<div class="company-logo placeholder-logo">
									<Briefcase size={18} />
								</div>
							{/if}
							<div class="card-info">
								<h3 class="company-name">{career.company}</h3>
								{#if career.designation}
									<p class="designation">{career.designation}</p>
								{/if}
							</div>
						</div>

						<div class="card-meta">
							{#if career.location}
								<span class="meta-item">
									<MapPin size={13} />
									{career.location}
								</span>
							{/if}
							{#if career.start}
								<span class="meta-item">
									<Calendar size={13} />
									{career.start}{career.end ? ` - ${career.end}` : ' - Present'}
								</span>
							{/if}
						</div>

						{#if career.skills && career.skills.length > 0}
							<div class="skill-tags">
								{#each career.skills.slice(0, 4) as skill (skill)}
									<span class="skill-tag">{skill}</span>
								{/each}
								{#if career.skills.length > 4}
									<span class="skill-tag more">+{career.skills.length - 4}</span>
								{/if}
							</div>
						{/if}
					</div>

					<div class="card-actions">
						<a
							href={resolve('/admin/careers/[id]', { id: String(career.id) })}
							class="action-btn edit"
							aria-label="Edit {career.company}"
						>
							<Pencil size={15} />
						</a>
						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
						>
							<input type="hidden" name="id" value={career.id} />
							<button
								type="submit"
								class="action-btn delete"
								aria-label="Delete {career.company}"
								onclick={(e) => {
									if (!confirm(`Delete "${career.company}"?`)) {
										e.preventDefault();
									}
								}}
							>
								<Trash2 size={15} />
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.careers-page {
		max-width: 800px;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
	}

	.page-header h1 {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 2px;
	}

	.subtitle {
		color: #888;
		font-size: 13px;
		margin: 0;
	}

	.add-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 9px 16px;
		background: #1a1a1a;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.add-btn:hover {
		background: #333;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	/* ── Empty State ── */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48px 24px;
		background: white;
		border: 1px dashed #e0ddd8;
		border-radius: 12px;
		text-align: center;
	}

	.empty-icon {
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f3f0;
		border-radius: 14px;
		color: #999;
		margin-bottom: 12px;
	}

	.empty-title {
		font-size: 15px;
		font-weight: 600;
		margin: 0 0 4px;
	}

	.empty-desc {
		color: #888;
		font-size: 13px;
		margin: 0;
	}

	/* ── Cards Grid ── */
	.careers-grid {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.career-card {
		display: flex;
		align-items: stretch;
		background: white;
		border: 1px solid #e8e5e0;
		border-radius: 12px;
		transition: all 0.2s;
		overflow: hidden;
	}

	.career-card:hover {
		border-color: #d0cdc6;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.card-body {
		flex: 1;
		padding: 16px;
		min-width: 0;
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
	}

	.company-logo {
		width: 38px;
		height: 38px;
		border-radius: 8px;
		object-fit: contain;
		flex-shrink: 0;
		background: #f5f3f0;
	}

	.placeholder-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #aaa;
	}

	.card-info {
		min-width: 0;
	}

	.company-name {
		font-size: 15px;
		font-weight: 650;
		margin: 0;
		letter-spacing: -0.01em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.designation {
		font-size: 13px;
		color: #666;
		margin: 1px 0 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 8px;
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #888;
	}

	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}

	.skill-tag {
		padding: 3px 8px;
		background: #f0ede8;
		border-radius: 5px;
		font-size: 11px;
		font-weight: 500;
		color: #555;
	}

	.skill-tag.more {
		background: #e8e5e0;
		color: #777;
	}

	/* ── Card Actions ── */
	.card-actions {
		display: flex;
		flex-direction: column;
		border-left: 1px solid #e8e5e0;
		flex-shrink: 0;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		flex: 1;
		border: none;
		background: none;
		cursor: pointer;
		color: #999;
		transition: all 0.15s;
		text-decoration: none;
	}

	.card-actions form {
		display: flex;
		flex: 1;
	}

	.card-actions form .action-btn {
		width: 44px;
	}

	.action-btn.edit:hover {
		background: #f5f3f0;
		color: #1a1a1a;
	}

	.action-btn.delete {
		border-top: 1px solid #e8e5e0;
	}

	.action-btn.delete:hover {
		background: #fef2f2;
		color: #dc2626;
	}

	@media (min-width: 640px) {
		.card-top {
			margin-bottom: 8px;
		}
	}
</style>
