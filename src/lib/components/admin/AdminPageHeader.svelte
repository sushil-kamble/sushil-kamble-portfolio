<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: Snippet;
		actions?: Snippet;
	}

	let { title, description, icon, actions }: Props = $props();
</script>

<header class="admin-header">
	<div class="min-w-0 space-y-1">
		<div class="flex items-center gap-2.5">
			{#if icon}
				<div class="admin-icon-shell">
					{@render icon()}
				</div>
			{/if}
			<h1 class="admin-title">{title}</h1>
		</div>
		{#if description}
			<p class="admin-description">{description}</p>
		{/if}
	</div>

	{#if actions}
		<div class="flex shrink-0 items-center gap-2">{@render actions()}</div>
	{/if}
</header>
