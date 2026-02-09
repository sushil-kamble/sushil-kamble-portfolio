<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Deploy Trigger</title>
	<meta name="description" content="Internal deploy trigger endpoint." />
	<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
	<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
</svelte:head>

<div class="mx-auto max-w-3xl">
	<p class="text-sm text-vsc-green">// deploy.sh --trigger</p>

	<div class="mt-4 rounded-lg border border-vsc-border bg-vsc-panel p-4">
		<p class="text-sm">
			<span class="text-vsc-purple">const</span>
			<span class="text-vsc-blue"> status</span>
			<span class="text-vsc-text"> = </span>
			{#if data.ok}
				<span class="text-vsc-green">'success'</span>
			{:else}
				<span class="text-vsc-orange">'failed'</span>
			{/if}
			<span class="text-vsc-text">;</span>
		</p>

		<div class="mt-3 space-y-1.5 text-sm">
			<p>
				<span class="text-vsc-text-muted">HTTP:</span>
				<span class={data.ok ? 'text-vsc-green' : 'text-vsc-orange'}>
					{data.status}
					{data.statusText}
				</span>
			</p>
			<p>
				<span class="text-vsc-text-muted">Triggered at:</span>
				<span class="text-vsc-text">{data.triggeredAt}</span>
			</p>
			<p class="text-vsc-text-muted">Refresh this page to trigger another deploy.</p>
		</div>

		{#if data.responseBody}
			<pre
				class="mt-4 overflow-x-auto rounded border border-vsc-border bg-vsc-bg p-3 text-xs text-vsc-text">{data.responseBody}</pre>
		{/if}
	</div>
</div>
