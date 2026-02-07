<script lang="ts">
	import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-svelte';

	let formState = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		formState = 'submitting';
		errorMessage = '';

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const response = await fetch('https://formspree.io/f/mwvnkveg', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				formState = 'success';
				form.reset();
				// Reset to idle after 5 seconds
				setTimeout(() => {
					formState = 'idle';
				}, 5000);
			} else {
				const data = await response.json();
				errorMessage = data.error || 'Failed to send message. Please try again.';
				formState = 'error';
			}
		} catch (error) {
			errorMessage = 'Network error. Please check your connection and try again.';
			formState = 'error';
		}
	}
</script>

<div class="max-w-lg">
	<p class="text-sm text-vsc-green">// contact.tsx — Get in Touch</p>

	<div class="mt-2">
		<p class="text-sm">
			<span class="text-vsc-purple">import</span>
			<span class="text-vsc-text"> {'{'} </span>
			<span class="text-vsc-yellow">sendMessage</span>
			<span class="text-vsc-text"> {'}'} </span>
			<span class="text-vsc-purple">from</span>
			<span class="text-vsc-orange"> '@sushil/contact'</span>
			<span class="text-vsc-text">;</span>
		</p>
	</div>

	<form class="mt-6 space-y-4" onsubmit={handleSubmit}>
		<div>
			<label for="contact-name" class="block text-sm">
				<span class="text-vsc-purple">const</span>
				<span class="text-vsc-yellow"> name</span>
				<span class="text-vsc-text">: </span>
				<span class="text-vsc-blue">string</span>
				<span class="text-vsc-text"> = </span>
			</label>
			<input
				id="contact-name"
				name="name"
				type="text"
				placeholder="Your Name"
				required
				disabled={formState === 'submitting'}
				class="mt-1 w-full rounded border border-vsc-border bg-vsc-panel px-3 py-2 text-sm text-vsc-orange placeholder:text-vsc-text-muted/50 focus:border-vsc-blue focus:ring-1 focus:ring-vsc-blue/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			/>
		</div>

		<div>
			<label for="contact-email" class="block text-sm">
				<span class="text-vsc-purple">const</span>
				<span class="text-vsc-yellow"> email</span>
				<span class="text-vsc-text">: </span>
				<span class="text-vsc-blue">string</span>
				<span class="text-vsc-text"> = </span>
			</label>
			<input
				id="contact-email"
				name="email"
				type="email"
				placeholder="you@example.com"
				required
				disabled={formState === 'submitting'}
				class="mt-1 w-full rounded border border-vsc-border bg-vsc-panel px-3 py-2 text-sm text-vsc-orange placeholder:text-vsc-text-muted/50 focus:border-vsc-blue focus:ring-1 focus:ring-vsc-blue/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			/>
		</div>

		<div>
			<label for="contact-message" class="block text-sm">
				<span class="text-vsc-purple">const</span>
				<span class="text-vsc-yellow"> message</span>
				<span class="text-vsc-text">: </span>
				<span class="text-vsc-blue">string</span>
				<span class="text-vsc-text"> = </span>
			</label>
			<textarea
				id="contact-message"
				name="message"
				rows={5}
				placeholder="`Tell me about your project...`"
				required
				disabled={formState === 'submitting'}
				class="mt-1 w-full rounded border border-vsc-border bg-vsc-panel px-3 py-2 text-sm text-vsc-orange placeholder:text-vsc-text-muted/50 focus:border-vsc-blue focus:ring-1 focus:ring-vsc-blue/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			></textarea>
		</div>

		<!-- Success Message -->
		{#if formState === 'success'}
			<div
				class="flex items-start gap-2 rounded border border-vsc-green/30 bg-vsc-green/10 px-4 py-3 text-sm text-vsc-green"
			>
				<CheckCircle size={16} class="mt-0.5 shrink-0" />
				<div>
					<p class="font-medium">Message sent successfully!</p>
					<p class="mt-1 text-xs opacity-80">I'll get back to you soon.</p>
				</div>
			</div>
		{/if}

		<!-- Error Message -->
		{#if formState === 'error'}
			<div
				class="flex items-start gap-2 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
			>
				<AlertCircle size={16} class="mt-0.5 shrink-0" />
				<div>
					<p class="font-medium">Failed to send message</p>
					<p class="mt-1 text-xs opacity-80">{errorMessage}</p>
				</div>
			</div>
		{/if}

		<div class="pt-2">
			<p class="text-sm text-vsc-text-muted">
				<span class="text-vsc-yellow">sendMessage</span>({'{'}name, email, message{'}'});
			</p>
			<button
				type="submit"
				disabled={formState === 'submitting'}
				class="mt-3 flex items-center gap-2 rounded bg-vsc-blue px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-vsc-blue/80 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if formState === 'submitting'}
					<Loader2 size={14} class="animate-spin" />
					Sending...
				{:else}
					<Send size={14} />
					Execute
				{/if}
			</button>
		</div>
	</form>
</div>
