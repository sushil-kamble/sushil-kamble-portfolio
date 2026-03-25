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
	<AdminPageHeader title="About" description="Update your portfolio bio.">
		{#snippet icon()}
			<User class="size-4" />
		{/snippet}
	</AdminPageHeader>

	<Card.Root class="admin-surface">
		<Card.Content class="p-5">
			<form
				class="space-y-4"
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
						rows={10}
						placeholder="Write about yourself..."
						class="min-h-[200px] resize-y"
					/>
					<div class="text-muted-foreground flex items-center justify-between text-xs">
						<span>{charCount} characters</span>
						{#if isDirty}
							<Badge variant="secondary" class="rounded-md px-2 py-0.5 text-[10px]">Unsaved</Badge>
						{/if}
					</div>
				</Field.Field>

				{#if props.form?.error}
					<p class="text-destructive text-sm font-medium">{props.form.error}</p>
				{/if}

				<div class="flex justify-end">
					<Button type="submit" disabled={saving || !isDirty} class="h-9">
						{#if saving}
							<Loader2 class="size-3.5 animate-spin" />
							<span>Saving…</span>
						{:else if saved}
							<Check class="size-3.5" />
							<span>Saved</span>
						{:else}
							<Save class="size-3.5" />
							<span>Save changes</span>
						{/if}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</section>
