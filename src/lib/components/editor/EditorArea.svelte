<script lang="ts">
	import type { Snippet } from 'svelte';
	import DashboardCards from './DashboardCards.svelte';
	import TabBar from './TabBar.svelte';

	let { content }: { content: Snippet } = $props();
</script>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
	<DashboardCards />
	<TabBar />
	<div class="flex-1 overflow-y-auto p-4 md:p-6" data-content-area>
		{@render content()}
	</div>
</div>
