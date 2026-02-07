<script lang="ts">
	let {
		text,
		variant = 'blue'
	}: {
		text: string;
		variant?: 'blue' | 'green' | 'purple' | 'orange' | 'yellow';
	} = $props();

	const colorMap = {
		blue: 'bg-vsc-blue/10 text-vsc-blue',
		green: 'bg-vsc-green/10 text-vsc-green',
		purple: 'bg-vsc-purple/10 text-vsc-purple',
		orange: 'bg-vsc-orange/10 text-vsc-orange',
		yellow: 'bg-vsc-yellow/10 text-vsc-yellow'
	};
</script>

<span class="inline-block rounded px-2 py-0.5 text-xs {colorMap[variant]}">
	{text}
</span>
