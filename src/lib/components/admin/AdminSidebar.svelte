<script lang="ts">
	import { page } from '$app/state';
	import {
		LayoutDashboard,
		Loader2,
		Rocket,
		User,
		Briefcase,
		Zap,
		FolderKanban,
		FileText,
		LogOut
	} from 'lucide-svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Sidebar from '$lib/components/admin/ui/sidebar/index.js';

	interface Props {
		onRebuild: () => void;
		rebuilding?: boolean;
		onLogout: () => void;
	}

	let { onRebuild, rebuilding = false, onLogout }: Props = $props();

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
	<Sidebar.Header class="px-3 py-4">
		<div class="flex items-center gap-2.5 px-2">
			<div class="bg-foreground text-background flex size-8 items-center justify-center rounded-lg">
				<span class="text-xs font-bold">SK</span>
			</div>
			<div class="min-w-0">
				<p class="truncate text-sm font-semibold">Admin</p>
				<p class="text-muted-foreground truncate text-xs">Portfolio CMS</p>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="px-2 py-1">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navItems as item (item.href)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={isActive(item.href)}
								tooltipContent={item.label}
								size="default"
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

	<Sidebar.Footer class="border-sidebar-border space-y-2 px-3 py-3">
		<Button
			variant="default"
			size="sm"
			class="w-full justify-start"
			type="button"
			disabled={rebuilding}
			onclick={onRebuild}
		>
			{#if rebuilding}
				<Loader2 class="size-4 animate-spin" />
				<span>Building…</span>
			{:else}
				<Rocket class="size-4" />
				<span>Rebuild</span>
			{/if}
		</Button>

		<Button
			variant="ghost"
			size="sm"
			class="text-muted-foreground hover:text-foreground w-full justify-start"
			onclick={onLogout}
		>
			<LogOut class="size-4" />
			<span>Log out</span>
		</Button>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
