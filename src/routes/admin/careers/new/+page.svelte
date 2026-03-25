<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Briefcase } from 'lucide-svelte';
	import AdminBackLink from '$lib/components/admin/AdminBackLink.svelte';
	import OrderedTextListEditor from '$lib/components/admin/OrderedTextListEditor.svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import * as Field from '$lib/components/admin/ui/field/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';
	import { Textarea } from '$lib/components/admin/ui/textarea/index.js';

	let skills = $state<string[]>([]);
	let detailsList = $state<string[]>([]);

	function normalizeItems(items: string[]): string[] {
		return items.map((item) => item.trim()).filter(Boolean);
	}

	const skillsJson = $derived(JSON.stringify(normalizeItems(skills)));
	const detailsListJson = $derived(JSON.stringify(normalizeItems(detailsList)));
</script>

<section class="admin-page-narrow">
	<AdminBackLink href={resolve('/admin/careers')} label="Back to careers" />

	<AdminPageHeader title="Add career" description="Create a new work history entry.">
		{#snippet icon()}
			<Briefcase class="size-4" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface">
		<Card.Content class="p-5">
			<form class="space-y-5" method="POST" use:enhance>
				<Field.Field>
					<Field.Label for="company">Company</Field.Label>
					<Input id="company" name="company" required placeholder="Company name" class="h-10" />
				</Field.Field>

				<div class="admin-form-grid">
					<Field.Field>
						<Field.Label for="designation">Designation</Field.Label>
						<Input
							id="designation"
							name="designation"
							placeholder="e.g. Senior Engineer"
							class="h-10"
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="location">Location</Field.Label>
						<Input id="location" name="location" placeholder="e.g. Bengaluru, India" class="h-10" />
					</Field.Field>
				</div>

				<div class="admin-form-grid">
					<Field.Field>
						<Field.Label for="start">Start</Field.Label>
						<Input id="start" name="start" placeholder="e.g. Jan 2023" class="h-10" />
					</Field.Field>

					<Field.Field>
						<Field.Label for="end">End</Field.Label>
						<Input id="end" name="end" placeholder="e.g. Present" class="h-10" />
					</Field.Field>
				</div>

				<Field.Field>
					<Field.Label for="details">Summary</Field.Label>
					<Textarea
						id="details"
						name="details"
						rows={3}
						placeholder="Brief description of the role"
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="detailsList-input">Highlights</Field.Label>
					<Field.Description>Add accomplishments or responsibilities.</Field.Description>
					<OrderedTextListEditor
						items={detailsList}
						labelledBy="detailsList-input"
						placeholder="Add a highlight…"
						addLabel="Add highlight"
						emptyTitle="No highlights added"
						emptyDescription="Add specific wins or responsibilities for this role."
						onchange={(value) => (detailsList = value)}
					/>
					<input type="hidden" id="detailsList-input" name="detailsList" value={detailsListJson} />
				</Field.Field>

				<Field.Field>
					<Field.Label for="skills-input">Skills</Field.Label>
					<Field.Description>Technologies associated with this role.</Field.Description>
					<OrderedTextListEditor
						items={skills}
						labelledBy="skills-input"
						placeholder="Add a skill…"
						addLabel="Add skill"
						emptyTitle="No skills added"
						emptyDescription="Add relevant technologies."
						showTechBadges={true}
						onchange={(value) => (skills = value)}
					/>
					<input type="hidden" id="skills-input" name="skills" value={skillsJson} />
				</Field.Field>

				<div class="admin-form-grid">
					<Field.Field>
						<Field.Label for="logo">Logo URL</Field.Label>
						<Input id="logo" name="logo" type="url" placeholder="https://…" class="h-10" />
					</Field.Field>

					<Field.Field>
						<Field.Label for="link">Link URL</Field.Label>
						<Input id="link" name="link" type="url" placeholder="https://…" class="h-10" />
					</Field.Field>
				</div>

				<div
					class="border-border flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end"
				>
					<Button href={resolve('/admin/careers')} variant="outline">Cancel</Button>
					<Button type="submit">Save career</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
