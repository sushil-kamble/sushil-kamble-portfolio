<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Loader2, Rocket } from 'lucide-svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import * as Sidebar from '$lib/components/admin/ui/sidebar/index.js';
	import './admin.css';

	const { children } = $props();

	let rebuilding = $state(false);

	const isLoginRoute = $derived(page.url.pathname === '/admin/login');
	const sectionLabel = $derived.by(() => {
		if (page.url.pathname === '/admin') return 'Dashboard';
		const segment = page.url.pathname.split('/').filter(Boolean)[1] ?? 'admin';
		return segment.charAt(0).toUpperCase() + segment.slice(1);
	});

	async function handleRebuild() {
		if (rebuilding) return;
		rebuilding = true;
		try {
			await fetch('/deploy', { method: 'POST' });
		} finally {
			setTimeout(() => (rebuilding = false), 3000);
		}
	}

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		await goto('/admin/login');
	}
</script>

{#if isLoginRoute}
	{@render children()}
{:else}
	<Sidebar.Provider class="bg-background">
		<AdminSidebar onLogout={handleLogout} />

		<Sidebar.Inset class="min-h-screen">
			<header class="border-border/80 bg-card/90 sticky top-0 z-20 border-b backdrop-blur-sm">
				<div class="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
					<div class="flex min-w-0 items-center gap-3">
						<Sidebar.Trigger class="-ml-1" />
						<h1 class="text-foreground truncate text-sm font-semibold">{sectionLabel}</h1>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors disabled:opacity-50"
							disabled={rebuilding}
							onclick={handleRebuild}
						>
							{#if rebuilding}
								<Loader2 class="size-3.5 animate-spin" />
								<span>Building…</span>
							{:else}
								<Rocket class="size-3.5" />
								<span>Rebuild</span>
							{/if}
						</button>
					</div>
				</div>
			</header>

			<div class="flex-1 px-4 py-5 sm:px-6">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
