<script lang="ts">
	import type { ComponentType } from 'svelte';

	let {
		label,
		value,
		icon: Icon
	}: {
		label: string;
		value: string;
		icon: ComponentType;
	} = $props();
</script>

<div
	class="group relative overflow-hidden rounded-lg border border-vsc-border bg-vsc-panel p-4 transition-all hover:border-vsc-blue/40"
>
	<div class="flex items-start justify-between">
		<div>
			<p class="text-[11px] font-medium tracking-wider text-vsc-text-muted uppercase">{label}</p>
			<p class="mt-1 text-xl font-bold text-vsc-text">{value}</p>
		</div>
		<div class="rounded-md bg-vsc-blue/10 p-2 text-vsc-blue">
			<Icon size={20} />
		</div>
	</div>
</div>
