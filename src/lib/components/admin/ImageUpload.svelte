<script lang="ts">
	import { Upload, X, Loader2 } from 'lucide-svelte';

	interface Props {
		images: string[];
		path?: string;
		labelledBy?: string;
		onchange: (images: string[]) => void;
	}

	const { images, path = 'uploads', labelledBy, onchange }: Props = $props();

	let uploading = $state(false);
	let dragover = $state(false);

	async function uploadFile(file: File) {
		uploading = true;
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('path', path);

			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			if (!res.ok) throw new Error('Upload failed');

			const { url } = await res.json();
			onchange([...images, url]);
		} catch (err) {
			console.error('Upload error:', err);
		} finally {
			uploading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragover = false;
		const file = e.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) uploadFile(file);
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadFile(file);
		input.value = '';
	}

	function removeImage(url: string) {
		onchange(images.filter((i) => i !== url));
	}
</script>

<div class="upload-area">
	{#if images.length > 0}
		<div class="image-grid">
			{#each images as url, i (url)}
				<div class="image-thumb">
					<img src={url} alt="Upload {i + 1}" />
					<button
						type="button"
						class="remove-img"
						onclick={() => removeImage(url)}
						aria-label="Remove image"
					>
						<X size={14} />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<label
		class="dropzone"
		class:dragover
		ondragover={(e) => {
			e.preventDefault();
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
		{#if uploading}
			<Loader2 size={20} class="spin" />
			<span>Uploading...</span>
		{:else}
			<Upload size={20} />
			<span>Drop image or click to upload</span>
		{/if}
	</label>
</div>

<style>
	.upload-area {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: 8px;
	}

	.image-thumb {
		position: relative;
		aspect-ratio: 1;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #e0ddd8;
	}

	.image-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.remove-img {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		cursor: pointer;
		color: white;
		opacity: 0;
		transition: opacity 0.15s;
		padding: 0;
	}

	.image-thumb:hover .remove-img {
		opacity: 1;
	}

	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 24px;
		border: 2px dashed #d0cdc6;
		border-radius: 10px;
		background: #fafaf9;
		cursor: pointer;
		transition: all 0.2s;
		color: #888;
		font-size: 13px;
	}

	.dropzone:hover,
	.dropzone.dragover {
		border-color: #1a1a1a;
		background: #f5f3f0;
		color: #555;
	}
</style>
