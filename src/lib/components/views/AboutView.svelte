<script lang="ts">
	import { getContext } from 'svelte';
	import {
		User,
		Briefcase,
		Sparkles,
		GraduationCap,
		Trophy,
		Mail,
		Github,
		ExternalLink,
		ArrowUpRight,
		MapPin,
		Calendar
	} from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { PageData } from '$lib/types';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';

	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);

	const profileSummary =
		'I build high-impact product experiences across web platforms with a strong focus on speed, clarity, and execution quality. I enjoy turning ambiguous business problems into stable, measurable systems that teams can ship confidently.';

	const experienceHighlights = [
		{
			company: 'WebMD',
			role: 'Software Engineer',
			period: 'Feb 2025 - Current',
			location: 'Mumbai, India',
			points: [
				'Led Headcount Management System replacing spreadsheet workflows across HR, Finance, and leadership.',
				'Shipped real-time hiring dashboards for 100+ stakeholders, replacing 2-3 day reporting loops.',
				'Mentored trainee developers on React patterns, clean code, and CI/CD-driven delivery.'
			]
		},
		{
			company: 'Simform',
			role: 'Software Engineer',
			period: 'Nov 2023 - Feb 2025',
			location: 'Ahmedabad, India (Remote)',
			points: [
				'Revamped BMW and Nissan homepage experiences using React, Next.js, and TypeScript.',
				'Reduced signup drop-off by simplifying multi-step flows through UX analysis and A/B testing.',
				'Built frontend delivery for a QR campaign platform with measurable attribution outcomes.'
			]
		},
		{
			company: 'Yocket',
			role: 'Software Engineer',
			period: 'Feb 2022 - Nov 2023',
			location: 'Mumbai, India (Remote)',
			points: [
				'Shipped revenue-driving premium payment flows with Vue.js and TypeScript.',
				'Built accessible component systems with Nuxt and TailwindCSS for better mobile conversion.'
			]
		}
	];

	const skillsByGroup = [
		{
			title: 'Languages',
			variant: 'yellow' as const,
			items: ['JavaScript', 'TypeScript', 'Python']
		},
		{
			title: 'Frameworks',
			variant: 'blue' as const,
			items: ['React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Node.js', 'Express.js', 'Tailwind CSS']
		},
		{
			title: 'Cloud & DevOps',
			variant: 'green' as const,
			items: ['AWS', 'Vercel', 'Supabase', 'Firebase', 'CI/CD', 'Sentry', 'Kibana', 'Grafana']
		},
		{
			title: 'Tooling',
			variant: 'purple' as const,
			items: ['Playwright', 'Postman', 'Lighthouse', 'GitHub', 'Claude', 'Cursor']
		}
	];

	const projectHighlights = [
		{
			title: 'Workflow Builder - Visual Workflow Editor',
			stack: ['Vue 3', 'TypeScript', 'Supabase', 'Pinia', 'PostgreSQL'],
			description:
				'Built a full-stack visual workflow editor with undo/redo command patterns, autosave, and cloud persistence.'
		},
		{
			title: 'Deepfake Video Detection',
			stack: ['React', 'TypeScript', 'Django REST', 'TensorFlow'],
			description:
				'Designed a real-time detection interface with secure upload flows and frame-level analysis visualization.'
		}
	];

	const awards = [
		'Recognition for Top Performer in WebMD Product Engineering (Q3 2025)',
		'Trophy and recognition for fastest coder at Yocket',
		'First prize in WebStorm Hackathon hosted by JetBrains'
	];
</script>

<div class="mx-auto max-w-5xl">
	<p class="text-sm text-vsc-green">// about.md - private profile notes</p>

	<section
		class="relative mt-4 overflow-hidden rounded-xl border border-vsc-border bg-vsc-panel p-5"
	>
		<div
			class="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-vsc-blue/10 blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-vsc-green/10 blur-3xl"
		></div>

		<div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
			<div class="flex items-center gap-2">
				<User size={18} class="text-vsc-blue" />
				<h1 class="text-xl font-bold text-vsc-blue">Sushil Kamble</h1>
			</div>
			<span
				class="rounded-md border border-vsc-border bg-vsc-bg px-2 py-1 text-xs text-vsc-text-muted"
			>
				Hidden route: <span class="text-vsc-orange">/about</span>
			</span>
		</div>

		<p class="relative z-10 mt-3 max-w-3xl leading-relaxed text-vsc-text">
			{data.about_me || profileSummary}
		</p>
		<p class="relative z-10 mt-2 max-w-3xl text-sm leading-relaxed text-vsc-text-muted">
			{profileSummary}
		</p>

		<div class="relative z-10 mt-4 flex flex-wrap gap-2 text-xs">
			<a
				href="mailto:iamsushil303@gmail.com"
				class="inline-flex items-center gap-1.5 rounded border border-vsc-border bg-vsc-bg px-2.5 py-1.5 text-vsc-text no-underline transition-colors hover:border-vsc-blue/40 hover:text-vsc-blue"
			>
				<Mail size={12} />
				iamsushil303@gmail.com
			</a>
			<a
				href="https://github.com/sushil-kamble"
				target="_blank"
				rel="noopener"
				class="inline-flex items-center gap-1.5 rounded border border-vsc-border bg-vsc-bg px-2.5 py-1.5 text-vsc-text no-underline transition-colors hover:border-vsc-blue/40 hover:text-vsc-blue"
			>
				<Github size={12} />
				github.com/sushil-kamble
				<ArrowUpRight size={12} />
			</a>
			<a
				href="https://www.linkedin.com/in/sushil-kamble/"
				target="_blank"
				rel="noopener"
				class="inline-flex items-center gap-1.5 rounded border border-vsc-border bg-vsc-bg px-2.5 py-1.5 text-vsc-text no-underline transition-colors hover:border-vsc-blue/40 hover:text-vsc-blue"
			>
				<ExternalLink size={12} />
				linkedin.com/in/sushil-kamble
				<ArrowUpRight size={12} />
			</a>
		</div>
	</section>

	<section class="mt-7">
		<div class="flex items-center gap-2">
			<Briefcase size={18} class="text-vsc-yellow" />
			<h2 class="text-lg font-semibold text-vsc-yellow">
				<span class="text-vsc-purple">##</span> EXPERIENCE.highlights
			</h2>
		</div>
		<p class="mt-1 text-sm text-vsc-green">// impact-first summary from current resume</p>

		<div class="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
			{#each experienceHighlights as item (item.company)}
				<article class="rounded-lg border border-vsc-border bg-vsc-panel p-4">
					<div class="flex items-start justify-between gap-2">
						<div>
							<h3 class="text-sm font-semibold text-vsc-text">{item.role}</h3>
							<p class="text-sm text-vsc-blue">{item.company}</p>
						</div>
						<div class="text-right text-xs text-vsc-text-muted">
							<p class="inline-flex items-center gap-1">
								<Calendar size={11} />
								{item.period}
							</p>
							<p class="mt-0.5 inline-flex items-center gap-1">
								<MapPin size={11} />
								{item.location}
							</p>
						</div>
					</div>

					<ul class="mt-3 space-y-1.5 pl-4">
						{#each item.points as point (point)}
							<li class="list-disc text-sm leading-relaxed text-vsc-text">{point}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section class="mt-7">
		<div class="flex items-center gap-2">
			<Sparkles size={18} class="text-vsc-green" />
			<h2 class="text-lg font-semibold text-vsc-green">
				<span class="text-vsc-purple">##</span> SKILL.matrix
			</h2>
		</div>
		<p class="mt-1 text-sm text-vsc-green">// practical stack for product engineering and scale</p>

		<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
			{#each skillsByGroup as group (group.title)}
				<div class="rounded-lg border border-vsc-border bg-vsc-panel p-3.5">
					<p class="text-sm text-vsc-blue">"{group.title}"</p>
					<div class="mt-2 flex flex-wrap gap-1.5">
						{#each group.items as skill (skill)}
							<TechBadge name={skill} variant={group.variant} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="mt-7 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.8fr]">
		<div class="rounded-lg border border-vsc-border bg-vsc-panel p-4">
			<div class="flex items-center gap-2">
				<Briefcase size={16} class="text-vsc-blue" />
				<h2 class="text-base font-semibold text-vsc-blue">PROJECTS.select</h2>
			</div>
			<div class="mt-3 space-y-3">
				{#each projectHighlights as project (project.title)}
					<div class="rounded-md border border-vsc-border bg-vsc-bg p-3">
						<p class="text-sm font-medium text-vsc-text">{project.title}</p>
						<p class="mt-1 text-sm leading-relaxed text-vsc-text-muted">{project.description}</p>
						<div class="mt-2 flex flex-wrap gap-1.5">
							{#each project.stack as tech (tech)}
								<TechBadge name={tech} variant="blue" />
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="space-y-3">
			<div class="rounded-lg border border-vsc-border bg-vsc-panel p-4">
				<div class="flex items-center gap-2">
					<GraduationCap size={16} class="text-vsc-orange" />
					<h2 class="text-base font-semibold text-vsc-orange">EDUCATION</h2>
				</div>
				<p class="mt-2 text-sm text-vsc-text">PCCOE, Pune</p>
				<p class="text-sm text-vsc-text-muted">B.E. Computer Science | GPA: 9.22/10</p>
				<p class="mt-1 text-xs text-vsc-text-muted">Aug 2018 - May 2022</p>
			</div>

			<div class="rounded-lg border border-vsc-border bg-vsc-panel p-4">
				<div class="flex items-center gap-2">
					<Trophy size={16} class="text-vsc-yellow" />
					<h2 class="text-base font-semibold text-vsc-yellow">AWARDS</h2>
				</div>
				<ul class="mt-2 space-y-1.5 pl-4">
					{#each awards as award (award)}
						<li class="list-disc text-sm text-vsc-text">{award}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<p class="mt-7 text-xs text-vsc-text-muted">
		// This page is intentionally hidden from navigation.
	</p>
</div>
