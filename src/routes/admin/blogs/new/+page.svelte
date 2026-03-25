<script lang="ts">
	import { goto } from '$app/navigation';
	import { FileText, Loader2, Save } from 'lucide-svelte';
	import AdminBackLink from '$lib/components/admin/AdminBackLink.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import TagInput from '$lib/components/admin/TagInput.svelte';
	import TipTapEditor from '$lib/components/admin/TipTapEditor.svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import * as Field from '$lib/components/admin/ui/field/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';
	import { Textarea } from '$lib/components/admin/ui/textarea/index.js';

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
			const response = await fetch('/admin/blogs/new', {
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
			if (response.ok) {
				await goto('/admin/blogs');
			}
		} finally {
			saving = false;
		}
	}
</script>

<section class="admin-page-narrow">
	<AdminBackLink href="/admin/blogs" label="Back to posts" />

	<AdminPageHeader title="New blog post" description="Compose a new post and publish it.">
		{#snippet icon()}
			<FileText class="size-4" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface">
		<Card.Content class="p-5">
			<form
				class="space-y-5"
				onsubmit={(event) => {
					event.preventDefault();
					handleSubmit();
				}}
			>
				<Field.Field>
					<Field.Label for="title">Title</Field.Label>
					<Input
						id="title"
						type="text"
						bind:value={title}
						placeholder="Post title"
						required
						class="h-10"
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="description">Description</Field.Label>
					<Textarea
						id="description"
						bind:value={description}
						rows={3}
						placeholder="Brief summary of the post…"
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="new-blog-tags-label">Tags</Field.Label>
					<Field.Description>Press Enter or comma to add tags.</Field.Description>
					<TagInput
						{tags}
						labelledBy="new-blog-tags-label"
						placeholder="Add tags…"
						onchange={(value) => (tags = value)}
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="new-blog-content-label">Content</Field.Label>
					<TipTapEditor
						{content}
						labelledBy="new-blog-content-label"
						uploadPath="Blog"
						onchange={(value) => (content = value)}
					/>
				</Field.Field>

				<div class="admin-form-grid">
					<Field.Field>
						<Field.Label for="blogUrl">Blog URL</Field.Label>
						<Input
							id="blogUrl"
							type="url"
							bind:value={blogUrl}
							placeholder="https://…"
							class="h-10"
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="githubUrl">GitHub URL</Field.Label>
						<Input
							id="githubUrl"
							type="url"
							bind:value={githubUrl}
							placeholder="https://github.com/…"
							class="h-10"
						/>
					</Field.Field>
				</div>

				<div class="admin-form-grid">
					<Field.Field>
						<Field.Label for="liveUrl">Live URL</Field.Label>
						<Input
							id="liveUrl"
							type="url"
							bind:value={liveUrl}
							placeholder="https://…"
							class="h-10"
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="ordering">Order</Field.Label>
						<Input id="ordering" type="number" bind:value={ordering} class="h-10 sm:max-w-24" />
					</Field.Field>
				</div>

				<div
					class="border-border flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end"
				>
					<Button href="/admin/blogs" variant="outline">Cancel</Button>
					<Button type="submit" disabled={saving || !title.trim()}>
						{#if saving}
							<Loader2 class="size-3.5 animate-spin" />
							<span>Saving…</span>
						{:else}
							<Save class="size-3.5" />
							<span>Save post</span>
						{/if}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
