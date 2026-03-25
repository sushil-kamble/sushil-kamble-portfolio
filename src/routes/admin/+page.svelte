<script lang="ts">
	import { Briefcase, Zap, FolderKanban, FileText } from 'lucide-svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const cards = $derived.by(() => [
		{
			label: 'Careers',
			count: data.counts.careers,
			icon: Briefcase,
			href: '/admin/careers',
			color: '#3b82f6'
		},
		{
			label: 'Skills',
			count: data.counts.skills,
			icon: Zap,
			href: '/admin/skills',
			color: '#f59e0b'
		},
		{
			label: 'Projects',
			count: data.counts.projects,
			icon: FolderKanban,
			href: '/admin/projects',
			color: '#22c55e'
		},
		{
			label: 'Blogs',
			count: data.counts.blogs,
			icon: FileText,
			href: '/admin/blogs',
			color: '#8b5cf6'
		}
	]);
</script>

<div class="dashboard">
	<h1>Dashboard</h1>
	<p class="subtitle">Overview of your portfolio content</p>

	<div class="stats-grid">
		{#each cards as card (card.href)}
			<a href={card.href} class="stat-card">
				<div class="stat-icon" style="background: {card.color}10; color: {card.color}">
					<card.icon size={20} />
				</div>
				<div class="stat-info">
					<span class="stat-count">{card.count}</span>
					<span class="stat-label">{card.label}</span>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.dashboard h1 {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 4px;
	}

	.subtitle {
		color: #888;
		font-size: 14px;
		margin: 0 0 28px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 20px;
		background: white;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		border: 1px solid #e8e5e0;
		transition: all 0.2s;
	}

	.stat-card:hover {
		border-color: #d0cdc6;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		transform: translateY(-1px);
	}

	.stat-icon {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		flex-shrink: 0;
	}

	.stat-count {
		display: block;
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.stat-label {
		font-size: 13px;
		color: #888;
		font-weight: 500;
	}

	@media (min-width: 640px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
