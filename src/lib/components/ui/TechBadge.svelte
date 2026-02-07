<script lang="ts">
	import Badge from './Badge.svelte';

	let {
		name,
		variant = 'blue'
	}: {
		name: string;
		variant?: 'blue' | 'green' | 'purple' | 'orange' | 'yellow';
	} = $props();

	const hexMap: Record<string, string> = {
		blue: '264f78',
		green: '2d5016',
		purple: '6b2d6b',
		orange: '8b4513',
		yellow: '7d6608'
	};

	const logoKey = $derived(name.toLowerCase().replace(/[\s.]+/g, '-'));
	const encodedLabel = $derived(encodeURIComponent(name).replace(/-/g, '--'));
	const hex = $derived(hexMap[variant]);
	const badgeUrl = $derived(
		`https://img.shields.io/badge/${encodedLabel}-${hex}?logo=${logoKey}&logoColor=white&style=flat`
	);

	let failed = $state(false);
</script>

{#if failed}
	<Badge text={name} {variant} />
{:else}
	<img
		src={badgeUrl}
		alt={name}
		loading="lazy"
		decoding="async"
		class="h-5"
		onerror={() => (failed = true)}
	/>
{/if}
