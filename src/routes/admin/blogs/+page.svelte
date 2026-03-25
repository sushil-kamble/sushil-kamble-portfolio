<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Pencil, Trash2, FileText, Calendar } from 'lucide-svelte';

	const { data } = $props();

	function formatDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		} catch {
			return iso;
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<div>
			<h1>Blog Posts</h1>
			<p class="subtitle">{data.blogs.length} post{data.blogs.length !== 1 ? 's' : ''}</p>
		</div>
		<a href="/admin/blogs/new" class="btn-primary">
			<Plus size={16} />
			Add Post
		</a>
	</div>

	{#if data.blogs.length === 0}
		<div class="empty-state">
			<FileText size={40} strokeWidth={1.2} />
			<p>No blog posts yet</p>
			<a href="/admin/blogs/new" class="btn-primary">Write your first post</a>
		</div>
	{:else}
		<div class="cards">
			{#each data.blogs as blog (blog.id)}
				<div class="card">
					<div class="card-body">
						<div class="card-content">
							<div class="card-top">
								<h3 class="card-title">{blog.title}</h3>
								<span class="card-order">#{blog.ordering}</span>
							</div>
							{#if blog.description}
								<p class="card-desc">
									{blog.description.length > 140
										? blog.description.slice(0, 140) + '...'
										: blog.description}
								</p>
							{/if}
							<div class="card-meta">
								{#if blog.createdAt}
									<span class="card-date">
										<Calendar size={12} />
										{formatDate(blog.createdAt)}
									</span>
								{/if}
								{#if blog.tags.length > 0}
									<div class="card-tags">
										{#each blog.tags.slice(0, 4) as tag (tag)}
											<span class="tag">{tag}</span>
										{/each}
										{#if blog.tags.length > 4}
											<span class="tag tag-more">+{blog.tags.length - 4}</span>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					</div>
					<div class="card-actions">
						<a href="/admin/blogs/{blog.id}" class="btn-icon" title="Edit">
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
							<input type="hidden" name="id" value={blog.id} />
							<button
								type="submit"
								class="btn-icon btn-danger"
								title="Delete"
								onclick={(e) => {
									if (!confirm('Delete this blog post?')) e.preventDefault();
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
		flex: 1;
		min-width: 0;
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

	.card-meta {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 8px;
		flex-wrap: wrap;
	}

	.card-date {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #aaa;
		font-weight: 500;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
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
</style>
