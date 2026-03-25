<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import * as Sidebar from '$lib/components/admin/ui/sidebar/index.js';
	import './admin.css';

	const { children } = $props();

	let rebuilding = $state(false);

	const isLoginRoute = $derived(page.url.pathname === '/admin/login');

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
		<AdminSidebar onRebuild={handleRebuild} {rebuilding} onLogout={handleLogout} />

		<Sidebar.Inset class="admin-shell">
			<div class="admin-shell-body">
				<div class="fixed top-4 left-4 z-30 sm:hidden">
					<Sidebar.Trigger
						class="border-border/70 bg-card/90 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.22)]"
					/>
				</div>
				<div class="admin-shell-content">
					{@render children()}
				</div>
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
