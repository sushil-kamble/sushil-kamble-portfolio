<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import PostView from '$lib/components/views/PostView.svelte';

	let { data } = $props();
</script>

<a
	href="/posts"
	class="mb-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-vsc-text-muted transition-colors hover:bg-vsc-panel hover:text-vsc-green"
>
	<ArrowLeft size={14} />
	Back to all posts
</a>

<PostView post={data.post} />
