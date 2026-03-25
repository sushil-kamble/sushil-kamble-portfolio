<script lang="ts">
	import { ChevronLeft, ChevronRight, Expand, ImageIcon, Loader2, Upload, X } from 'lucide-svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import * as Dialog from '$lib/components/admin/ui/dialog/index.js';

	interface Props {
		images: string[];
		path?: string;
		labelledBy?: string;
		onchange: (images: string[]) => void;
	}

	let { images, path = 'uploads', labelledBy, onchange }: Props = $props();

	let uploading = $state(false);
	let dragover = $state(false);
	let activePreviewIndex = $state<number | null>(null);
	let previewOpen = $state(false);

	const hasMultipleImages = $derived(images.length > 1);
	const activePreviewUrl = $derived(
		activePreviewIndex === null ? '' : (images[activePreviewIndex] ?? '')
	);

	async function uploadFile(file: File) {
		uploading = true;
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('path', path);

			const response = await fetch('/api/upload', { method: 'POST', body: formData });
			if (!response.ok) throw new Error('Upload failed');

			const { url } = await response.json();
			onchange([...images, url]);
		} catch (error) {
			console.error('Upload error:', error);
		} finally {
			uploading = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragover = false;
		const file = event.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) uploadFile(file);
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadFile(file);
		input.value = '';
	}

	function removeImage(url: string) {
		onchange(images.filter((image) => image !== url));

		if (activePreviewIndex === null) return;
		if (images.length <= 1) {
			activePreviewIndex = null;
			return;
		}

		const nextImages = images.filter((image) => image !== url);
		if (nextImages.length === 0) {
			activePreviewIndex = null;
			return;
		}

		activePreviewIndex = Math.min(activePreviewIndex, nextImages.length - 1);
	}

	function openPreview(index: number) {
		activePreviewIndex = index;
		previewOpen = true;
	}

	function closePreview() {
		previewOpen = false;
		activePreviewIndex = null;
	}

	function showNextPreview() {
		if (activePreviewIndex === null || images.length < 2) return;
		activePreviewIndex = (activePreviewIndex + 1) % images.length;
	}

	function showPreviousPreview() {
		if (activePreviewIndex === null || images.length < 2) return;
		activePreviewIndex = (activePreviewIndex - 1 + images.length) % images.length;
	}

	function handlePreviewKeydown(event: KeyboardEvent) {
		if (!previewOpen || activePreviewIndex === null) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			closePreview();
			return;
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			showNextPreview();
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			showPreviousPreview();
		}
	}

	$effect(() => {
		if (previewOpen || activePreviewIndex === null) return;
		activePreviewIndex = null;
	});
</script>

<svelte:window onkeydown={handlePreviewKeydown} />

<div class="flex flex-col gap-4">
	{#if images.length > 0}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
			{#each images as url, index (url)}
				<div class="group border-border/70 bg-muted/30 relative overflow-hidden rounded-2xl border">
					<button
						type="button"
						class="block w-full text-left"
						aria-label={`Preview uploaded image ${index + 1}`}
						onclick={() => openPreview(index)}
					>
						<img src={url} alt={`Upload ${index + 1}`} class="aspect-square w-full object-cover" />
						<div
							class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
						></div>
						<div
							class="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100"
						>
							<span class="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
								Preview
							</span>
							<span
								class="inline-flex size-8 items-center justify-center rounded-full bg-black/55 text-white"
							>
								<Expand class="size-3.5" />
							</span>
						</div>
					</button>
					<Button
						type="button"
						variant="secondary"
						size="icon-sm"
						class="absolute top-2 right-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
						aria-label="Remove image"
						onclick={(event) => {
							event.stopPropagation();
							removeImage(url);
						}}
					>
						<X class="size-3.5" />
					</Button>
				</div>
			{/each}
		</div>
	{/if}

	<label
		class={`admin-surface flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-dashed p-6 text-center transition-colors ${dragover ? 'border-primary/60 bg-primary/5' : 'hover:bg-muted/30'}`}
		ondragover={(event) => {
			event.preventDefault();
			dragover = true;
		}}
		ondragleave={() => (dragover = false)}
		ondrop={handleDrop}
	>
		<input
			type="file"
			accept="image/*"
			onchange={handleFileSelect}
			aria-labelledby={labelledBy}
			hidden
		/>

		<div class="admin-icon-shell size-12 rounded-[1.25rem]">
			{#if uploading}
				<Loader2 class="size-5 animate-spin" />
			{:else}
				<Upload class="size-5" />
			{/if}
		</div>

		<div class="space-y-1">
			<p class="text-foreground text-sm font-medium">
				{uploading ? 'Uploading image...' : 'Drop an image here or click to browse'}
			</p>
			<p class="text-muted-foreground text-xs leading-5">
				PNG, JPG, WEBP and other image formats are accepted.
			</p>
		</div>

		<div class="text-muted-foreground inline-flex items-center gap-2 text-xs">
			<ImageIcon class="size-3.5" />
			<span>{images.length} image{images.length === 1 ? '' : 's'} selected</span>
		</div>
	</label>
</div>

<Dialog.Root bind:open={previewOpen}>
	{#if activePreviewIndex !== null}
		<Dialog.Content
			showCloseButton={false}
			aria-label="Uploaded image preview"
			class="max-w-none gap-0 border-white/10 bg-transparent p-0 shadow-none ring-0"
		>
			<div
				class="relative inline-flex max-h-[86vh] max-w-[min(92vw,1200px)] items-center justify-center"
			>
				<img
					src={activePreviewUrl}
					alt={`Preview image ${activePreviewIndex + 1}`}
					class="h-auto max-h-[86vh] w-auto max-w-full rounded-[1.5rem] border border-white/12 bg-black/40 object-contain shadow-2xl"
				/>

				<div
					class="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[1.5rem] bg-gradient-to-t from-black/72 via-black/28 to-transparent"
				></div>

				<div class="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
					<div>
						<p class="text-sm font-medium text-white">Screenshot preview</p>
						<p class="text-xs text-white/75">
							Image {activePreviewIndex + 1} of {images.length}
						</p>
					</div>

					<Button
						type="button"
						variant="secondary"
						size="icon-sm"
						class="border-white/15 bg-black/45 text-white hover:bg-black/70"
						aria-label="Close preview"
						onclick={closePreview}
					>
						<X class="size-4" />
					</Button>
				</div>

				{#if hasMultipleImages}
					<Button
						type="button"
						variant="secondary"
						size="icon-sm"
						class="absolute top-1/2 left-3 -translate-y-1/2 border-white/15 bg-black/45 text-white hover:bg-black/70"
						aria-label="Previous image"
						onclick={showPreviousPreview}
					>
						<ChevronLeft class="size-4" />
					</Button>

					<Button
						type="button"
						variant="secondary"
						size="icon-sm"
						class="absolute top-1/2 right-3 -translate-y-1/2 border-white/15 bg-black/45 text-white hover:bg-black/70"
						aria-label="Next image"
						onclick={showNextPreview}
					>
						<ChevronRight class="size-4" />
					</Button>
				{/if}
			</div>
		</Dialog.Content>
	{/if}
</Dialog.Root>
