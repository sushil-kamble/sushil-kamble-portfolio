<script lang="ts">
	import { getContext } from 'svelte';
	import { Briefcase, Rocket, Cpu } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import { calculateExperience, projectCount, skillCount } from '$lib/utils/metrics';
	import MetricCard from './MetricCard.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);
</script>

<div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
	<MetricCard label="Experience" value={calculateExperience(data.careers)} icon={Briefcase} />
	<MetricCard label="Projects" value={projectCount(data)} icon={Rocket} />
	<MetricCard label="Tech Stack" value={skillCount(data)} icon={Cpu} />
</div>
