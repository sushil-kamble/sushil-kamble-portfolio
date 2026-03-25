<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Briefcase, Save } from 'lucide-svelte';
	import AdminBackLink from '$lib/components/admin/AdminBackLink.svelte';
	import OrderedTextListEditor from '$lib/components/admin/OrderedTextListEditor.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import * as Field from '$lib/components/admin/ui/field/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';
	import { Textarea } from '$lib/components/admin/ui/textarea/index.js';

	const props = $props();

	let skills = $state<string[]>(props.data.career.skills ?? []);
	let detailsList = $state<string[]>(props.data.career.detailsList ?? []);

	function normalizeItems(items: string[]): string[] {
		return items.map((item) => item.trim()).filter(Boolean);
	}

	const skillsJson = $derived(JSON.stringify(normalizeItems(skills)));
	const detailsListJson = $derived(JSON.stringify(normalizeItems(detailsList)));
</script>

<section class="admin-page-narrow">
	<AdminBackLink href={resolve('/admin/careers')} label="Back to careers" />

	<AdminPageHeader
		title="Edit career"
		description="Update role details, links, and the supporting bullet points shown on the portfolio."
	>
		{#snippet icon()}
			<Briefcase class="size-5" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface">
		<Card.Content class="p-6 sm:p-8">
			<form class="space-y-6" method="POST" use:enhance>
				<div class="admin-form-grid">
					<Field.Field class="admin-form-span">
						<Field.Label for="company">Company</Field.Label>
						<Input
							id="company"
							name="company"
							required
							placeholder="Company name"
							value={props.data.career.company}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="designation">Designation</Field.Label>
						<Input
							id="designation"
							name="designation"
							placeholder="e.g. Senior Engineer"
							value={props.data.career.designation}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="location">Location</Field.Label>
						<Input
							id="location"
							name="location"
							placeholder="e.g. Bengaluru, India"
							value={props.data.career.location}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="start">Start</Field.Label>
						<Input
							id="start"
							name="start"
							placeholder="e.g. Jan 2023"
							value={props.data.career.start}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="end">End</Field.Label>
						<Input id="end" name="end" placeholder="e.g. Present" value={props.data.career.end} />
					</Field.Field>

					<Field.Field class="admin-form-span">
						<Field.Label for="details">Summary</Field.Label>
						<Textarea
							id="details"
							name="details"
							rows={4}
							value={props.data.career.details}
							placeholder="Brief description of the role"
						/>
					</Field.Field>

					<Field.Field class="admin-form-span">
						<Field.Label for="detailsList-input">Highlights</Field.Label>
						<Field.Description>
							Add bullet points that capture specific wins or responsibilities, and drag them into
							the order you want shown.
						</Field.Description>
						<OrderedTextListEditor
							items={detailsList}
							labelledBy="detailsList-input"
							placeholder="Add a highlight..."
							addLabel="Add highlight"
							emptyTitle="No highlights added yet"
							emptyDescription="Write one accomplishment or responsibility per line, then reorder them so the strongest points appear first."
							onchange={(value) => (detailsList = value)}
						/>
						<input
							type="hidden"
							id="detailsList-input"
							name="detailsList"
							value={detailsListJson}
						/>
					</Field.Field>

					<Field.Field class="admin-form-span">
						<Field.Label for="skills-input">Skills</Field.Label>
						<Field.Description
							>These use the same badge treatment as the public career section. Edit and reorder
							them directly here.</Field.Description
						>
						<OrderedTextListEditor
							items={skills}
							labelledBy="skills-input"
							placeholder="Add a skill..."
							addLabel="Add skill"
							emptyTitle="No skills added yet"
							emptyDescription="Use the badges to emphasize the technologies or strengths associated with this role."
							showTechBadges={true}
							onchange={(value) => (skills = value)}
						/>
						<input type="hidden" id="skills-input" name="skills" value={skillsJson} />
					</Field.Field>

					<Field.Field>
						<Field.Label for="logo">Logo URL</Field.Label>
						<Input
							id="logo"
							name="logo"
							type="url"
							placeholder="https://..."
							value={props.data.career.logo}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="link">Link URL</Field.Label>
						<Input
							id="link"
							name="link"
							type="url"
							placeholder="https://..."
							value={props.data.career.link}
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="ordering">Ordering</Field.Label>
						<Input
							id="ordering"
							name="ordering"
							type="number"
							value={props.data.career.ordering}
							class="md:max-w-32"
						/>
					</Field.Field>
				</div>

				<div
					class="border-border/70 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end"
				>
					<Button href={resolve('/admin/careers')} variant="outline" size="lg">Cancel</Button>
					<Button type="submit" size="lg">
						<Save class="size-4" />
						<span>Update career</span>
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
