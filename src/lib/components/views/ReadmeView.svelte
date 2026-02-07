<script lang="ts">
	import { getContext } from 'svelte';
	import { Terminal, Sparkles } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import Badge from '$lib/components/ui/Badge.svelte';
	import CalloutBox from '$lib/components/ui/CalloutBox.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);

	const techHighlights = $derived(
		data.skills.flatMap((s) => s.skills.slice(0, 3)).slice(0, 12)
	);
</script>

<div class="max-w-3xl">
	<!-- Heading -->
	<div class="flex items-center gap-3">
		<Terminal size={24} class="text-vsc-green" />
		<h1 class="text-2xl font-bold text-vsc-blue">
			Hello World! <span class="text-vsc-yellow">I'm Sushil</span>
		</h1>
	</div>

	<!-- Comment block -->
	<div class="mt-4 text-sm leading-relaxed text-vsc-green">
		<p>/**</p>
		<p class="pl-2">* Full-stack developer crafting elegant solutions.</p>
		<p class="pl-2">* Passionate about clean code, great UX, and shipping fast.</p>
		<p>*/</p>
	</div>

	<!-- About -->
	{#if data.about_me}
		<p class="mt-4 leading-relaxed text-vsc-text">{data.about_me}</p>
	{/if}

	<!-- Tech stack badges -->
	<div class="mt-6">
		<p class="text-sm font-medium text-vsc-blue">
			<span class="text-vsc-purple">const</span> techStack = [
		</p>
		<div class="mt-2 flex flex-wrap gap-2 pl-4">
			{#each techHighlights as tech (tech)}
				<Badge text={tech} variant="blue" />
			{/each}
		</div>
		<p class="mt-2 text-sm text-vsc-blue">];</p>
	</div>

	<!-- Callout -->
	<CalloutBox type="info">
		<p class="flex items-center gap-1.5">
			<Sparkles size={14} class="text-vsc-yellow" />
			Press <kbd class="rounded bg-vsc-panel px-1.5 py-0.5 text-xs text-vsc-blue">Cmd+K</kbd> to search files — or explore the sidebar.
		</p>
	</CalloutBox>
</div>
