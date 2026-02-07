<script lang="ts">
	import { GitBranch, Bell, CheckCircle2 } from 'lucide-svelte';

	let { language = 'TypeScript' }: { language?: string } = $props();
</script>

<footer
	class="flex h-6 items-center justify-between border-t border-vsc-border bg-vsc-statusbar px-3 text-[11px] text-vsc-text-muted select-none"
>
	<div class="flex items-center gap-3">
		<span class="flex items-center gap-1">
			<GitBranch size={12} />
			main
		</span>
		<span class="flex items-center gap-1">
			<CheckCircle2 size={12} />
			0 problems
		</span>
	</div>

	<div class="flex items-center gap-3">
		<span>UTF-8</span>
		<span>{language}</span>
		<span class="flex items-center gap-1">
			<Bell size={12} />
		</span>
	</div>
</footer>
