<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ProjectView from '$lib/components/views/ProjectView.svelte';

	let { data } = $props();
</script>

<a
	href="/projects"
	class="mb-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-vsc-text-muted transition-colors hover:bg-vsc-panel hover:text-vsc-blue"
>
	<ArrowLeft size={14} />
	Back to all projects
</a>

<ProjectView project={data.project} />
