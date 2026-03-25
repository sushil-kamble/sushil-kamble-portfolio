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
	let ordering = $state(0);
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
		ordering = data.project.ordering;
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
					ordering,
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

	<AdminPageHeader
		title="Edit project"
		description="Update the portfolio presentation, ordering, links, and screenshots for this project."
	>
		{#snippet icon()}
			<FolderKanban class="size-5" />
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
						<Input id="title" type="text" bind:value={title} placeholder="Project name" required />
					</Field.Field>

					<Field.Field>
						<Field.Label for="description">Description</Field.Label>
						<Textarea
							id="description"
							bind:value={description}
							rows={4}
							placeholder="Brief description of the project..."
						/>
					</Field.Field>

					<div class="admin-form-grid">
						<Field.Field>
							<Field.Label for="github">GitHub URL</Field.Label>
							<Input
								id="github"
								type="url"
								bind:value={github}
								placeholder="https://github.com/..."
							/>
						</Field.Field>

						<Field.Field>
							<Field.Label for="direct">Live URL</Field.Label>
							<Input id="direct" type="url" bind:value={direct} placeholder="https://..." />
						</Field.Field>
					</div>

					<Field.Field>
						<Field.Label for="ordering">Ordering</Field.Label>
						<Input id="ordering" type="number" bind:value={ordering} class="md:max-w-32" />
					</Field.Field>

					<Field.Field>
						<Field.Label for="project-stack-label">Tech stack</Field.Label>
						<Field.Description
							>These use the same badge source as the public portfolio. Drag them into the exact
							order you want shown.</Field.Description
						>
						<OrderedTextListEditor
							items={stack}
							labelledBy="project-stack-label"
							placeholder="Add a technology..."
							addLabel="Add technology"
							emptyTitle="No technologies added yet"
							emptyDescription="Build the stack as an ordered set of portfolio badges instead of a plain tag list."
							showTechBadges={true}
							onchange={(value) => (stack = value)}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="project-features-label">Features</Field.Label>
						<Field.Description
							>Each feature can be edited individually and reordered to shape the story of the
							project.</Field.Description
						>
						<OrderedTextListEditor
							items={features}
							labelledBy="project-features-label"
							placeholder="Add a feature..."
							addLabel="Add feature"
							emptyTitle="No features added yet"
							emptyDescription="Use clear, one-line feature statements and arrange them from strongest to least critical."
							onchange={(value) => (features = value)}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="project-screenshots-label">Screenshots</Field.Label>
						<Field.Description>Upload a few visuals to represent the project.</Field.Description>
						<ImageUpload
							images={screenshots}
							labelledBy="project-screenshots-label"
							path="Projects"
							onchange={(value) => (screenshots = value)}
						/>
					</Field.Field>
				</div>

				<div
					class="border-border/70 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end"
				>
					<Button href="/admin/projects" variant="outline" size="lg">Cancel</Button>
					<Button type="submit" size="lg" disabled={saving || !title.trim()}>
						{#if saving}
							<Loader2 class="size-4 animate-spin" />
							<span>Saving...</span>
						{:else}
							<Save class="size-4" />
							<span>Update project</span>
						{/if}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
