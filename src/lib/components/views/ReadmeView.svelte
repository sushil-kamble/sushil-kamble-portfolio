<script lang="ts">
	import { getContext } from 'svelte';
	import {
		Terminal,
		ArrowRight,
		Github,
		ExternalLink,
		Mail,
		Send,
		FolderCode,
		Newspaper,
		Briefcase,
		MapPin,
		Calendar
	} from 'lucide-svelte';
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

	const featuredProjects = $derived(data.projects.slice(0, 3));
	const recentPosts = $derived(data.blogs.slice(0, 3));

	const contactLinks = [
		{
			icon: Mail,
			iconColor: 'text-vsc-text',
			label: 'email',
			href: 'mailto:iamsushil303@gmail.com',
			displayText: 'iamsushil303@gmail.com',
			isExternal: false
		},
		{
			icon: Github,
			iconColor: 'text-vsc-text',
			label: 'github',
			href: 'https://github.com/sushil-kamble',
			displayText: 'github.com/sushil-kamble',
			isExternal: true
		},
		{
			icon: ExternalLink,
			iconColor: 'text-vsc-text',
			label: 'linkedin',
			href: 'https://www.linkedin.com/in/sushil-kamble/',
			displayText: 'linkedin.com/in/sushil-kamble',
			isExternal: true
		},
		{
			icon: Send,
			iconColor: 'text-vsc-text',
			label: 'x',
			href: 'https://x.com/SushilK28005811',
			displayText: 'x.com/SushilK28005811',
			isExternal: true
		}
	];
</script>

<div class="space-y-8">
	<!-- Hero section with floating portrait -->
	<div class="hero-section relative">
		<!-- Portrait — absolutely positioned, bottom-aligned to hero -->
		<picture>
			<source srcset="/me_img.webp" type="image/webp" />
			<img
				src="/me_img.png"
				alt="Sushil Kamble"
				class="portrait-img"
				width="614"
				height="614"
				fetchpriority="high"
				decoding="async"
			/>
		</picture>

		<!-- Heading -->
		<div class="relative z-10 flex items-center gap-3">
			<Terminal size={24} class="text-vsc-green" />
			<h1 class="text-2xl font-bold text-vsc-blue">
				Hello World! <span class="text-vsc-yellow">I'm Sushil</span>
			</h1>
		</div>

		<!-- Comment block -->
		<div class="relative z-10 mt-4 text-sm leading-relaxed text-vsc-green">
			<p>/**</p>
			<p class="pl-2">* Full-stack developer crafting elegant solutions.</p>
			<p class="pl-2">* Passionate about clean code, great UX, and shipping fast.</p>
			<p>*/</p>
		</div>

		<!-- About -->
		{#if data.about_me}
			<p class="relative z-10 mt-4 max-w-3xl leading-relaxed text-vsc-text">{data.about_me}</p>
		{/if}
	</div>

	<!-- ═══════════════════════════════════════════ -->
	<!-- WORK EXPERIENCE                             -->
	<!-- ═══════════════════════════════════════════ -->
	{#if data.careers.length > 0}
		<div>
			<div class="flex items-center gap-2">
				<Briefcase size={18} class="text-vsc-yellow" />
				<h2 class="text-lg font-semibold text-vsc-yellow">
					<span class="text-vsc-purple">##</span> EXPERIENCE.log
				</h2>
			</div>
			<p class="mt-1 text-sm text-vsc-green">// git log --oneline --career</p>

			<div class="mt-4 space-y-2">
				{#each data.careers as career, i (career.id)}
					<div
						class="group flex items-center gap-4 rounded-lg border border-vsc-border bg-vsc-panel p-3 transition-all duration-200 hover:border-vsc-yellow/40 hover:bg-vsc-bg"
						style="animation-delay: {i * 80}ms"
					>
						<!-- Company logo -->
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-vsc-border bg-vsc-bg p-1.5 transition-colors group-hover:border-vsc-yellow/30"
						>
							{#if career.logo}
								<img
									src={career.logo}
									alt="{career.company} logo"
									class="h-full w-full object-contain"
									loading="lazy"
									decoding="async"
									width="40"
									height="40"
								/>
							{:else}
								<Briefcase size={18} class="text-vsc-yellow" />
							{/if}
						</div>

						<!-- Career info -->
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-baseline gap-x-2">
								{#if career.link}
									<a
										href={career.link}
										target="_blank"
										rel="noopener"
										class="text-sm font-semibold text-vsc-yellow no-underline transition-colors hover:text-vsc-text"
									>
										{career.company}
									</a>
								{:else}
									<span class="text-sm font-semibold text-vsc-yellow">{career.company}</span>
								{/if}
								<span class="text-xs text-vsc-text-muted">—</span>
								<span class="text-sm text-vsc-text">{career.designation}</span>
							</div>
							<div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-vsc-text-muted">
								{#if career.location}
									<span class="flex items-center gap-1">
										<MapPin size={10} class="text-vsc-text-muted" />
										{career.location}
									</span>
								{/if}
								<span class="flex items-center gap-1">
									<Calendar size={10} class="text-vsc-text-muted" />
									{career.start} → {career.end || 'Present'}
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<a
				href="/career"
				class="mt-3 flex items-center gap-1.5 text-sm text-vsc-yellow no-underline transition-colors hover:text-vsc-text"
			>
				View full career log
				<ArrowRight size={14} />
			</a>
		</div>
	{/if}

	<!-- Skills heading -->
	<div>
		<h2 class="text-lg font-semibold text-vsc-green">
			<span class="text-vsc-purple">##</span> SKILL.json
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
	</div>

	<!-- ═══════════════════════════════════════════ -->
	<!-- FEATURED PROJECTS                           -->
	<!-- ═══════════════════════════════════════════ -->
	{#if featuredProjects.length > 0}
		<div>
			<div class="flex items-center gap-2">
				<FolderCode size={18} class="text-vsc-blue" />
				<h2 class="text-lg font-semibold text-vsc-blue">
					<span class="text-vsc-purple">##</span> PROJECTS.featured
				</h2>
			</div>
			<p class="mt-1 text-sm text-vsc-green">// Top projects — click to explore</p>

			<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
				{#each featuredProjects as project, i (project.id)}
					<div
						class="group relative cursor-pointer overflow-hidden rounded-lg border border-vsc-border bg-vsc-panel p-4 text-left transition-all duration-300 hover:border-vsc-blue/60 hover:shadow-lg hover:shadow-vsc-blue/10"
						style="animation-delay: {i * 80}ms"
					>
						<!-- Stretched card link -->
						<a
							href="/projects/{project.slug}"
							class="absolute inset-0 z-0"
							aria-label={project.title}
						></a>

						<!-- Subtle gradient overlay on hover -->
						<div
							class="pointer-events-none absolute inset-0 bg-linear-to-br from-vsc-blue/0 to-vsc-blue/0 transition-all duration-300 group-hover:from-vsc-blue/5 group-hover:to-transparent"
						></div>

						<!-- Project title -->
						<div class="pointer-events-none relative flex items-center justify-between">
							<h3 class="text-sm font-semibold text-vsc-text group-hover:text-vsc-blue">
								{project.title}
							</h3>
							<ArrowRight
								size={14}
								class="text-vsc-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-vsc-blue group-hover:opacity-100"
							/>
						</div>

						<!-- Description -->
						{#if project.description}
							<p
								class="pointer-events-none relative mt-2 line-clamp-2 text-xs leading-relaxed text-vsc-text-muted"
							>
								{project.description}
							</p>
						{/if}

						<!-- Stack badges -->
						{#if project.stack.length > 0}
							<div class="pointer-events-none relative mt-3 flex flex-wrap gap-1.5">
								{#each project.stack.slice(0, 3) as tech (tech)}
									<TechBadge name={tech} variant="blue" />
								{/each}
								{#if project.stack.length > 3}
									<span class="self-center text-[10px] text-vsc-text-muted">
										+{project.stack.length - 3}
									</span>
								{/if}
							</div>
						{/if}

						<!-- External links -->
						<div class="pointer-events-auto relative z-10 mt-3 flex gap-2">
							{#if project.github}
								<a
									href={project.github}
									target="_blank"
									rel="noopener"
									class="text-vsc-text-muted transition-colors hover:text-vsc-text"
									title="Source code"
								>
									<Github size={13} />
								</a>
							{/if}
							{#if project.direct}
								<a
									href={project.direct}
									target="_blank"
									rel="noopener"
									class="text-vsc-text-muted transition-colors hover:text-vsc-green"
									title="Live demo"
								>
									<ExternalLink size={13} />
								</a>
							{/if}
						</div>

						<!-- Bottom accent -->
						<div
							class="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-vsc-blue to-vsc-purple transition-all duration-300 group-hover:w-full"
						></div>
					</div>
				{/each}
			</div>

			<!-- View all link -->
			<a
				href="/projects"
				class="mt-3 flex items-center gap-1.5 text-sm text-vsc-blue no-underline transition-colors hover:text-vsc-text"
			>
				View all {data.projects.length} projects
				<ArrowRight size={14} />
			</a>
		</div>
	{/if}

	<!-- ═══════════════════════════════════════════ -->
	<!-- RECENT POSTS                                -->
	<!-- ═══════════════════════════════════════════ -->
	{#if recentPosts.length > 0}
		<div>
			<div class="flex items-center gap-2">
				<Newspaper size={18} class="text-vsc-green" />
				<h2 class="text-lg font-semibold text-vsc-green">
					<span class="text-vsc-purple">##</span> POSTS.recent
				</h2>
			</div>
			<p class="mt-1 text-sm text-vsc-green">// Latest writings and articles</p>

			<div class="mt-4 space-y-2.5">
				{#each recentPosts as post, i (post.id)}
					<a
						href="/posts/{post.slug}"
						class="group flex w-full items-start gap-3 rounded-lg border border-vsc-border bg-vsc-panel p-3 text-left no-underline transition-all duration-200 hover:border-vsc-green/50 hover:bg-vsc-bg"
						style="animation-delay: {i * 80}ms"
					>
						<!-- Index number -->
						<span
							class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-vsc-green/10 text-xs font-bold text-vsc-green"
						>
							{i + 1}
						</span>

						<div class="min-w-0 flex-1">
							<h3 class="text-sm font-medium text-vsc-text group-hover:text-vsc-green">
								{post.title}
							</h3>
							{#if post.description}
								<p class="mt-1 line-clamp-1 text-xs text-vsc-text-muted">
									{post.description}
								</p>
							{/if}
							{#if post.tags.length > 0}
								<div class="mt-1.5 flex flex-wrap gap-1">
									{#each post.tags.slice(0, 3) as tag (tag)}
										<TechBadge name={tag} variant="green" />
									{/each}
								</div>
							{/if}
						</div>

						<ArrowRight
							size={14}
							class="mt-1 shrink-0 text-vsc-text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-vsc-green group-hover:opacity-100"
						/>
					</a>
				{/each}
			</div>

			<!-- View all link -->
			<a
				href="/posts"
				class="mt-3 flex items-center gap-1.5 text-sm text-vsc-green no-underline transition-colors hover:text-vsc-text"
			>
				View all {data.blogs.length} posts
				<ArrowRight size={14} />
			</a>
		</div>
	{/if}

	<!-- ═══════════════════════════════════════════ -->
	<!-- QUICK CONTACT                               -->
	<!-- ═══════════════════════════════════════════ -->
	<div>
		<div class="flex items-center gap-2">
			<Mail size={18} class="text-vsc-orange" />
			<h2 class="text-lg font-semibold text-vsc-orange">
				<span class="text-vsc-purple">##</span> CONTACT.info
			</h2>
		</div>

		<div class="mt-3 rounded-lg border border-vsc-border bg-vsc-panel p-4">
			<p class="text-sm text-vsc-green">// Quick ways to reach me</p>

			<div class="mt-3 flex flex-col gap-2 text-sm">
				{#each contactLinks as { icon: Icon, iconColor, label, href, displayText, isExternal } (label)}
					<div class="flex flex-col gap-1 text-vsc-text-muted md:flex-row md:items-center md:gap-2">
						<div class="flex items-center gap-2">
							<Icon size={14} class={iconColor} />
							<span class="text-vsc-blue">"{label}"</span>
							<span class="text-vsc-text">:</span>
						</div>
						<a
							{href}
							{...isExternal ? { target: '_blank', rel: 'noopener' } : {}}
							class="ml-6 break-all text-vsc-orange transition-colors hover:text-vsc-yellow md:ml-0"
						>
							"{displayText}"
						</a>
					</div>
				{/each}
			</div>

			<a
				href="/contact"
				class="mt-4 flex items-center gap-2 rounded-md border border-vsc-border bg-vsc-bg px-4 py-2 text-sm text-vsc-text no-underline transition-all hover:border-vsc-orange/50 hover:text-vsc-orange"
			>
				<Send size={14} />
				Open full contact form
				<ArrowRight size={14} />
			</a>
		</div>
	</div>
</div>

<style>
	.portrait-img {
		display: none;
	}

	@media (min-width: 768px) {
		.portrait-img {
			display: block;
			position: absolute;
			bottom: 0;
			top: 0;
			right: 4%;
			width: 320px;
			object-fit: cover;
			object-position: top;
			z-index: 1;
			opacity: 0.35;
			pointer-events: none;
			filter: drop-shadow(0 0 30px rgba(86, 156, 214, 0.1));
			mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
			-webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
		}
	}

	@media (min-width: 1024px) {
		.portrait-img {
			top: -10px;
			width: 400px;
			right: 2%;
			opacity: 0.45;
		}
	}
</style>
