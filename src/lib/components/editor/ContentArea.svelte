<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/constants/theme';
	import type { EditorState } from '$lib/state/editor.svelte';
	import type { PageData } from '$lib/types';
	import ReadmeView from '$lib/components/views/ReadmeView.svelte';

	import ProjectView from '$lib/components/views/ProjectView.svelte';
	import PostView from '$lib/components/views/PostView.svelte';
	import AboutView from '$lib/components/views/AboutView.svelte';
	import ContactView from '$lib/components/views/ContactView.svelte';

	const editor = getContext<EditorState>(CONTEXT_KEYS.EDITOR_STATE);
	const data = getContext<PageData>(CONTEXT_KEYS.PORTFOLIO_DATA);
</script>

<div class="flex-1 overflow-y-auto p-4 md:p-6" data-content-area>
	{#if !editor.activeTab}
		<div class="flex h-full items-center justify-center text-vsc-text-muted">
			<div class="text-center">
				<p class="text-lg">Welcome to sushil.dev</p>
				<p class="mt-2 text-sm">Open a file from the sidebar to get started</p>
				<p class="mt-1 text-xs">
					Press <kbd class="rounded bg-vsc-panel px-1.5 py-0.5 text-vsc-blue">Cmd+K</kbd> to search
				</p>
			</div>
		</div>
	{:else if editor.activeTab.type === 'readme'}
		<ReadmeView />
	{:else if editor.activeTab.type === 'project'}
		{@const project = data.projects.find((p) => p.id === editor.activeTab?.dataId)}
		{#if project}
			<ProjectView {project} />
		{/if}
	{:else if editor.activeTab.type === 'post'}
		{@const post = data.blogs.find((b) => b.id === editor.activeTab?.dataId)}
		{#if post}
			<PostView {post} />
		{/if}
	{:else if editor.activeTab.type === 'about'}
		<AboutView />
	{:else if editor.activeTab.type === 'contact'}
		<ContactView />
	{/if}
</div>
