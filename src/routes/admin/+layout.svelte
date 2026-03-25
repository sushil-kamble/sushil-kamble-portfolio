<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Bell, Loader2, ShieldCheck } from 'lucide-svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import { Badge } from '$lib/components/admin/ui/badge/index.js';
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
	<Sidebar.Provider
		class="bg-[radial-gradient(circle_at_top,_rgba(143,110,86,0.09),_transparent_28%),linear-gradient(180deg,_rgba(250,248,245,0.98),_rgba(245,242,238,0.88))]"
	>
		<AdminSidebar {rebuilding} onRebuild={handleRebuild} onLogout={handleLogout} />

		<Sidebar.Inset class="min-h-screen">
			<header class="border-border/60 bg-background/80 sticky top-0 z-20 border-b backdrop-blur-xl">
				<div class="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
					<div class="flex min-w-0 items-center gap-3">
						<Sidebar.Trigger class="-ml-1" />
						<div class="min-w-0">
							<p class="text-foreground truncate text-sm font-medium">{sectionLabel}</p>
							<p class="text-muted-foreground truncate text-xs">
								Manage portfolio content and publishing flows
							</p>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<Badge variant="outline" class="hidden gap-1.5 rounded-full px-2.5 py-1 sm:inline-flex">
							<ShieldCheck class="size-3.5" />
							<span>Protected</span>
						</Badge>
						<button
							type="button"
							class="border-border/70 bg-background/85 text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-full border transition-colors"
							aria-label="Notifications"
						>
							{#if rebuilding}
								<Loader2 class="size-4 animate-spin" />
							{:else}
								<Bell class="size-4" />
							{/if}
						</button>
					</div>
				</div>
			</header>

			<div class="flex-1 px-4 py-5 sm:px-6 lg:px-8">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
