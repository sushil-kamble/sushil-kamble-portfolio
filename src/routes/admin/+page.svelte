<script lang="ts">
	import {
		ArrowRight,
		BookOpenText,
		Briefcase,
		FileText,
		FolderKanban,
		Images,
		LayoutDashboard,
		Link2,
		NotebookPen,
		Plus,
		TriangleAlert,
		UserRound,
		Zap
	} from 'lucide-svelte';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	function formatDate(value: string): string {
		try {
			return new Date(value).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		} catch {
			return value;
		}
	}

	const readySections = $derived.by(
		() =>
			[
				data.about.present,
				data.counts.careers > 0,
				data.counts.skillCategories > 0,
				data.counts.projects > 0,
				data.counts.blogs > 0
			].filter(Boolean).length
	);

	const sectionCards = $derived.by(() => [
		{
			label: 'Careers',
			count: data.counts.careers,
			icon: Briefcase,
			href: '/admin/careers',
			accent: 'bg-sky-500/10 text-sky-600',
			description:
				data.previews.careers[0]?.designation && data.previews.careers[0]?.company
					? `${data.previews.careers[0].designation} at ${data.previews.careers[0].company}`
					: 'Timeline and role history'
		},
		{
			label: 'Skills',
			count: data.counts.totalSkills,
			icon: Zap,
			href: '/admin/skills',
			accent: 'bg-amber-500/10 text-amber-600',
			description: data.previews.skillCategories[0]?.title
				? `${data.previews.skillCategories[0].title} leads the library`
				: 'Grouped capability sets'
		},
		{
			label: 'Projects',
			count: data.counts.projects,
			icon: FolderKanban,
			href: '/admin/projects',
			accent: 'bg-emerald-500/10 text-emerald-600',
			description: data.previews.projects[0]?.title
				? `${data.previews.projects[0].title} is first in live order`
				: 'Portfolio work and case studies'
		},
		{
			label: 'Blogs',
			count: data.counts.blogs,
			icon: FileText,
			href: '/admin/blogs',
			accent: 'bg-rose-500/10 text-rose-600',
			description: data.previews.recentBlogs[0]?.title
				? `Latest: ${data.previews.recentBlogs[0].title}`
				: 'Editorial queue and publishing'
		}
	]);

	const attentionItems = $derived.by(() => [
		{
			label: 'About copy',
			value: data.about.present ? 0 : 1,
			href: '/admin/about',
			helper: data.about.present ? 'Ready' : 'Missing'
		},
		{
			label: 'Careers without logos',
			value: data.attention.careersWithoutLogo,
			href: '/admin/careers',
			helper: 'Branding polish'
		},
		{
			label: 'Projects missing screenshots',
			value: data.attention.projectsWithoutScreenshots,
			href: '/admin/projects',
			helper: 'Visual coverage'
		},
		{
			label: 'Blogs without tags',
			value: data.attention.blogsWithoutTags,
			href: '/admin/blogs',
			helper: 'Archive metadata'
		},
		{
			label: 'Empty skill categories',
			value: data.attention.emptySkillCategories,
			href: '/admin/skills',
			helper: 'Content depth'
		}
	]);

	const attentionCount = $derived.by(() =>
		attentionItems.reduce((sum, item) => sum + Number(item.value > 0), 0)
	);
</script>

<section class="admin-page">
	<AdminPageHeader
		title="Dashboard"
		description="A content control room for the portfolio. See what is live, what was updated recently, and what still needs editorial attention before you dive into a section."
	>
		{#snippet icon()}
			<LayoutDashboard class="size-5" />
		{/snippet}
	</AdminPageHeader>

	<div class="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
		<Card.Root class="admin-hero-surface overflow-hidden">
			<Card.Content class="relative space-y-6 p-6">
				<div class="space-y-3">
					<Badge
						variant="outline"
						class="rounded-full px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase"
					>
						Portfolio Control Room
					</Badge>
					<div class="space-y-2">
						<h2 class="text-foreground max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
							See the live portfolio as a system, not as isolated forms.
						</h2>
						<p class="text-muted-foreground max-w-3xl text-sm leading-6">
							You currently have {data.counts.totalEntries} structured content entries across
							{data.counts.sections} admin sections. The dashboard now surfaces live-order previews, recent
							writing, and missing content signals so you can decide what to edit next without clicking
							through every area.
						</p>
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Entries</p>
						<p class="text-foreground mt-3 text-3xl font-semibold tracking-tight">
							{data.counts.totalEntries}
						</p>
						<p class="text-muted-foreground mt-1 text-xs">
							Across careers, skills, projects, and blogs
						</p>
					</div>
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Ready sections</p>
						<p class="text-foreground mt-3 text-3xl font-semibold tracking-tight">
							{readySections}/{data.counts.sections}
						</p>
						<p class="text-muted-foreground mt-1 text-xs">Sections with content already present</p>
					</div>
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Screenshots</p>
						<p class="text-foreground mt-3 text-3xl font-semibold tracking-tight">
							{data.highlights.projectScreenshots}
						</p>
						<p class="text-muted-foreground mt-1 text-xs">Project visuals uploaded to the site</p>
					</div>
					<div class="border-border/70 bg-background/80 rounded-[1.5rem] border p-4">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Skill badges</p>
						<p class="text-foreground mt-3 text-3xl font-semibold tracking-tight">
							{data.counts.totalSkills}
						</p>
						<p class="text-muted-foreground mt-1 text-xs">
							Technologies indexed across the portfolio
						</p>
					</div>
				</div>

				{#if data.previews.recentBlogs[0]}
					<div class="border-border/70 bg-background/75 rounded-[1.5rem] border p-4">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
							<div class="space-y-1">
								<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">
									Recent writing
								</p>
								<p class="text-foreground text-lg font-semibold tracking-tight">
									{data.previews.recentBlogs[0].title}
								</p>
								<p class="text-muted-foreground text-sm">
									{formatDate(data.previews.recentBlogs[0].createdAt)}
								</p>
							</div>
							<Button href="/admin/blogs" variant="outline" size="sm">
								<NotebookPen class="size-4" />
								<span>Open blog queue</span>
							</Button>
						</div>
					</div>
				{/if}

				<div
					class="pointer-events-none absolute top-4 -right-8 size-44 rounded-full bg-amber-500/10 blur-3xl"
				></div>
				<div
					class="pointer-events-none absolute bottom-0 left-10 h-24 w-48 rounded-full bg-sky-500/10 blur-3xl"
				></div>
			</Card.Content>
		</Card.Root>

		<div class="grid gap-4">
			<Card.Root class="admin-collection-card overflow-hidden">
				<Card.Content class="space-y-4 p-5">
					<div class="flex items-start justify-between gap-3">
						<div class="space-y-1">
							<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Quick launch</p>
							<h3 class="text-foreground text-lg font-semibold tracking-tight">
								Start a new content pass
							</h3>
						</div>
						<div class="admin-icon-shell size-10 rounded-2xl">
							<Plus class="size-4" />
						</div>
					</div>

					<div class="grid gap-2">
						<Button href="/admin/projects/new" variant="secondary" class="justify-between">
							<span>New project</span>
							<ArrowRight class="size-4" />
						</Button>
						<Button href="/admin/blogs/new" variant="secondary" class="justify-between">
							<span>New blog post</span>
							<ArrowRight class="size-4" />
						</Button>
						<Button href="/admin/careers/new" variant="secondary" class="justify-between">
							<span>New career entry</span>
							<ArrowRight class="size-4" />
						</Button>
						<Button href="/admin/about" variant="outline" class="justify-between">
							<span>Refine about section</span>
							<ArrowRight class="size-4" />
						</Button>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="admin-collection-card overflow-hidden">
				<Card.Content class="space-y-4 p-5">
					<div class="flex items-start justify-between gap-3">
						<div class="space-y-1">
							<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">
								Needs attention
							</p>
							<h3 class="text-foreground text-lg font-semibold tracking-tight">
								{attentionCount === 0
									? 'Everything looks covered'
									: `${attentionCount} focus areas`}
							</h3>
						</div>
						<div class="admin-icon-shell size-10 rounded-2xl">
							<TriangleAlert class="size-4" />
						</div>
					</div>

					<div class="grid gap-2">
						{#each attentionItems as item (item.label)}
							<a
								href={item.href}
								class="border-border/70 hover:border-border bg-background/75 flex items-center justify-between gap-3 rounded-[1rem] border px-3 py-3 transition-colors"
							>
								<div class="min-w-0">
									<p class="text-foreground text-sm font-medium">{item.label}</p>
									<p class="text-muted-foreground text-xs">{item.helper}</p>
								</div>
								<Badge
									variant={item.value > 0 ? 'secondary' : 'outline'}
									class="rounded-full px-2.5 py-1"
								>
									{item.value > 0 ? item.value : 'OK'}
								</Badge>
							</a>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each sectionCards as card (card.href)}
			<Card.Root class="admin-collection-card group overflow-hidden">
				<Card.Content class="p-0">
					<Button
						href={card.href}
						variant="ghost"
						size="lg"
						class="flex h-full w-full items-start justify-between gap-4 rounded-[1.55rem] px-5 py-5 text-left"
					>
						<div class="flex items-start gap-4">
							<div class={`flex size-12 items-center justify-center rounded-2xl ${card.accent}`}>
								<card.icon class="size-5" />
							</div>
							<div class="space-y-1">
								<p class="text-muted-foreground text-sm font-medium">{card.label}</p>
								<p class="text-foreground text-3xl font-semibold tracking-tight">{card.count}</p>
								<p class="text-muted-foreground line-clamp-2 text-xs leading-5">
									{card.description}
								</p>
							</div>
						</div>
						<div class="flex flex-col items-end gap-3">
							<Badge
								variant="outline"
								class="rounded-full px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase"
							>
								Open
							</Badge>
							<ArrowRight
								class="text-muted-foreground group-hover:text-foreground size-4 transition-colors"
							/>
						</div>
					</Button>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
		<Card.Root class="admin-collection-card overflow-hidden">
			<Card.Content class="space-y-5 p-5">
				<div class="flex items-center justify-between gap-3">
					<div class="space-y-1">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">
							What visitors see first
						</p>
						<h3 class="text-foreground text-xl font-semibold tracking-tight">
							Projects in live order
						</h3>
					</div>
					<Button href="/admin/projects" variant="outline" size="sm">
						<span>Manage</span>
						<ArrowRight class="size-4" />
					</Button>
				</div>

				<div class="grid gap-3">
					{#if data.previews.projects.length === 0}
						<div
							class="border-border/70 bg-background/75 rounded-[1.35rem] border border-dashed px-4 py-6 text-center"
						>
							<p class="text-foreground text-sm font-medium">No projects yet</p>
							<p class="text-muted-foreground mt-1 text-sm">
								Add a project to start building the live portfolio queue.
							</p>
						</div>
					{:else}
						{#each data.previews.projects as project (project.id)}
							<a
								href={`/admin/projects/${project.id}`}
								class="border-border/70 hover:border-border bg-background/75 flex gap-4 rounded-[1.35rem] border p-3 transition-colors"
							>
								<div
									class="border-border/70 bg-muted/40 flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border"
								>
									{#if project.screenshot}
										<img
											src={project.screenshot}
											alt={project.title}
											class="size-full object-cover"
										/>
									{:else}
										<Images class="text-muted-foreground size-5" />
									{/if}
								</div>

								<div class="min-w-0 flex-1 space-y-3">
									<div class="space-y-1">
										<div class="flex flex-wrap items-center gap-2">
											<Badge variant="outline" class="rounded-full px-2.5 py-1">
												Position {project.ordering + 1}
											</Badge>
											{#if project.hasExternalLink}
												<Badge variant="secondary" class="gap-1.5 rounded-full px-2.5 py-1">
													<Link2 class="size-3.5" />
													<span>External link</span>
												</Badge>
											{/if}
										</div>
										<p class="text-foreground text-base font-semibold tracking-tight">
											{project.title}
										</p>
										<p class="text-muted-foreground line-clamp-2 text-sm leading-6">
											{project.description}
										</p>
									</div>

									<div class="flex flex-wrap items-center gap-2">
										{#each project.stack as tech (tech)}
											<TechBadge name={tech} variant="blue" />
										{/each}
										<Badge variant="outline" class="rounded-full px-2.5 py-1">
											{project.featureCount} feature{project.featureCount === 1 ? '' : 's'}
										</Badge>
									</div>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="admin-collection-card overflow-hidden">
			<Card.Content class="space-y-5 p-5">
				<div class="flex items-center justify-between gap-3">
					<div class="space-y-1">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Recent writing</p>
						<h3 class="text-foreground text-xl font-semibold tracking-tight">
							Latest blog activity
						</h3>
					</div>
					<Button href="/admin/blogs" variant="outline" size="sm">
						<span>Open blogs</span>
						<ArrowRight class="size-4" />
					</Button>
				</div>

				<div class="grid gap-3">
					{#if data.previews.recentBlogs.length === 0}
						<div
							class="border-border/70 bg-background/75 rounded-[1.35rem] border border-dashed px-4 py-6 text-center"
						>
							<p class="text-foreground text-sm font-medium">No blog posts yet</p>
							<p class="text-muted-foreground mt-1 text-sm">
								Write the first post to populate the editorial queue.
							</p>
						</div>
					{:else}
						{#each data.previews.recentBlogs as blog (blog.id)}
							<a
								href={`/admin/blogs/${blog.id}`}
								class="border-border/70 hover:border-border bg-background/75 rounded-[1.35rem] border p-4 transition-colors"
							>
								<div class="space-y-3">
									<div class="space-y-1">
										<div class="flex flex-wrap items-center gap-2">
											<Badge variant="secondary" class="gap-1.5 rounded-full px-2.5 py-1">
												<BookOpenText class="size-3.5" />
												<span>{formatDate(blog.createdAt)}</span>
											</Badge>
										</div>
										<p class="text-foreground text-base font-semibold tracking-tight">
											{blog.title}
										</p>
										<p class="text-muted-foreground line-clamp-2 text-sm leading-6">
											{blog.description}
										</p>
									</div>

									<div class="flex flex-wrap gap-2">
										{#each blog.tags as tag (tag)}
											<Badge variant="outline" class="rounded-full px-2.5 py-1">{tag}</Badge>
										{/each}
									</div>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
		<Card.Root class="admin-collection-card overflow-hidden">
			<Card.Content class="space-y-5 p-5">
				<div class="flex items-center justify-between gap-3">
					<div class="space-y-1">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Career timeline</p>
						<h3 class="text-foreground text-xl font-semibold tracking-tight">Role snapshot</h3>
					</div>
					<Button href="/admin/careers" variant="outline" size="sm">
						<span>Manage</span>
						<ArrowRight class="size-4" />
					</Button>
				</div>

				<div class="grid gap-3">
					{#if data.previews.careers.length === 0}
						<div
							class="border-border/70 bg-background/75 rounded-[1.35rem] border border-dashed px-4 py-6 text-center"
						>
							<p class="text-foreground text-sm font-medium">No career entries yet</p>
							<p class="text-muted-foreground mt-1 text-sm">
								Add the first role to give the timeline structure.
							</p>
						</div>
					{:else}
						{#each data.previews.careers as career (career.id)}
							<a
								href={`/admin/careers/${career.id}`}
								class="border-border/70 hover:border-border bg-background/75 rounded-[1.35rem] border p-4 transition-colors"
							>
								<div class="space-y-3">
									<div class="flex items-start gap-3">
										<div
											class="border-border/70 bg-muted/40 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border"
										>
											{#if career.logo}
												<img
													src={career.logo}
													alt={`${career.company} logo`}
													class="size-full object-contain p-2"
												/>
											{:else}
												<UserRound class="text-muted-foreground size-4" />
											{/if}
										</div>

										<div class="min-w-0 flex-1 space-y-1">
											<p class="text-foreground text-base font-semibold tracking-tight">
												{career.designation || career.company}
											</p>
											<p class="text-muted-foreground text-sm">
												{career.company}
												{#if career.location}
													<span> • {career.location}</span>
												{/if}
											</p>
											<p class="text-muted-foreground text-xs">
												{career.start}{career.end ? ` - ${career.end}` : ' - Present'}
											</p>
										</div>

										<Badge variant="outline" class="rounded-full px-2.5 py-1">
											{career.highlights} highlight{career.highlights === 1 ? '' : 's'}
										</Badge>
									</div>

									<div class="flex flex-wrap gap-2">
										{#each career.skills as skill (skill)}
											<TechBadge name={skill} variant="purple" />
										{/each}
									</div>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="admin-collection-card overflow-hidden">
			<Card.Content class="space-y-5 p-5">
				<div class="flex items-center justify-between gap-3">
					<div class="space-y-1">
						<p class="text-muted-foreground text-xs tracking-[0.18em] uppercase">Skill library</p>
						<h3 class="text-foreground text-xl font-semibold tracking-tight">Category snapshot</h3>
					</div>
					<Button href="/admin/skills" variant="outline" size="sm">
						<span>Open skills</span>
						<ArrowRight class="size-4" />
					</Button>
				</div>

				<div class="grid gap-3">
					{#if data.previews.skillCategories.length === 0}
						<div
							class="border-border/70 bg-background/75 rounded-[1.35rem] border border-dashed px-4 py-6 text-center"
						>
							<p class="text-foreground text-sm font-medium">No skill categories yet</p>
							<p class="text-muted-foreground mt-1 text-sm">
								Create categories to build out the skills section.
							</p>
						</div>
					{:else}
						{#each data.previews.skillCategories as category (category.id)}
							<a
								href="/admin/skills"
								class="border-border/70 hover:border-border bg-background/75 rounded-[1.35rem] border p-4 transition-colors"
							>
								<div class="space-y-3">
									<div class="flex flex-wrap items-center gap-2">
										<Badge variant="outline" class="rounded-full px-2.5 py-1">
											Order {category.ordering + 1}
										</Badge>
										<Badge variant="secondary" class="rounded-full px-2.5 py-1">
											{category.totalSkills} skill{category.totalSkills === 1 ? '' : 's'}
										</Badge>
									</div>
									<div class="space-y-1">
										<p class="text-foreground text-base font-semibold tracking-tight">
											{category.title}
										</p>
										<p class="text-muted-foreground text-sm">
											{category.totalSkills === 0
												? 'This category still needs items.'
												: 'Preview of the technologies currently grouped here.'}
										</p>
									</div>

									<div class="flex flex-wrap gap-2">
										{#each category.sampleSkills as skill (skill)}
											<TechBadge name={skill} variant="blue" />
										{/each}
									</div>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</section>
