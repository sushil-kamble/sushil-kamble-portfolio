<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import PostView from '$lib/components/views/PostView.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title} — Sushil Kamble</title>
	<meta name="description" content={data.post.description} />
	<link rel="canonical" href={`https://sushilkamble.com/posts/${data.post.slug}`} />
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	<meta property="og:type" content="article" />
</svelte:head>

<a
	href="/posts"
	class="mb-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-vsc-text-muted transition-colors hover:bg-vsc-panel hover:text-vsc-green"
>
	<ArrowLeft size={14} />
	Back to all posts
</a>

<PostView post={data.post} />
