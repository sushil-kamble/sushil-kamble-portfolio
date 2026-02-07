<script lang="ts">
	import { getContext } from 'svelte';
	import { MapPin, ExternalLink } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);
</script>

<div class="max-w-3xl">
	<p class="text-sm text-vsc-green">// about_me.ts — Career Timeline</p>

	<div class="mt-2">
		<p class="text-sm">
			<span class="text-vsc-purple">export const</span>
			<span class="text-vsc-yellow"> career</span>
			<span class="text-vsc-text">: </span>
			<span class="text-vsc-blue">Experience[]</span>
			<span class="text-vsc-text"> = [</span>
		</p>
	</div>

	<div class="mt-4 space-y-6 pl-4">
		{#each data.careers as career (career.company + career.start)}
			<div class="relative border-l-2 border-vsc-blue/20 pl-5">
				<!-- Timeline dot -->
				<div class="absolute top-1 -left-1.25 h-2 w-2 rounded-full bg-vsc-blue"></div>

				<div class="flex items-start justify-between">
					<div>
						<h3 class="font-bold text-vsc-orange">{career.designation}</h3>
						<div class="mt-0.5 flex items-center gap-2 text-sm">
							{#if career.link}
								<a
									href={career.link}
									target="_blank"
									rel="noopener"
									class="flex items-center gap-1 text-vsc-blue hover:underline"
								>
									{career.company}
									<ExternalLink size={11} />
								</a>
							{:else}
								<span class="text-vsc-blue">{career.company}</span>
							{/if}
						</div>
					</div>
					<div class="text-right text-xs text-vsc-text-muted">
						<p>{career.start} — {career.end}</p>
						{#if career.location}
							<p class="mt-0.5 flex items-center justify-end gap-1">
								<MapPin size={11} />
								{career.location}
							</p>
						{/if}
					</div>
				</div>

				<!-- As of now it should be hidden -->
				{#if career.details}
					<p class="mt-2 hidden text-sm leading-relaxed text-vsc-text-muted">{career.details}</p>
				{/if}

				{#if career.detailsList.length > 0}
					<ul class="mt-2 space-y-1 pl-4">
						{#each career.detailsList as detail (detail)}
							<li class="list-disc text-sm text-vsc-text-muted">{detail}</li>
						{/each}
					</ul>
				{/if}

				{#if career.skills.length > 0}
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each career.skills as skill (skill)}
							<TechBadge name={skill} variant="purple" />
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<p class="mt-4 text-sm text-vsc-text">];</p>
</div>
