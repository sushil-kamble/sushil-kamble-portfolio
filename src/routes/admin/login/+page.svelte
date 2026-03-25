<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Lock, ArrowRight, Loader2 } from 'lucide-svelte';

	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let passwordInput: HTMLInputElement | undefined;

	onMount(() => {
		passwordInput?.focus();
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!password.trim() || loading) return;

		loading = true;
		error = '';

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password })
			});

			if (res.ok) {
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

<div class="login-container">
	<div class="login-card">
		<div class="login-icon">
			<Lock size={24} strokeWidth={1.5} />
		</div>
		<h1>Portfolio Admin</h1>
		<p class="login-subtitle">Enter your password to continue</p>

		<form onsubmit={handleSubmit}>
			<div class="input-group">
				<input
					bind:this={passwordInput}
					type="password"
					bind:value={password}
					placeholder="Password"
					autocomplete="current-password"
				/>
			</div>

			{#if error}
				<p class="error-msg">{error}</p>
			{/if}

			<button type="submit" disabled={loading || !password.trim()} class="login-btn">
				{#if loading}
					<Loader2 size={18} class="spin" />
					<span>Signing in...</span>
				{:else}
					<span>Sign in</span>
					<ArrowRight size={16} />
				{/if}
			</button>
		</form>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background: #f7f7f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
	}

	.login-card {
		width: 100%;
		max-width: 380px;
		background: white;
		border-radius: 16px;
		padding: 40px 32px;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.06),
			0 8px 24px rgba(0, 0, 0, 0.06);
		text-align: center;
	}

	.login-icon {
		width: 48px;
		height: 48px;
		margin: 0 auto 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f0ede8;
		border-radius: 12px;
		color: #555;
	}

	h1 {
		font-size: 22px;
		font-weight: 700;
		margin: 0 0 6px;
		letter-spacing: -0.02em;
		color: #1a1a1a;
	}

	.login-subtitle {
		font-size: 14px;
		color: #888;
		margin: 0 0 28px;
	}

	.input-group {
		margin-bottom: 16px;
	}

	input {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		font-size: 15px;
		background: #fafaf9;
		color: #1a1a1a;
		outline: none;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		border-color: #1a1a1a;
		background: white;
		box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
	}

	input::placeholder {
		color: #aaa;
	}

	.error-msg {
		font-size: 13px;
		color: #dc2626;
		margin: 0 0 12px;
	}

	.login-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px;
		border: none;
		border-radius: 10px;
		background: #1a1a1a;
		color: white;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		letter-spacing: -0.005em;
	}

	.login-btn:hover:not(:disabled) {
		background: #333;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.login-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
