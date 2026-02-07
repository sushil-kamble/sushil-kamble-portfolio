<script lang="ts">
	import { getContext } from 'svelte';
	import { Terminal, Sparkles } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import CalloutBox from '$lib/components/ui/CalloutBox.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);

	const variants: Array<'blue' | 'green' | 'purple' | 'orange' | 'yellow'> = [
		'blue',
		'green',
		'purple',
		'orange',
		'yellow'
	];
</script>

<div>
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

	<!-- Skills heading -->
	<h2 class="mt-4 text-lg font-semibold text-vsc-green">
		<span class="text-vsc-purple">##</span> SKILL.md
	</h2>

	<!-- Tech stack — categorized badges -->
	<div class="mt-3 rounded-lg border border-vsc-border bg-vsc-panel p-4">
		<p class="text-sm text-vsc-yellow">&lbrace;</p>

		<div class="pl-4">
			<p class="text-sm">
				<span class="text-vsc-blue">"version"</span><span class="text-vsc-text">:</span>
				<span class="text-vsc-orange">"1.0.0"</span><span class="text-vsc-text">,</span>
			</p>

			{#each data.skills as category, i (category.title)}
				<div class="mt-3">
					<p class="text-sm">
						<span class="text-vsc-blue">"{category.title}"</span><span class="text-vsc-text"
							>: &lbrace;</span
						>
					</p>
					<div class="flex flex-wrap gap-2 py-2 pl-4">
						{#each category.skills as skill (skill)}
							<TechBadge name={skill} variant={variants[i % variants.length]} />
						{/each}
					</div>
					<p class="text-sm text-vsc-text">
						&rbrace;{i < data.skills.length - 1 ? ',' : ''}
					</p>
				</div>
			{/each}
		</div>

		<p class="text-sm text-vsc-yellow">&rbrace;</p>
	</div>

	<!-- Callout -->
	<CalloutBox type="info">
		<p class="flex items-center gap-1.5">
			<Sparkles size={14} class="text-vsc-yellow" />
			Press <kbd class="rounded bg-vsc-panel px-1.5 py-0.5 text-xs text-vsc-blue">Cmd+K</kbd> to search
			files — or explore the sidebar.
		</p>
	</CalloutBox>
</div>
