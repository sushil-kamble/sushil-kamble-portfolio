<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';

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
	<p class="text-vsc-text-muted">
		<span class="text-vsc-green">// package.json</span> — Skills & Dependencies
	</p>

	<div class="mt-4 rounded-lg border border-vsc-border bg-vsc-panel p-4">
		<p class="text-sm text-vsc-yellow">&lbrace;</p>

		<div class="pl-4">
			<p class="text-sm">
				<span class="text-vsc-blue">"version"</span><span class="text-vsc-text">:</span>
				<span class="text-vsc-orange">"2.0.0"</span><span class="text-vsc-text">,</span>
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
</div>
