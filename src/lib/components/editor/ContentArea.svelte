<script lang="ts">
	import { getContext } from 'svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { PageData } from '$lib/types';
	import ReadmeView from '$lib/components/views/ReadmeView.svelte';
	import ProjectView from '$lib/components/views/ProjectView.svelte';
	import ProjectsListView from '$lib/components/views/ProjectsListView.svelte';
	import PostView from '$lib/components/views/PostView.svelte';
	import PostsListView from '$lib/components/views/PostsListView.svelte';
	import AboutView from '$lib/components/views/AboutView.svelte';
	import ContactView from '$lib/components/views/ContactView.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);

	const selectedProject = $derived(
		editor.selectedProjectId
			? (data.projects.find((p) => p.id === editor.selectedProjectId) ?? null)
			: null
	);
	const selectedPost = $derived(
		editor.selectedPostId ? (data.blogs.find((b) => b.id === editor.selectedPostId) ?? null) : null
	);
</script>

<div class="flex-1 overflow-y-auto p-4 md:p-6" data-content-area>
	{#if editor.activeTab?.type === 'readme'}
		<ReadmeView />
	{:else if editor.activeTab?.type === 'about'}
		<AboutView />
	{:else if editor.activeTab?.type === 'contact'}
		<ContactView />
	{:else if editor.activeTab?.type === 'projects'}
		{#if selectedProject}
			<button
				onclick={() => editor.showProjectsList()}
				class="mb-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-vsc-text-muted transition-colors hover:bg-vsc-panel hover:text-vsc-blue"
			>
				<ArrowLeft size={14} />
				Back to all projects
			</button>
			<ProjectView project={selectedProject} />
		{:else}
			<ProjectsListView />
		{/if}
	{:else if editor.activeTab?.type === 'posts'}
		{#if selectedPost}
			<button
				onclick={() => editor.showPostsList()}
				class="mb-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-vsc-text-muted transition-colors hover:bg-vsc-panel hover:text-vsc-green"
			>
				<ArrowLeft size={14} />
				Back to all posts
			</button>
			<PostView post={selectedPost} />
		{:else}
			<PostsListView />
		{/if}
	{/if}
</div>
