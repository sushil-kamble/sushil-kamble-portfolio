<script lang="ts">
	// ── Font imports (default only, others lazy-loaded) ──
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/500.css';
	import '@fontsource/jetbrains-mono/600.css';
	import '@fontsource/jetbrains-mono/700.css';
	// ── Styles ──
	import './layout.css';
	import '$lib/assets/themes.css';

	const { children } = $props();
</script>

{@render children()}
