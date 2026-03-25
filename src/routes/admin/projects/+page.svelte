<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Pencil, Trash2, FolderKanban, ExternalLink, Github } from 'lucide-svelte';

	const { data } = $props();
</script>

<div class="page">
	<div class="page-header">
		<div>
			<h1>Projects</h1>
			<p class="subtitle">{data.projects.length} project{data.projects.length !== 1 ? 's' : ''}</p>
		</div>
		<a href="/admin/projects/new" class="btn-primary">
			<Plus size={16} />
			Add Project
		</a>
	</div>

	{#if data.projects.length === 0}
		<div class="empty-state">
			<FolderKanban size={40} strokeWidth={1.2} />
			<p>No projects yet</p>
			<a href="/admin/projects/new" class="btn-primary">Add your first project</a>
		</div>
	{:else}
		<div class="cards">
			{#each data.projects as project (project.id)}
				<div class="card">
					<div class="card-body">
						{#if project.screenshots.length > 0}
							<div class="card-thumb">
								<img src={project.screenshots[0]} alt={project.title} />
							</div>
						{/if}
						<div class="card-content">
							<div class="card-top">
								<h3 class="card-title">{project.title}</h3>
								<span class="card-order">#{project.ordering}</span>
							</div>
							{#if project.description}
								<p class="card-desc">
									{project.description.length > 120
										? project.description.slice(0, 120) + '...'
										: project.description}
								</p>
							{/if}
							{#if project.stack.length > 0}
								<div class="card-tags">
									{#each project.stack.slice(0, 5) as tech (tech)}
										<span class="tag">{tech}</span>
									{/each}
									{#if project.stack.length > 5}
										<span class="tag tag-more">+{project.stack.length - 5}</span>
									{/if}
								</div>
							{/if}
							<div class="card-links">
								{#if project.github}
									<a
										href={project.github}
										target="_blank"
										rel="noopener"
										class="card-link"
										title="GitHub"
									>
										<Github size={14} />
									</a>
								{/if}
								{#if project.direct}
									<a
										href={project.direct}
										target="_blank"
										rel="noopener"
										class="card-link"
										title="Live site"
									>
										<ExternalLink size={14} />
									</a>
								{/if}
							</div>
						</div>
					</div>
					<div class="card-actions">
						<a href="/admin/projects/{project.id}" class="btn-icon" title="Edit">
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
							<input type="hidden" name="id" value={project.id} />
							<button
								type="submit"
								class="btn-icon btn-danger"
								title="Delete"
								onclick={(e) => {
									if (!confirm('Delete this project?')) e.preventDefault();
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
	.page {
		max-width: 900px;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 28px;
	}

	.page-header h1 {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 4px;
	}

	.subtitle {
		color: #888;
		font-size: 14px;
		margin: 0;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 20px;
		background: #1a1a1a;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.btn-primary:hover {
		background: #333;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 60px 20px;
		color: #aaa;
		text-align: center;
	}

	.empty-state p {
		font-size: 15px;
		margin: 0;
		color: #888;
	}

	/* Cards */
	.cards {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px;
		background: white;
		border: 1px solid #e8e5e0;
		border-radius: 12px;
		transition: all 0.2s;
	}

	.card:hover {
		border-color: #d0cdc6;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.card-body {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: 1;
		min-width: 0;
	}

	.card-thumb {
		width: 64px;
		height: 48px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #e8e5e0;
		flex-shrink: 0;
	}

	.card-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-content {
		flex: 1;
		min-width: 0;
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.card-title {
		font-size: 15px;
		font-weight: 600;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.card-order {
		font-size: 11px;
		color: #aaa;
		font-weight: 500;
	}

	.card-desc {
		font-size: 13px;
		color: #888;
		margin: 4px 0 0;
		line-height: 1.4;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 8px;
	}

	.tag {
		display: inline-block;
		padding: 2px 8px;
		background: #f0ede8;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 500;
		color: #555;
	}

	.tag-more {
		background: #e8e5e0;
		color: #888;
	}

	.card-links {
		display: flex;
		gap: 6px;
		margin-top: 8px;
	}

	.card-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		color: #888;
		transition: all 0.15s;
		text-decoration: none;
	}

	.card-link:hover {
		background: #f0ede8;
		color: #1a1a1a;
	}

	.card-actions {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: 1px solid #e8e5e0;
		background: white;
		border-radius: 8px;
		cursor: pointer;
		color: #888;
		transition: all 0.15s;
		text-decoration: none;
		padding: 0;
	}

	.btn-icon:hover {
		border-color: #d0cdc6;
		color: #1a1a1a;
		background: #fafaf9;
	}

	.btn-danger:hover {
		border-color: #fecaca;
		background: #fef2f2;
		color: #dc2626;
	}

	@media (max-width: 640px) {
		.card-thumb {
			display: none;
		}

		.card-links {
			display: none;
		}
	}
</style>
