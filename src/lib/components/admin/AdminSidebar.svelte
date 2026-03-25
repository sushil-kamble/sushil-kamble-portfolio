<script lang="ts">
	import { page } from '$app/state';
	import {
		LayoutDashboard,
		User,
		Briefcase,
		Zap,
		FolderKanban,
		FileText,
		Rocket,
		LogOut
	} from 'lucide-svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Sidebar from '$lib/components/admin/ui/sidebar/index.js';

	interface Props {
		rebuilding: boolean;
		onRebuild: () => void;
		onLogout: () => void;
	}

	let { rebuilding, onRebuild, onLogout }: Props = $props();

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
</script>

<Sidebar.Root variant="inset" collapsible="offcanvas">
	<Sidebar.Header class="border-sidebar-border/70 gap-4 border-b px-3 py-4">
		<div class="flex items-center gap-3 px-2">
			<div
				class="border-sidebar-border/80 bg-sidebar-accent text-sidebar-accent-foreground flex size-10 items-center justify-center rounded-2xl border shadow-sm"
			>
				<LayoutDashboard class="size-4" />
			</div>
			<div class="min-w-0">
				<p class="truncate text-sm font-semibold tracking-tight">Portfolio Admin</p>
				<p class="text-sidebar-foreground/55 truncate text-[11px] tracking-[0.22em] uppercase">
					Content studio
				</p>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="px-2 py-3">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navItems as item (item.href)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={isActive(item.href)}
								tooltipContent={item.label}
								size="lg"
							>
								{#snippet child({ props })}
									<a href={item.href} {...props}>
										<item.icon class="size-4" />
										<span>{item.label}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="border-sidebar-border/70 gap-3 border-t px-3 py-4">
		<div class="border-sidebar-border/70 bg-sidebar-accent/40 rounded-2xl border p-3">
			<p class="text-sidebar-foreground text-xs font-medium">Deployment</p>
			<p class="text-sidebar-foreground/60 mt-1 text-[11px] leading-5">
				Trigger a rebuild after publishing changes you want reflected on the live portfolio.
			</p>
			<Button
				variant="secondary"
				size="sm"
				class="mt-3 w-full justify-center"
				disabled={rebuilding}
				onclick={onRebuild}
			>
				<Rocket class="size-3.5" />
				<span>{rebuilding ? 'Rebuilding...' : 'Rebuild site'}</span>
			</Button>
		</div>

		<Button variant="outline" size="sm" class="w-full justify-center" onclick={onLogout}>
			<LogOut class="size-3.5" />
			<span>Log out</span>
		</Button>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
