<script lang="ts">
	import DashboardCards from './DashboardCards.svelte';
	import TabBar from './TabBar.svelte';
	import ContentArea from './ContentArea.svelte';
</script>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
	<DashboardCards />
	<TabBar />
	<ContentArea />
</div>
