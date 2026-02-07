<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ProjectView from '$lib/components/views/ProjectView.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.project.title} — Sushil Kamble</title>
	<meta name="description" content={data.project.description} />
	<link rel="canonical" href={`https://sushilkamble.com/projects/${data.project.id}`} />
	<meta property="og:title" content={data.project.title} />
	<meta property="og:description" content={data.project.description} />
	<meta property="og:type" content="article" />
</svelte:head>

<a
	href="/projects"
	class="mb-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-vsc-text-muted transition-colors hover:bg-vsc-panel hover:text-vsc-blue"
>
	<ArrowLeft size={14} />
	Back to all projects
</a>

<ProjectView project={data.project} />
