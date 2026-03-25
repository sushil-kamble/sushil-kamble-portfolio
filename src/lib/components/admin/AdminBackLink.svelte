<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';

	interface Props {
		href: string;
		label: string;
	}

	let { href, label }: Props = $props();
</script>

<a {href} class="admin-back-link">
	<ArrowLeft class="size-4" />
	<span>{label}</span>
</a>
