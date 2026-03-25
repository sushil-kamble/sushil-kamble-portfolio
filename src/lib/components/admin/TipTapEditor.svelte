<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
	import MarkdownImage from '$lib/components/admin/tiptap/MarkdownImage.js';
	import {
		Bold,
		Code,
		Heading1,
		Heading2,
		Heading3,
		ImagePlus,
		Italic,
		Link2,
		List,
		ListOrdered,
		Minus,
		Quote,
		Redo,
		Strikethrough,
		UnderlineIcon,
		Undo
	} from 'lucide-svelte';
	import { Button } from '$lib/components/admin/ui/button/index.js';
	import { cn } from '$lib/utils/admin.js';

	interface Props {
		content: string;
		onchange: (markdown: string) => void;
		uploadPath?: string;
		labelledBy?: string;
	}

	let { content, onchange, uploadPath = 'Blog', labelledBy }: Props = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor | null>(null);
	let ready = $state(false);
	let toolbarVersion = $state(0);
	let syncingFromProp = false;
	let uploadError = $state('');

	const toolbarButtonClass =
		'rounded-md border border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground';

	function getMarkdown(editorInstance: Editor): string {
		return (editorInstance.storage as { markdown?: MarkdownStorage }).markdown?.getMarkdown() ?? '';
	}

	function normalizeMarkdown(value: string): string {
		return value.replace(/\r\n/g, '\n').trimEnd();
	}

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				MarkdownImage,
				Markdown,
				Underline,
				Link.configure({ openOnClick: false, autolink: true })
			],
			content,
			editorProps: {
				attributes: {
					class: 'tiptap-content',
					role: 'textbox',
					'aria-multiline': 'true',
					...(labelledBy ? { 'aria-labelledby': labelledBy } : {})
				}
			},
			onUpdate: ({ editor: editorInstance }) => {
				if (syncingFromProp) return;
				onchange(getMarkdown(editorInstance));
			}
		});

		const rerenderToolbar = () => {
			toolbarVersion += 1;
		};

		editor.on('selectionUpdate', rerenderToolbar);
		editor.on('transaction', rerenderToolbar);
		ready = true;

		return () => {
			if (!editor) return;
			editor.off('selectionUpdate', rerenderToolbar);
			editor.off('transaction', rerenderToolbar);
			editor.destroy();
			editor = null;
		};
	});

	$effect(() => {
		if (!editor) return;

		const incoming = normalizeMarkdown(content ?? '');
		const current = normalizeMarkdown(getMarkdown(editor));
		if (incoming === current) return;

		syncingFromProp = true;
		editor.commands.setContent(content ?? '');
		syncingFromProp = false;
		toolbarVersion += 1;
	});

	function runCommand(command: string, attrs?: Record<string, unknown>) {
		return () => {
			if (!editor) return;
			const chain = editor.chain().focus();
			switch (command) {
				case 'toggleBold':
					chain.toggleBold().run();
					break;
				case 'toggleItalic':
					chain.toggleItalic().run();
					break;
				case 'toggleStrike':
					chain.toggleStrike().run();
					break;
				case 'toggleCode':
					chain.toggleCode().run();
					break;
				case 'toggleUnderline':
					chain.toggleUnderline().run();
					break;
				case 'toggleBulletList':
					chain.toggleBulletList().run();
					break;
				case 'toggleOrderedList':
					chain.toggleOrderedList().run();
					break;
				case 'toggleHeading':
					chain.toggleHeading(attrs as { level: 1 | 2 | 3 }).run();
					break;
				case 'toggleBlockquote':
					chain.toggleBlockquote().run();
					break;
				case 'setHorizontalRule':
					chain.setHorizontalRule().run();
					break;
				case 'undo':
					chain.undo().run();
					break;
				case 'redo':
					chain.redo().run();
					break;
			}
		};
	}

	function toggleLink() {
		if (!editor) return;
		if (editor.isActive('link')) {
			editor.chain().focus().unsetLink().run();
			return;
		}
		const url = window.prompt('Enter URL');
		if (!url) return;
		editor.chain().focus().setLink({ href: url }).run();
	}

	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}

	async function insertImage() {
		uploadError = '';
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;

			const formData = new FormData();
			formData.append('file', file);
			formData.append('path', uploadPath);

			try {
				const response = await fetch('/admin/api/upload', { method: 'POST', body: formData });
				if (!response.ok) {
					uploadError = 'Image upload failed. Please try again.';
					return;
				}
				if (!editor) return;

				const { url } = await response.json();
				uploadError = '';
				editor
					.chain()
					.focus()
					.insertContent([
						{
							type: 'image',
							attrs: {
								src: url,
								alt: file.name,
								title: file.name
							}
						},
						{
							type: 'paragraph'
						}
					])
					.run();
			} catch {
				uploadError = 'Image upload failed. Please try again.';
			}
		};
		input.click();
	}
</script>

<div class="admin-surface overflow-hidden rounded-2xl">
	{#if ready}
		<div class="border-border/70 bg-muted/35 flex flex-wrap items-center gap-2 border-b p-3">
			<div class="flex flex-wrap gap-1" data-toolbar-version={toolbarVersion}>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('bold') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleBold')}
					title="Bold"
				>
					<Bold class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('italic') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleItalic')}
					title="Italic"
				>
					<Italic class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('strike') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleStrike')}
					title="Strikethrough"
				>
					<Strikethrough class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('code') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleCode')}
					title="Code"
				>
					<Code class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('underline') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleUnderline')}
					title="Underline"
				>
					<UnderlineIcon class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('link') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={toggleLink}
					title="Link"
				>
					<Link2 class="size-4" />
				</Button>
			</div>

			<div class="bg-border/70 h-6 w-px"></div>

			<div class="flex flex-wrap gap-1">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('heading', { level: 1 }) &&
							'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleHeading', { level: 1 })}
					title="Heading 1"
				>
					<Heading1 class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('heading', { level: 2 }) &&
							'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleHeading', { level: 2 })}
					title="Heading 2"
				>
					<Heading2 class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('heading', { level: 3 }) &&
							'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleHeading', { level: 3 })}
					title="Heading 3"
				>
					<Heading3 class="size-4" />
				</Button>
			</div>

			<div class="bg-border/70 h-6 w-px"></div>

			<div class="flex flex-wrap gap-1">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('bulletList') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleBulletList')}
					title="Bullet list"
				>
					<List class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('orderedList') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleOrderedList')}
					title="Ordered list"
				>
					<ListOrdered class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={cn(
						toolbarButtonClass,
						isActive('blockquote') && 'border-border bg-background text-foreground shadow-sm'
					)}
					onclick={runCommand('toggleBlockquote')}
					title="Quote"
				>
					<Quote class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={toolbarButtonClass}
					onclick={runCommand('setHorizontalRule')}
					title="Divider"
				>
					<Minus class="size-4" />
				</Button>
			</div>

			<div class="ml-auto flex flex-wrap gap-1">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={toolbarButtonClass}
					onclick={insertImage}
					title="Insert image"
				>
					<ImagePlus class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={toolbarButtonClass}
					onclick={runCommand('undo')}
					title="Undo"
				>
					<Undo class="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					class={toolbarButtonClass}
					onclick={runCommand('redo')}
					title="Redo"
				>
					<Redo class="size-4" />
				</Button>
			</div>
		</div>
	{/if}

	<div bind:this={element} class="min-h-[320px] px-4 py-5 sm:px-5"></div>

	{#if uploadError}
		<div
			class="border-border/70 bg-destructive/5 text-destructive border-t px-4 py-3 text-sm sm:px-5"
		>
			{uploadError}
		</div>
	{/if}
</div>

<style>
	:global(.tiptap-content) {
		outline: none;
		font-size: 0.95rem;
		line-height: 1.8;
		color: var(--foreground);
	}

	:global(.tiptap-content > * + *) {
		margin-top: 0.85em;
	}

	:global(.tiptap-content h1) {
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	:global(.tiptap-content h2) {
		font-size: 1.35rem;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	:global(.tiptap-content h3) {
		font-size: 1.05rem;
		font-weight: 650;
	}

	:global(.tiptap-content ul),
	:global(.tiptap-content ol) {
		padding-left: 1.35rem;
	}

	:global(.tiptap-content blockquote) {
		border-left: 3px solid var(--border);
		padding-left: 1rem;
		color: var(--muted-foreground);
		font-style: italic;
	}

	:global(.tiptap-content code) {
		background: color-mix(in oklab, var(--muted) 85%, white 15%);
		padding: 0.15rem 0.45rem;
		border-radius: 0.4rem;
		font-size: 0.9em;
	}

	:global(.tiptap-content pre) {
		overflow-x: auto;
		border-radius: 1rem;
		background: color-mix(in oklab, var(--foreground) 92%, black 8%);
		padding: 1rem;
		color: white;
	}

	:global(.tiptap-content pre code) {
		background: transparent;
		padding: 0;
		color: inherit;
	}

	:global(.tiptap-content img) {
		display: block;
		width: min(100%, 42rem);
		height: auto;
		margin: 1.25rem auto;
		border-radius: 1rem;
		border: 1px solid color-mix(in oklab, var(--border) 82%, white 18%);
		background: color-mix(in oklab, var(--background) 88%, white 12%);
	}

	:global(.tiptap-content hr) {
		margin: 1.5rem 0;
		border: 0;
		border-top: 1px solid var(--border);
	}

	:global(.tiptap-content u) {
		text-decoration: underline;
	}

	:global(.tiptap-content a) {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
