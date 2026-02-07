<script lang="ts">
	import { Info, AlertTriangle } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let {
		type = 'info',
		children
	}: {
		type?: 'info' | 'warning';
		children: Snippet;
	} = $props();

	const styles = {
		info: 'border-vsc-blue/30 bg-vsc-blue/5',
		warning: 'border-vsc-yellow/30 bg-vsc-yellow/5'
	};
</script>

<div class="mt-4 rounded-md border-l-4 p-3 {styles[type]}">
	<div class="flex items-start gap-2">
		{#if type === 'warning'}
			<AlertTriangle size={16} class="mt-0.5 shrink-0 text-vsc-yellow" />
		{:else}
			<Info size={16} class="mt-0.5 shrink-0 text-vsc-blue" />
		{/if}
		<div class="text-sm text-vsc-text">
			{@render children()}
		</div>
	</div>
</div>
