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
	<div class="flex items-start gap-4">
		{#if icon}
			<div class="admin-icon-shell">
				{@render icon()}
			</div>
		{/if}
		<div class="space-y-1">
			<h1 class="admin-title">{title}</h1>
			{#if description}
				<p class="admin-description">{description}</p>
			{/if}
		</div>
	</div>

	{#if actions}
		<div class="flex items-center gap-2">{@render actions()}</div>
	{/if}
</header>
