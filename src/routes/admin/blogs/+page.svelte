<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import {
		ArrowUpRight,
		Calendar,
		FileText,
		GripVertical,
		Loader2,
		Plus,
		Trash2
	} from 'lucide-svelte';
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
	<AdminPageHeader
		title="Blog posts"
		description={`Manage ${blogs.length} ${blogs.length === 1 ? 'post' : 'posts'}, open any card to edit, and drag posts to reshape the publishing order.`}
	>
		{#snippet icon()}
			<FileText class="size-5" />
		{/snippet}
		{#snippet actions()}
			<Button href="/admin/blogs/new" size="lg">
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
				<FileText class="size-6" />
			{/snippet}
			{#snippet action()}
				<Button href="/admin/blogs/new">
					<Plus class="size-4" />
					<span>Add post</span>
				</Button>
			{/snippet}
		</AdminEmptyState>
	{:else}
		<Card.Root class="admin-hero-surface overflow-hidden">
			<Card.Content class="relative grid gap-5 p-5 sm:grid-cols-[1.35fr_0.65fr] sm:p-6">
				<div class="space-y-3">
					<Badge
						variant="outline"
						class="rounded-full px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase"
					>
						Editorial Queue
					</Badge>
					<div class="space-y-2">
						<h2 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
							Treat the list like a publishing board
						</h2>
						<p class="text-muted-foreground max-w-2xl text-sm leading-6">
							Posts are now list-first instead of icon-first. Click a card to enter the editor, and
							drag it to decide what surfaces first in the feed.
						</p>
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-2">
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Posts</p>
						<p class="text-foreground mt-3 text-3xl font-semibold tracking-tight">{blogs.length}</p>
					</div>
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Ordering</p>
						<p class="text-foreground mt-3 text-lg font-semibold tracking-tight">
							Direct drag-and-drop
						</p>
					</div>
				</div>

				<div
					class="pointer-events-none absolute top-6 -right-12 size-40 rounded-full bg-rose-500/10 blur-3xl"
				></div>
				<div
					class="pointer-events-none absolute bottom-0 left-8 h-16 w-32 rounded-full bg-amber-500/10 blur-3xl"
				></div>
			</Card.Content>
		</Card.Root>

		<div class="admin-collection-stack">
			{#each blogs as blog, index (blog.id)}
				<Card.Root
					class={`admin-collection-card group ${dropTargetId === blog.id ? 'admin-collection-card-active' : ''} ${draggedId === blog.id ? 'opacity-70' : ''}`}
					role="link"
					tabindex={0}
					aria-label={`Open ${blog.title}`}
					onclick={() => openBlog(blog.id)}
					onkeydown={(event) => handleCardKeydown(event, blog.id)}
					ondragover={(event) => handleDragOver(event, blog.id)}
					ondragenter={(event) => handleDragOver(event, blog.id)}
					ondrop={(event) => handleDrop(event, blog.id)}
				>
					<div
						class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"
					></div>
					<div
						class="pointer-events-none absolute top-6 -right-8 size-24 rounded-full bg-rose-500/8 blur-3xl"
					></div>

					<Card.Content
						class="relative flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between"
					>
						<div class="min-w-0 flex-1 space-y-4">
							<div class="space-y-2">
								<div class="flex flex-wrap items-center gap-2">
									<Badge variant="outline" class="rounded-full px-2.5 py-1">
										Position {index + 1}
									</Badge>
									<Badge variant="secondary" class="rounded-full px-2.5 py-1">
										Order value {blog.ordering}
									</Badge>
									{#if blog.createdAt}
										<Badge variant="secondary" class="gap-1.5 rounded-full px-2.5 py-1">
											<Calendar class="size-3.5" />
											<span>{formatDate(blog.createdAt)}</span>
										</Badge>
									{/if}
								</div>
								<div class="space-y-1">
									<h2 class="text-foreground text-xl font-semibold tracking-tight">{blog.title}</h2>
									{#if blog.description}
										<p class="text-muted-foreground line-clamp-2 max-w-3xl text-sm leading-6">
											{blog.description}
										</p>
									{/if}
								</div>
							</div>

							<div class="flex flex-wrap items-center gap-2">
								{#each blog.tags.slice(0, 6) as tag (tag)}
									<Badge variant="secondary" class="rounded-full px-2.5 py-1">{tag}</Badge>
								{/each}
								{#if blog.tags.length > 6}
									<Badge variant="outline" class="rounded-full px-2.5 py-1">
										+{blog.tags.length - 6} more
									</Badge>
								{/if}
							</div>

							<div class="admin-collection-nav-hint">
								<span>Open editor</span>
								<ArrowUpRight class="size-4" />
							</div>
						</div>

						<div class="admin-collection-action-rail">
							<div class="admin-collection-meta lg:flex-col lg:items-end">
								<div class="admin-collection-meta-pill">
									<span>{blog.tags.length} tag{blog.tags.length === 1 ? '' : 's'}</span>
								</div>
								{#if reordering}
									<div class="admin-collection-meta-pill">
										<Loader2 class="size-3.5 animate-spin" />
										<span>Saving order</span>
									</div>
								{/if}
							</div>

							<div class="flex items-center gap-2 lg:justify-end">
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
									<GripVertical class="size-4" />
								</button>

								<AlertDialog.Root>
									<AlertDialog.Trigger
										class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
										onclick={(event) => event.stopPropagation()}
									>
										<Trash2 class="size-4" />
										<span class="sr-only">Delete {blog.title}</span>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Delete post</AlertDialog.Title>
											<AlertDialog.Description>
												This will permanently remove {blog.title} and its content.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<AlertDialog.Action
												variant="destructive"
												disabled={deletingId === blog.id}
												onclick={() => deleteBlog(blog.id)}
											>
												{deletingId === blog.id ? 'Deleting...' : 'Delete'}
											</AlertDialog.Action>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</section>
