<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		icon?: Snippet;
		action?: Snippet;
	}

	let { title, description, icon, action }: Props = $props();
</script>

<div class="admin-empty">
	{#if icon}
		<div class="admin-icon-shell size-14 rounded-[1.25rem]">
			{@render icon()}
		</div>
	{/if}

	<div class="space-y-1.5">
		<h2 class="text-foreground text-lg font-semibold tracking-tight">{title}</h2>
		<p class="text-muted-foreground max-w-md text-sm leading-6">{description}</p>
	</div>

	{#if action}
		<div class="pt-2">{@render action()}</div>
	{/if}
</div>
