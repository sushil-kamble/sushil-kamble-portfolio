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

<div class="flex min-h-screen items-center justify-center bg-[#f7f6f4] px-5 py-8">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<div
				class="bg-foreground text-background mx-auto flex size-10 items-center justify-center rounded-xl"
			>
				<Lock class="size-4" />
			</div>
			<h1 class="text-foreground mt-4 text-xl font-semibold tracking-tight">Admin Login</h1>
			<p class="text-muted-foreground mt-1.5 text-sm">Enter your password to continue.</p>
		</div>

		<Card.Root class="border-border rounded-xl border">
			<Card.Content class="p-5">
				<form class="space-y-4" onsubmit={handleSubmit}>
					<Field.Field>
						<Field.Label for="admin-password">Password</Field.Label>
						<Input
							id="admin-password"
							type="password"
							bind:value={password}
							placeholder="••••••••"
							autocomplete="current-password"
							autofocus
							class="h-11"
						/>
					</Field.Field>

					{#if error}
						<Alert.Root variant="destructive">
							<Alert.Description>{error}</Alert.Description>
						</Alert.Root>
					{/if}

					<Button
						type="submit"
						size="lg"
						class="h-11 w-full justify-center"
						disabled={loading || !password.trim()}
					>
						{#if loading}
							<Loader2 class="size-4 animate-spin" />
							<span>Signing in…</span>
						{:else}
							<span>Sign in</span>
							<ArrowRight class="size-4" />
						{/if}
					</Button>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</div>
