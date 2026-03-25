<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		LayoutDashboard,
		User,
		Briefcase,
		Zap,
		FolderKanban,
		FileText,
		Rocket,
		LogOut,
		Menu,
		X,
		Loader2
	} from 'lucide-svelte';

	const { children } = $props();

	let sidebarOpen = $state(false);
	let rebuilding = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/about', label: 'About', icon: User },
		{ href: '/admin/careers', label: 'Careers', icon: Briefcase },
		{ href: '/admin/skills', label: 'Skills', icon: Zap },
		{ href: '/admin/projects', label: 'Projects', icon: FolderKanban },
		{ href: '/admin/blogs', label: 'Blogs', icon: FileText }
	];

	function isActive(href: string): boolean {
		if (href === '/admin') return page.url.pathname === '/admin';
		return page.url.pathname.startsWith(href);
	}

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
		document.cookie = 'admin_token=; Path=/admin; Max-Age=0';
		await goto('/admin/login');
	}
</script>

<div class="admin-root">
	<!-- Mobile top bar -->
	<header class="admin-topbar">
		<button class="hamburger" onclick={() => (sidebarOpen = !sidebarOpen)} aria-label="Toggle menu">
			{#if sidebarOpen}
				<X size={20} />
			{:else}
				<Menu size={20} />
			{/if}
		</button>
		<span class="topbar-title">Portfolio Admin</span>
		<button class="topbar-logout" onclick={handleLogout} aria-label="Log out">
			<LogOut size={18} />
		</button>
	</header>

	<!-- Sidebar backdrop (mobile) -->
	{#if sidebarOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="sidebar-backdrop" onclick={() => (sidebarOpen = false)} onkeydown={() => {}}></div>
	{/if}

	<!-- Sidebar -->
	<aside class="admin-sidebar" class:open={sidebarOpen}>
		<div class="sidebar-header">
			<div class="sidebar-brand">
				<div class="brand-dot"></div>
				<span>Portfolio Admin</span>
			</div>
		</div>

		<nav class="sidebar-nav">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="nav-item"
					class:active={isActive(item.href)}
					onclick={() => (sidebarOpen = false)}
				>
					<item.icon size={18} strokeWidth={1.8} />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-footer">
			<button class="rebuild-btn" onclick={handleRebuild} disabled={rebuilding}>
				{#if rebuilding}
					<Loader2 size={16} class="spin" />
					<span>Rebuilding...</span>
				{:else}
					<Rocket size={16} />
					<span>Rebuild Site</span>
				{/if}
			</button>

			<button class="logout-btn" onclick={handleLogout}>
				<LogOut size={16} />
				<span>Log out</span>
			</button>
		</div>
	</aside>

	<!-- Main content -->
	<main class="admin-main">
		{@render children()}
	</main>
</div>

<style>
	/* ── Layout ── */
	.admin-root {
		min-height: 100vh;
		background: #f7f7f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		color: #1a1a1a;
	}

	/* ── Mobile Top Bar ── */
	.admin-topbar {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 16px;
		height: 56px;
		background: white;
		border-bottom: 1px solid #e8e5e0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.hamburger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		background: none;
		border-radius: 8px;
		cursor: pointer;
		color: #555;
		transition: all 0.15s;
	}

	.hamburger:hover {
		background: #f0ede8;
		color: #1a1a1a;
	}

	.topbar-title {
		flex: 1;
		font-weight: 600;
		font-size: 15px;
		letter-spacing: -0.01em;
	}

	.topbar-logout {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		background: none;
		border-radius: 8px;
		cursor: pointer;
		color: #888;
		transition: all 0.15s;
	}

	.topbar-logout:hover {
		background: #fef2f2;
		color: #dc2626;
	}

	/* ── Sidebar ── */
	.admin-sidebar {
		position: fixed;
		top: 56px;
		left: 0;
		bottom: 0;
		width: 260px;
		background: white;
		border-right: 1px solid #e8e5e0;
		display: flex;
		flex-direction: column;
		z-index: 50;
		transform: translateX(-100%);
		transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
	}

	.admin-sidebar.open {
		transform: translateX(0);
	}

	.sidebar-backdrop {
		position: fixed;
		inset: 56px 0 0;
		background: rgba(0, 0, 0, 0.2);
		z-index: 45;
		backdrop-filter: blur(2px);
	}

	.sidebar-header {
		padding: 20px 16px 8px;
		display: none;
	}

	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		font-size: 15px;
		letter-spacing: -0.02em;
		color: #1a1a1a;
	}

	.brand-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #22c55e;
		box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
	}

	/* ── Navigation ── */
	.sidebar-nav {
		flex: 1;
		padding: 12px 8px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow-y: auto;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		color: #666;
		text-decoration: none;
		transition: all 0.15s;
		letter-spacing: -0.005em;
	}

	.nav-item:hover {
		background: #f5f3f0;
		color: #1a1a1a;
	}

	.nav-item.active {
		background: #f0ede8;
		color: #1a1a1a;
		font-weight: 600;
	}

	/* ── Sidebar Footer ── */
	.sidebar-footer {
		padding: 12px 8px;
		border-top: 1px solid #e8e5e0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.rebuild-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border: 1px solid #e8e5e0;
		background: linear-gradient(135deg, #fafaf9, #f5f3f0);
		border-radius: 8px;
		font-size: 13px;
		font-weight: 600;
		color: #1a1a1a;
		cursor: pointer;
		transition: all 0.2s;
		letter-spacing: -0.005em;
	}

	.rebuild-btn:hover:not(:disabled) {
		border-color: #22c55e;
		background: linear-gradient(135deg, #f0fdf4, #dcfce7);
		color: #15803d;
		box-shadow: 0 2px 8px rgba(34, 197, 94, 0.12);
	}

	.rebuild-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.logout-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border: none;
		background: none;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		color: #888;
		cursor: pointer;
		transition: all 0.15s;
	}

	.logout-btn:hover {
		background: #fef2f2;
		color: #dc2626;
	}

	/* ── Main Content ── */
	.admin-main {
		padding: 16px;
		min-height: calc(100vh - 56px);
	}

	/* ── Desktop (768px+) ── */
	@media (min-width: 768px) {
		.admin-topbar {
			display: none;
		}

		.sidebar-backdrop {
			display: none;
		}

		.admin-sidebar {
			top: 0;
			transform: translateX(0);
			box-shadow: none;
		}

		.sidebar-header {
			display: block;
		}

		.admin-main {
			margin-left: 260px;
			padding: 32px;
		}
	}

	@media (min-width: 1024px) {
		.admin-main {
			padding: 40px 48px;
		}
	}
</style>
