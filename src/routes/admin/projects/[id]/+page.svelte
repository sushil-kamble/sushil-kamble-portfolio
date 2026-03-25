<script lang="ts">
	import { goto } from '$app/navigation';
	import { FolderKanban, Loader2, Save } from 'lucide-svelte';
	import AdminBackLink from '$lib/components/admin/AdminBackLink.svelte';
	import OrderedTextListEditor from '$lib/components/admin/OrderedTextListEditor.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import type { PageData } from './$types';
	import ImageUpload from '$lib/components/admin/ImageUpload.svelte';
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
	let github = $state('');
	let direct = $state('');
	let stack = $state<string[]>([]);
	let features = $state<string[]>([]);
	let screenshots = $state<string[]>([]);

	function normalizeItems(items: string[]): string[] {
		return items.map((item) => item.trim()).filter(Boolean);
	}

	$effect(() => {
		if (initialized) return;
		title = data.project.title;
		description = data.project.description;
		github = data.project.github;
		direct = data.project.direct;
		stack = [...data.project.stack];
		features = [...data.project.features];
		screenshots = [...data.project.screenshots];
		initialized = true;
	});

	async function handleSubmit() {
		if (!title.trim()) return;
		saving = true;
		try {
			const response = await fetch(`/admin/projects/${data.project.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim(),
					github: github.trim(),
					direct: direct.trim(),
					stack: normalizeItems(stack),
					features: normalizeItems(features),
					screenshots
				})
			});
			if (response.ok) {
				await goto('/admin/projects');
			}
		} finally {
			saving = false;
		}
	}
</script>

<section class="admin-page-narrow">
	<AdminBackLink href="/admin/projects" label="Back to projects" />

	<AdminPageHeader title="Edit project" description="Update this project's details.">
		{#snippet icon()}
			<FolderKanban class="size-4" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface overflow-visible">
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
						placeholder="Project name"
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
						placeholder="Brief description…"
					/>
				</Field.Field>

				<div class="admin-form-grid">
					<Field.Field>
						<Field.Label for="github">GitHub URL</Field.Label>
						<Input
							id="github"
							type="url"
							bind:value={github}
							placeholder="https://github.com/…"
							class="h-10"
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="direct">Live URL</Field.Label>
						<Input
							id="direct"
							type="url"
							bind:value={direct}
							placeholder="https://…"
							class="h-10"
						/>
					</Field.Field>
				</div>

				<Field.Field>
					<Field.Label for="project-stack-label">Tech stack</Field.Label>
					<Field.Description>Add technologies and drag to reorder.</Field.Description>
					<OrderedTextListEditor
						items={stack}
						labelledBy="project-stack-label"
						placeholder="Add a technology…"
						addLabel="Add technology"
						emptyTitle="No technologies added"
						emptyDescription="Build the stack as ordered badges."
						showTechBadges={true}
						onchange={(value) => (stack = value)}
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="project-features-label">Features</Field.Label>
					<Field.Description>Key features of the project.</Field.Description>
					<OrderedTextListEditor
						items={features}
						labelledBy="project-features-label"
						placeholder="Add a feature…"
						addLabel="Add feature"
						emptyTitle="No features added"
						emptyDescription="Add product or technical capabilities."
						showItemNumbers={false}
						onchange={(value) => (features = value)}
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="project-screenshots-label">Screenshots</Field.Label>
					<Field.Description>Upload visuals for this project.</Field.Description>
					<ImageUpload
						images={screenshots}
						labelledBy="project-screenshots-label"
						path="Projects"
						onchange={(value) => (screenshots = value)}
					/>
				</Field.Field>

				<div
					class="border-border flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end"
				>
					<Button href="/admin/projects" variant="outline">Cancel</Button>
					<Button type="submit" disabled={saving || !title.trim()}>
						{#if saving}
							<Loader2 class="size-3.5 animate-spin" />
							<span>Saving…</span>
						{:else}
							<Save class="size-3.5" />
							<span>Update project</span>
						{/if}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
