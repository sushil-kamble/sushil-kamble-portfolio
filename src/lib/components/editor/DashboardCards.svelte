<script lang="ts">
	import { getContext } from 'svelte';
	import { Briefcase, Rocket, Cpu } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import { calculateExperience, projectCount, skillCount } from '$lib/utils/metrics';
	import type { EditorState } from '$lib/state/editor.svelte';
	import MetricCard from './MetricCard.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);
	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
</script>

<!-- MADE IT HIDDEN INTENTIONALLY -->

{#if editor.isMobile}
	<!-- Mobile: compact single-row bar -->
	<div class="hidden items-center gap-3 border-b border-vsc-border px-3 py-2">
		<div class="flex items-center gap-1.5 text-xs text-vsc-text-muted">
			<Briefcase size={12} class="text-vsc-blue" />
			<span class="font-medium text-vsc-text">{calculateExperience(data.careers)}</span>
		</div>
		<span class="text-vsc-border">|</span>
		<div class="flex items-center gap-1.5 text-xs text-vsc-text-muted">
			<Rocket size={12} class="text-vsc-blue" />
			<span class="font-medium text-vsc-text">{projectCount(data)}</span>
		</div>
		<span class="text-vsc-border">|</span>
		<div class="flex items-center gap-1.5 text-xs text-vsc-text-muted">
			<Cpu size={12} class="text-vsc-blue" />
			<span class="font-medium text-vsc-text">{skillCount(data)}</span>
		</div>
	</div>
{:else}
	<!-- Desktop: full metric cards -->
	<div class="hidden grid-cols-3 gap-3 p-4">
		<MetricCard label="Experience" value={calculateExperience(data.careers)} icon={Briefcase} />
		<MetricCard label="Projects" value={projectCount(data)} icon={Rocket} />
		<MetricCard label="Tech Stack" value={skillCount(data)} icon={Cpu} />
	</div>
{/if}
