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
		<div class="admin-icon-shell size-10 rounded-xl">
			{@render icon()}
		</div>
	{/if}

	<div class="space-y-1">
		<h2 class="text-foreground text-sm font-semibold">{title}</h2>
		<p class="text-muted-foreground max-w-xs text-sm leading-relaxed">{description}</p>
	</div>

	{#if action}
		<div class="pt-1">{@render action()}</div>
	{/if}
</div>
