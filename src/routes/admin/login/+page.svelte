<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRight, Loader2, Lock } from 'lucide-svelte';
	import * as Alert from '$lib/components/admin/ui/alert/index.js';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Card from '$lib/components/admin/ui/card/index.js';
	import * as Field from '$lib/components/admin/ui/field/index.js';
	import { Input } from '$lib/components/admin/ui/input/index.js';

	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!password.trim() || loading) return;

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password })
			});

			if (response.ok) {
				await goto('/admin');
			} else {
				error = 'Invalid password';
				password = '';
			}
		} catch {
			error = 'Something went wrong';
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(143,110,86,0.12),_transparent_32%),linear-gradient(180deg,_rgba(250,248,245,0.98),_rgba(243,239,233,0.95))] px-4 py-8"
>
	<Card.Root
		class="border-border/70 bg-card/95 w-full max-w-md rounded-[1.75rem] shadow-xl shadow-black/5"
	>
		<Card.Header class="space-y-5 text-center">
			<div
				class="border-border/70 bg-background/90 mx-auto flex size-14 items-center justify-center rounded-[1.25rem] border shadow-sm"
			>
				<Lock class="text-muted-foreground size-6" />
			</div>
			<div class="space-y-2">
				<Card.Title class="text-2xl tracking-tight">Portfolio Admin</Card.Title>
				<Card.Description class="text-sm leading-6">
					Enter your password to access the content studio.
				</Card.Description>
			</div>
		</Card.Header>

		<Card.Content>
			<form class="space-y-4" onsubmit={handleSubmit}>
				<Field.Field>
					<Field.Label for="admin-password">Password</Field.Label>
					<Input
						id="admin-password"
						type="password"
						bind:value={password}
						placeholder="Enter your password"
						autocomplete="current-password"
						autofocus
					/>
				</Field.Field>

				{#if error}
					<Alert.Root variant="destructive">
						<Alert.Title>Sign in failed</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}

				<Button
					type="submit"
					size="lg"
					class="w-full justify-center"
					disabled={loading || !password.trim()}
				>
					{#if loading}
						<Loader2 class="size-4 animate-spin" />
						<span>Signing in...</span>
					{:else}
						<span>Sign in</span>
						<ArrowRight class="size-4" />
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
