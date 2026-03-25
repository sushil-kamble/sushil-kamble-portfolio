<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { FileText, GripVertical, Loader2, Plus, Trash2 } from 'lucide-svelte';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import * as AlertDialog from '$lib/components/admin/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button, buttonVariants } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import type { PageData } from './$types';

	type Blog = PageData['blogs'][number];

	const props: { data: PageData } = $props();

	let blogs = $derived.by<Blog[]>(() =>
		props.data.blogs.map((blog) => ({
			...blog,
			tags: [...blog.tags]
		}))
	);
	let deletingId = $state<number | null>(null);
	let draggedId = $state<number | null>(null);
	let dropTargetId = $state<number | null>(null);
	let reordering = $state(false);

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

	function openBlog(id: number) {
		void goto(`/admin/blogs/${id}`);
	}

	function handleCardKeydown(event: KeyboardEvent, id: number) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		openBlog(id);
	}

	function reorderItems(items: Blog[], sourceId: number, targetId: number) {
		const sourceIndex = items.findIndex((item) => item.id === sourceId);
		const targetIndex = items.findIndex((item) => item.id === targetId);

		if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
			return items;
		}

		const reordered = [...items];
		const [moved] = reordered.splice(sourceIndex, 1);
		reordered.splice(targetIndex, 0, moved);

		return reordered.map((item, ordering) => ({ ...item, ordering }));
	}

	async function persistOrder(nextBlogs: Blog[]) {
		reordering = true;

		const formData = new FormData();
		formData.set(
			'order',
			JSON.stringify(nextBlogs.map((blog, ordering) => ({ id: blog.id, ordering })))
		);

		try {
			await fetch('?/reorder', { method: 'POST', body: formData });
			await invalidateAll();
		} finally {
			reordering = false;
			draggedId = null;
			dropTargetId = null;
		}
	}

	function handleDragStart(event: DragEvent, id: number) {
		draggedId = id;
		event.dataTransfer?.setData('text/plain', String(id));
		event.dataTransfer!.effectAllowed = 'move';
	}

	function handleDragEnd() {
		draggedId = null;
		dropTargetId = null;
	}

	function handleDragOver(event: DragEvent, id: number) {
		if (draggedId === null || draggedId === id) return;
		event.preventDefault();
		dropTargetId = id;
	}

	async function handleDrop(event: DragEvent, targetId: number) {
		event.preventDefault();

		if (draggedId === null || draggedId === targetId || reordering) {
			dropTargetId = null;
			return;
		}

		const nextBlogs = reorderItems(blogs, draggedId, targetId);
		blogs = nextBlogs;
		await persistOrder(nextBlogs);
	}

	async function deleteBlog(id: number) {
		deletingId = id;
		const formData = new FormData();
		formData.set('id', String(id));
		await fetch('?/delete', { method: 'POST', body: formData });
		deletingId = null;
		await invalidateAll();
	}
</script>

<section class="admin-page-medium">
	<AdminPageHeader title="Blog posts" description="Drag to reorder, click to edit.">
		{#snippet icon()}
			<FileText class="size-4" />
		{/snippet}
		{#snippet actions()}
			<Button href="/admin/blogs/new">
				<Plus class="size-4" />
				<span>Add post</span>
			</Button>
		{/snippet}
	</AdminPageHeader>

	{#if blogs.length === 0}
		<AdminEmptyState
			title="No blog posts yet"
			description="Write the first post to start building your blog archive."
		>
			{#snippet icon()}
				<FileText class="size-5" />
			{/snippet}
			{#snippet action()}
				<Button href="/admin/blogs/new">
					<Plus class="size-4" />
					<span>Add post</span>
				</Button>
			{/snippet}
		</AdminEmptyState>
	{:else}
		<div class="admin-collection-stack">
			{#each blogs as blog, index (blog.id)}
				<Card.Root
					class={`admin-collection-card group cursor-pointer ${dropTargetId === blog.id ? 'admin-collection-card-active' : ''} ${draggedId === blog.id ? 'opacity-50' : ''}`}
					role="link"
					tabindex={0}
					aria-label={`Open ${blog.title}`}
					onclick={() => openBlog(blog.id)}
					onkeydown={(event) => handleCardKeydown(event, blog.id)}
					ondragover={(event) => handleDragOver(event, blog.id)}
					ondragenter={(event) => handleDragOver(event, blog.id)}
					ondrop={(event) => handleDrop(event, blog.id)}
				>
					<Card.Content class="flex items-center gap-3 p-3 sm:p-4">
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-1.5">
								<span class="text-muted-foreground text-xs tabular-nums">#{index + 1}</span>
								{#if blog.createdAt}
									<span class="text-muted-foreground text-xs">· {formatDate(blog.createdAt)}</span>
								{/if}
							</div>
							<h2 class="text-foreground mt-0.5 text-sm font-semibold">{blog.title}</h2>
							{#if blog.description}
								<p class="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{blog.description}</p>
							{/if}

							{#if blog.tags.length > 0}
								<div class="mt-2 flex flex-wrap gap-1">
									{#each blog.tags.slice(0, 4) as tag (tag)}
										<Badge variant="secondary" class="rounded-md px-1.5 py-0.5 text-[10px]"
											>{tag}</Badge
										>
									{/each}
									{#if blog.tags.length > 4}
										<Badge variant="outline" class="rounded-md px-1.5 py-0.5 text-[10px]">
											+{blog.tags.length - 4}
										</Badge>
									{/if}
								</div>
							{/if}
						</div>

						<div class="flex shrink-0 items-center gap-1.5">
							{#if reordering}
								<Loader2 class="text-muted-foreground size-3.5 animate-spin" />
							{/if}
							<button
								type="button"
								class="admin-collection-handle"
								draggable="true"
								aria-label={`Drag to reorder ${blog.title}`}
								title="Drag to reorder"
								ondragstart={(event) => handleDragStart(event, blog.id)}
								ondragend={handleDragEnd}
								onclick={(event) => event.stopPropagation()}
							>
								<GripVertical class="size-3.5" />
							</button>

							<AlertDialog.Root>
								<AlertDialog.Trigger
									class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
									onclick={(event) => event.stopPropagation()}
								>
									<Trash2 class="size-3.5" />
									<span class="sr-only">Delete {blog.title}</span>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Delete post</AlertDialog.Title>
										<AlertDialog.Description>
											This will permanently remove "{blog.title}".
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											variant="destructive"
											disabled={deletingId === blog.id}
											onclick={() => deleteBlog(blog.id)}
										>
											{deletingId === blog.id ? 'Deleting…' : 'Delete'}
										</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</section>
