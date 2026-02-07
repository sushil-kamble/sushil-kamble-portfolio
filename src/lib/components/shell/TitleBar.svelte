<script lang="ts">
	import { Code2 } from 'lucide-svelte';
</script>

<header class="flex h-10 select-none items-center border-b border-vsc-border bg-vsc-sidebar px-4">
	<!-- Traffic lights -->
	<div class="mr-4 flex items-center gap-2">
		<span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
		<span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
		<span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
	</div>

	<!-- Title -->
	<div class="flex flex-1 items-center justify-center gap-2 text-xs text-vsc-text-muted">
		<Code2 size={14} />
		<span>sushil.dev — VS Code</span>
	</div>

	<!-- Spacer for symmetry -->
	<div class="w-16"></div>
</header>
