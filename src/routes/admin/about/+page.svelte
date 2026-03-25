<script lang="ts">
	import { enhance } from '$app/forms';
	import { Check, Loader2, Save, User } from 'lucide-svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import * as Field from '$lib/components/admin/ui/field/index.js';
	import { Textarea } from '$lib/components/admin/ui/textarea/index.js';

	const props = $props();

	let bio = $state(props.data.about);
	let saving = $state(false);
	let saved = $state(false);

	const charCount = $derived(bio.length);
	const isDirty = $derived(bio !== props.data.about);
</script>

<section class="admin-page-narrow">
	<AdminPageHeader
		title="About"
		description="Update the summary that introduces you across the portfolio."
	>
		{#snippet icon()}
			<User class="size-5" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface">
		<Card.Content class="p-6 sm:p-8">
			<form
				class="space-y-5"
				method="POST"
				use:enhance={() => {
					saving = true;
					saved = false;
					return async ({ update }) => {
						await update();
						saving = false;
						saved = true;
						setTimeout(() => (saved = false), 2500);
					};
				}}
			>
				<Field.Field>
					<Field.Label for="about-textarea">Bio</Field.Label>
					<Textarea
						id="about-textarea"
						name="about"
						bind:value={bio}
						rows={12}
						placeholder="Write about yourself..."
					/>
					<div
						class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs"
					>
						<span>{charCount} characters</span>
						{#if isDirty}
							<Badge variant="secondary" class="rounded-full px-2.5 py-1">Unsaved changes</Badge>
						{/if}
					</div>
				</Field.Field>

				{#if props.form?.error}
					<p class="text-destructive text-sm font-medium">{props.form.error}</p>
				{/if}

				<div class="flex justify-end">
					<Button type="submit" size="lg" disabled={saving || !isDirty}>
						{#if saving}
							<Loader2 class="size-4 animate-spin" />
							<span>Saving...</span>
						{:else if saved}
							<Check class="size-4" />
							<span>Saved</span>
						{:else}
							<Save class="size-4" />
							<span>Save changes</span>
						{/if}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
