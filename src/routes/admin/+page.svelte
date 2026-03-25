<script lang="ts">
	import {
		ArrowRight,
		Briefcase,
		FileText,
		FolderKanban,
		Images,
		LayoutDashboard,
		Link2,
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
			accent: 'text-sky-600 bg-sky-50'
		},
		{
			label: 'Skills',
			count: data.counts.totalSkills,
			icon: Zap,
			href: '/admin/skills',
			accent: 'text-amber-600 bg-amber-50'
		},
		{
			label: 'Projects',
			count: data.counts.projects,
			icon: FolderKanban,
			href: '/admin/projects',
			accent: 'text-emerald-600 bg-emerald-50'
		},
		{
			label: 'Blogs',
			count: data.counts.blogs,
			icon: FileText,
			href: '/admin/blogs',
			accent: 'text-rose-600 bg-rose-50'
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
			helper: 'Needs branding'
		},
		{
			label: 'Projects missing screenshots',
			value: data.attention.projectsWithoutScreenshots,
			href: '/admin/projects',
			helper: 'Add visuals'
		},
		{
			label: 'Blogs without tags',
			value: data.attention.blogsWithoutTags,
			href: '/admin/blogs',
			helper: 'Tag needed'
		},
		{
			label: 'Empty skill categories',
			value: data.attention.emptySkillCategories,
			href: '/admin/skills',
			helper: 'Add skills'
		}
	]);

	const attentionCount = $derived.by(() =>
		attentionItems.reduce((sum, item) => sum + Number(item.value > 0), 0)
	);
</script>

<section class="admin-page">
	<AdminPageHeader title="Dashboard" description="Overview of your portfolio content.">
		{#snippet icon()}
			<LayoutDashboard class="size-4" />
		{/snippet}
	</AdminPageHeader>

	<!-- Stats row -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="border-border bg-card rounded-xl border p-4">
			<p class="text-muted-foreground text-xs font-medium">Total entries</p>
			<p class="text-foreground mt-1.5 text-2xl font-semibold tabular-nums">
				{data.counts.totalEntries}
			</p>
		</div>
		<div class="border-border bg-card rounded-xl border p-4">
			<p class="text-muted-foreground text-xs font-medium">Sections ready</p>
			<p class="text-foreground mt-1.5 text-2xl font-semibold tabular-nums">
				{readySections}<span class="text-muted-foreground text-sm font-normal"
					>/{data.counts.sections}</span
				>
			</p>
		</div>
		<div class="border-border bg-card rounded-xl border p-4">
			<p class="text-muted-foreground text-xs font-medium">Screenshots</p>
			<p class="text-foreground mt-1.5 text-2xl font-semibold tabular-nums">
				{data.highlights.projectScreenshots}
			</p>
		</div>
		<div class="border-border bg-card rounded-xl border p-4">
			<p class="text-muted-foreground text-xs font-medium">Skills indexed</p>
			<p class="text-foreground mt-1.5 text-2xl font-semibold tabular-nums">
				{data.counts.totalSkills}
			</p>
		</div>
	</div>

	<!-- Section cards -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each sectionCards as card (card.href)}
			<a
				href={card.href}
				class="border-border bg-card hover:bg-accent/40 group flex flex-col gap-3 rounded-xl border p-4 transition-colors"
			>
				<div class="flex items-center justify-between">
					<div class={`flex size-8 items-center justify-center rounded-lg ${card.accent}`}>
						<card.icon class="size-4" />
					</div>
					<ArrowRight
						class="text-muted-foreground/50 group-hover:text-foreground size-3.5 transition-colors"
					/>
				</div>
				<div>
					<p class="text-foreground text-2xl font-semibold tabular-nums">{card.count}</p>
					<p class="text-muted-foreground text-xs font-medium">{card.label}</p>
				</div>
			</a>
		{/each}
	</div>

	<div class="grid gap-5 lg:grid-cols-[1fr_1fr]">
		<!-- Quick actions -->
		<Card.Root class="admin-surface">
			<Card.Content class="p-4">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-foreground text-sm font-semibold">Quick actions</h2>
					<Plus class="text-muted-foreground size-4" />
				</div>
				<div class="grid gap-1.5">
					<a
						href="/admin/projects/new"
						class="bg-muted/50 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
					>
						<span>New project</span>
						<ArrowRight class="text-muted-foreground size-3.5" />
					</a>
					<a
						href="/admin/blogs/new"
						class="bg-muted/50 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
					>
						<span>New blog post</span>
						<ArrowRight class="text-muted-foreground size-3.5" />
					</a>
					<a
						href="/admin/careers/new"
						class="bg-muted/50 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
					>
						<span>New career entry</span>
						<ArrowRight class="text-muted-foreground size-3.5" />
					</a>
					<a
						href="/admin/about"
						class="bg-muted/50 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
					>
						<span>Edit about</span>
						<ArrowRight class="text-muted-foreground size-3.5" />
					</a>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Attention items -->
		<Card.Root class="admin-surface">
			<Card.Content class="p-4">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-foreground text-sm font-semibold">
						{attentionCount === 0 ? 'All clear' : `${attentionCount} need attention`}
					</h2>
					<TriangleAlert class="text-muted-foreground size-4" />
				</div>
				<div class="grid gap-1.5">
					{#each attentionItems as item (item.label)}
						<a
							href={item.href}
							class="bg-muted/50 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
						>
							<div class="min-w-0">
								<p class="text-foreground text-sm font-medium">{item.label}</p>
							</div>
							{#if item.value > 0}
								<Badge variant="secondary" class="rounded-md px-2 py-0.5 text-xs tabular-nums">
									{item.value}
								</Badge>
							{:else}
								<span class="text-xs font-medium text-emerald-600">OK</span>
							{/if}
						</a>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Projects preview -->
	<Card.Root class="admin-surface">
		<Card.Content class="p-4">
			<div class="mb-3 flex items-center justify-between">
				<h2 class="text-foreground text-sm font-semibold">Projects in live order</h2>
				<Button href="/admin/projects" variant="ghost" size="sm" class="text-xs">
					<span>View all</span>
					<ArrowRight class="size-3.5" />
				</Button>
			</div>

			{#if data.previews.projects.length === 0}
				<p class="text-muted-foreground py-6 text-center text-sm">No projects yet.</p>
			{:else}
				<div class="grid gap-2">
					{#each data.previews.projects as project (project.id)}
						<a
							href={`/admin/projects/${project.id}`}
							class="bg-muted/40 hover:bg-muted flex items-center gap-3 rounded-lg p-3 transition-colors"
						>
							<div
								class="border-border bg-card flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
							>
								{#if project.screenshot}
									<img
										src={project.screenshot}
										alt={project.title}
										class="size-full object-cover"
									/>
								{:else}
									<Images class="text-muted-foreground size-4" />
								{/if}
							</div>

							<div class="min-w-0 flex-1">
								<p class="text-foreground truncate text-sm font-medium">{project.title}</p>
								<p class="text-muted-foreground truncate text-xs">{project.description}</p>
							</div>

							<div class="flex shrink-0 items-center gap-2">
								{#if project.hasExternalLink}
									<Link2 class="text-muted-foreground size-3.5" />
								{/if}
								<Badge
									variant="secondary"
									class="rounded-md px-1.5 py-0.5 text-[10px] tabular-nums"
								>
									#{project.ordering + 1}
								</Badge>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Blogs + Careers + Skills grid -->
	<div class="grid gap-5 lg:grid-cols-3">
		<!-- Recent blogs -->
		<Card.Root class="admin-surface">
			<Card.Content class="p-4">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-foreground text-sm font-semibold">Recent posts</h2>
					<Button href="/admin/blogs" variant="ghost" size="sm" class="text-xs">
						<span>All</span>
						<ArrowRight class="size-3.5" />
					</Button>
				</div>
				{#if data.previews.recentBlogs.length === 0}
					<p class="text-muted-foreground py-4 text-center text-sm">No posts yet.</p>
				{:else}
					<div class="grid gap-2">
						{#each data.previews.recentBlogs as blog (blog.id)}
							<a
								href={`/admin/blogs/${blog.id}`}
								class="bg-muted/40 hover:bg-muted rounded-lg p-3 transition-colors"
							>
								<p class="text-foreground text-sm font-medium">{blog.title}</p>
								<p class="text-muted-foreground mt-0.5 text-xs">
									{formatDate(blog.createdAt)}
								</p>
							</a>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Career snapshot -->
		<Card.Root class="admin-surface">
			<Card.Content class="p-4">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-foreground text-sm font-semibold">Careers</h2>
					<Button href="/admin/careers" variant="ghost" size="sm" class="text-xs">
						<span>All</span>
						<ArrowRight class="size-3.5" />
					</Button>
				</div>
				{#if data.previews.careers.length === 0}
					<p class="text-muted-foreground py-4 text-center text-sm">No entries yet.</p>
				{:else}
					<div class="grid gap-2">
						{#each data.previews.careers as career (career.id)}
							<a
								href={`/admin/careers/${career.id}`}
								class="bg-muted/40 hover:bg-muted flex items-center gap-3 rounded-lg p-3 transition-colors"
							>
								<div
									class="border-border bg-card flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
								>
									{#if career.logo}
										<img
											src={career.logo}
											alt={`${career.company} logo`}
											class="size-full object-contain p-1.5"
										/>
									{:else}
										<UserRound class="text-muted-foreground size-3.5" />
									{/if}
								</div>
								<div class="min-w-0">
									<p class="text-foreground truncate text-sm font-medium">
										{career.designation || career.company}
									</p>
									<p class="text-muted-foreground truncate text-xs">
										{career.company}
										{#if career.location}
											· {career.location}
										{/if}
									</p>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Skills snapshot -->
		<Card.Root class="admin-surface">
			<Card.Content class="p-4">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-foreground text-sm font-semibold">Skill categories</h2>
					<Button href="/admin/skills" variant="ghost" size="sm" class="text-xs">
						<span>All</span>
						<ArrowRight class="size-3.5" />
					</Button>
				</div>
				{#if data.previews.skillCategories.length === 0}
					<p class="text-muted-foreground py-4 text-center text-sm">No categories yet.</p>
				{:else}
					<div class="grid gap-2">
						{#each data.previews.skillCategories as category (category.id)}
							<a
								href="/admin/skills"
								class="bg-muted/40 hover:bg-muted rounded-lg p-3 transition-colors"
							>
								<div class="flex items-center justify-between">
									<p class="text-foreground text-sm font-medium">{category.title}</p>
									<span class="text-muted-foreground text-xs tabular-nums"
										>{category.totalSkills}</span
									>
								</div>
								{#if category.sampleSkills.length > 0}
									<div class="mt-2 flex flex-wrap gap-1">
										{#each category.sampleSkills as skill (skill)}
											<TechBadge name={skill} variant="blue" />
										{/each}
									</div>
								{/if}
							</a>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</section>
