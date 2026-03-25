<script lang="ts">
	import { goto } from '$app/navigation';
	import { FileText, Loader2, Save } from 'lucide-svelte';
	import AdminBackLink from '$lib/components/admin/AdminBackLink.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import type { PageData } from './$types';
	import TagInput from '$lib/components/admin/TagInput.svelte';
	import TipTapEditor from '$lib/components/admin/TipTapEditor.svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import * as Field from '$lib/components/admin/ui/field/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';
	import { Textarea } from '$lib/components/admin/ui/textarea/index.js';

	const { data }: { data: PageData } = $props();

	let saving = $state(false);
	let initialized = $state(false);
	let title = $state('');
	let description = $state('');
	let blogUrl = $state('');
	let githubUrl = $state('');
	let liveUrl = $state('');
	let ordering = $state(0);
	let tags = $state<string[]>([]);
	let content = $state('');

	$effect(() => {
		if (initialized) return;
		title = data.blog.title;
		description = data.blog.description;
		blogUrl = data.blog.blogUrl;
		githubUrl = data.blog.githubUrl;
		liveUrl = data.blog.liveUrl;
		ordering = data.blog.ordering;
		tags = [...data.blog.tags];
		content = data.blog.content;
		initialized = true;
	});

	async function handleSubmit() {
		if (!title.trim()) return;
		saving = true;
		try {
			const response = await fetch(`/admin/blogs/${data.blog.id}`, {
				method: 'PUT',
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
			if (response.ok) {
				await goto('/admin/blogs');
			}
		} finally {
			saving = false;
		}
	}
</script>

<section class="admin-page-narrow">
	<AdminBackLink href="/admin/blogs" label="Back to blog posts" />

	<AdminPageHeader
		title="Edit blog post"
		description="Update the post content, metadata, and links shown in the portfolio feed."
	>
		{#snippet icon()}
			<FileText class="size-5" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface">
		<Card.Content class="p-6 sm:p-8">
			<form
				class="space-y-6"
				onsubmit={(event) => {
					event.preventDefault();
					handleSubmit();
				}}
			>
				<div class="space-y-6">
					<Field.Field>
						<Field.Label for="title">Title</Field.Label>
						<Input id="title" type="text" bind:value={title} placeholder="Post title" required />
					</Field.Field>

					<Field.Field>
						<Field.Label for="description">Description</Field.Label>
						<Textarea
							id="description"
							bind:value={description}
							rows={3}
							placeholder="Brief summary of the post..."
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="blog-tags-label">Tags</Field.Label>
						<Field.Description
							>Use a few concise keywords for filtering and scanning.</Field.Description
						>
						<TagInput
							{tags}
							labelledBy="blog-tags-label"
							placeholder="Add tags..."
							onchange={(value) => (tags = value)}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="blog-content-label">Content</Field.Label>
						<Field.Description>Write in markdown using the editor controls below.</Field.Description
						>
						<TipTapEditor
							{content}
							labelledBy="blog-content-label"
							uploadPath="Blog"
							onchange={(value) => (content = value)}
						/>
					</Field.Field>

					<div class="admin-form-grid">
						<Field.Field>
							<Field.Label for="blogUrl">Blog URL</Field.Label>
							<Input id="blogUrl" type="url" bind:value={blogUrl} placeholder="https://..." />
						</Field.Field>

						<Field.Field>
							<Field.Label for="githubUrl">GitHub URL</Field.Label>
							<Input
								id="githubUrl"
								type="url"
								bind:value={githubUrl}
								placeholder="https://github.com/..."
							/>
						</Field.Field>
					</div>

					<div class="admin-form-grid">
						<Field.Field>
							<Field.Label for="liveUrl">Live URL</Field.Label>
							<Input id="liveUrl" type="url" bind:value={liveUrl} placeholder="https://..." />
						</Field.Field>

						<Field.Field>
							<Field.Label for="ordering">Ordering</Field.Label>
							<Input id="ordering" type="number" bind:value={ordering} class="md:max-w-32" />
						</Field.Field>
					</div>
				</div>

				<div
					class="border-border/70 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end"
				>
					<Button href="/admin/blogs" variant="outline" size="lg">Cancel</Button>
					<Button type="submit" size="lg" disabled={saving || !title.trim()}>
						{#if saving}
							<Loader2 class="size-4 animate-spin" />
							<span>Saving...</span>
						{:else}
							<Save class="size-4" />
							<span>Update post</span>
						{/if}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
