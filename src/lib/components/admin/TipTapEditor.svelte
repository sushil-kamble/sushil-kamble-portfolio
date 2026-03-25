<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
	import {
		Bold,
		Italic,
		Strikethrough,
		Code,
		List,
		ListOrdered,
		Heading1,
		Heading2,
		Heading3,
		Quote,
		Minus,
		ImagePlus,
		Undo,
		Redo
	} from 'lucide-svelte';

	interface Props {
		content: string;
		onchange: (markdown: string) => void;
		uploadPath?: string;
		labelledBy?: string;
	}

	const { content, onchange, uploadPath = 'Blog', labelledBy }: Props = $props();

	let element: HTMLDivElement;
	let editor: Editor;
	let ready = $state(false);
	let toolbarVersion = $state(0);

	function getMarkdown(editorInstance: Editor): string {
		return (editorInstance.storage as { markdown?: MarkdownStorage }).markdown?.getMarkdown() ?? '';
	}

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [StarterKit, Markdown],
			content,
			editorProps: {
				attributes: {
					class: 'tiptap-content',
					role: 'textbox',
					'aria-multiline': 'true',
					...(labelledBy ? { 'aria-labelledby': labelledBy } : {})
				}
			},
			onUpdate: ({ editor: e }) => {
				onchange(getMarkdown(e));
			}
		});

		const rerenderToolbar = () => {
			toolbarVersion += 1;
		};

		editor.on('selectionUpdate', rerenderToolbar);
		editor.on('transaction', rerenderToolbar);
		ready = true;

		return () => {
			editor.off('selectionUpdate', rerenderToolbar);
			editor.off('transaction', rerenderToolbar);
			editor.destroy();
		};
	});
	function btn(command: string, attrs?: Record<string, unknown>) {
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

	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}

	async function insertImage() {
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
				const res = await fetch('/api/upload', { method: 'POST', body: formData });
				if (!res.ok) return;
				const { url } = await res.json();
				editor
					.chain()
					.focus()
					.insertContentAt(
						{ from: editor.state.selection.from, to: editor.state.selection.to },
						`![${file.name}](${url})`
					)
					.run();
			} catch {
				/* ignore */
			}
		};
		input.click();
	}
</script>

<div class="tiptap-wrapper">
	{#if ready}
		<div class="tiptap-toolbar" data-toolbar-version={toolbarVersion}>
			<div class="toolbar-group">
				<button
					type="button"
					class="tb"
					class:active={isActive('bold')}
					onclick={btn('toggleBold')}
					title="Bold"
				>
					<Bold size={16} />
				</button>
				<button
					type="button"
					class="tb"
					class:active={isActive('italic')}
					onclick={btn('toggleItalic')}
					title="Italic"
				>
					<Italic size={16} />
				</button>
				<button
					type="button"
					class="tb"
					class:active={isActive('strike')}
					onclick={btn('toggleStrike')}
					title="Strikethrough"
				>
					<Strikethrough size={16} />
				</button>
				<button
					type="button"
					class="tb"
					class:active={isActive('code')}
					onclick={btn('toggleCode')}
					title="Code"
				>
					<Code size={16} />
				</button>
			</div>

			<div class="toolbar-sep"></div>

			<div class="toolbar-group">
				<button
					type="button"
					class="tb"
					class:active={isActive('heading', { level: 1 })}
					onclick={btn('toggleHeading', { level: 1 })}
					title="Heading 1"
				>
					<Heading1 size={16} />
				</button>
				<button
					type="button"
					class="tb"
					class:active={isActive('heading', { level: 2 })}
					onclick={btn('toggleHeading', { level: 2 })}
					title="Heading 2"
				>
					<Heading2 size={16} />
				</button>
				<button
					type="button"
					class="tb"
					class:active={isActive('heading', { level: 3 })}
					onclick={btn('toggleHeading', { level: 3 })}
					title="Heading 3"
				>
					<Heading3 size={16} />
				</button>
			</div>

			<div class="toolbar-sep"></div>

			<div class="toolbar-group">
				<button
					type="button"
					class="tb"
					class:active={isActive('bulletList')}
					onclick={btn('toggleBulletList')}
					title="Bullet List"
				>
					<List size={16} />
				</button>
				<button
					type="button"
					class="tb"
					class:active={isActive('orderedList')}
					onclick={btn('toggleOrderedList')}
					title="Numbered List"
				>
					<ListOrdered size={16} />
				</button>
				<button
					type="button"
					class="tb"
					class:active={isActive('blockquote')}
					onclick={btn('toggleBlockquote')}
					title="Quote"
				>
					<Quote size={16} />
				</button>
				<button type="button" class="tb" onclick={btn('setHorizontalRule')} title="Divider">
					<Minus size={16} />
				</button>
			</div>

			<div class="toolbar-sep"></div>

			<div class="toolbar-group">
				<button type="button" class="tb" onclick={insertImage} title="Insert Image">
					<ImagePlus size={16} />
				</button>
			</div>

			<div class="toolbar-spacer"></div>

			<div class="toolbar-group">
				<button type="button" class="tb" onclick={btn('undo')} title="Undo">
					<Undo size={16} />
				</button>
				<button type="button" class="tb" onclick={btn('redo')} title="Redo">
					<Redo size={16} />
				</button>
			</div>
		</div>
	{/if}

	<div bind:this={element} class="tiptap-editor"></div>
</div>

<style>
	.tiptap-wrapper {
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		overflow: hidden;
		background: white;
	}

	.tiptap-toolbar {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 6px 8px;
		background: #fafaf9;
		border-bottom: 1px solid #e0ddd8;
		flex-wrap: wrap;
	}

	.toolbar-group {
		display: flex;
		gap: 2px;
	}

	.toolbar-sep {
		width: 1px;
		height: 20px;
		background: #e0ddd8;
		margin: 0 4px;
	}

	.toolbar-spacer {
		flex: 1;
	}

	.tb {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: none;
		border-radius: 6px;
		cursor: pointer;
		color: #666;
		transition: all 0.15s;
		padding: 0;
	}

	.tb:hover {
		background: #f0ede8;
		color: #1a1a1a;
	}

	.tb.active {
		background: #1a1a1a;
		color: white;
	}

	.tiptap-editor {
		min-height: 300px;
		padding: 16px;
	}

	:global(.tiptap-content) {
		outline: none;
		font-size: 15px;
		line-height: 1.7;
		color: #1a1a1a;
	}

	:global(.tiptap-content > * + *) {
		margin-top: 0.75em;
	}

	:global(.tiptap-content h1) {
		font-size: 1.8em;
		font-weight: 700;
		margin-top: 1.2em;
	}

	:global(.tiptap-content h2) {
		font-size: 1.4em;
		font-weight: 600;
		margin-top: 1em;
	}

	:global(.tiptap-content h3) {
		font-size: 1.15em;
		font-weight: 600;
		margin-top: 0.8em;
	}

	:global(.tiptap-content ul),
	:global(.tiptap-content ol) {
		padding-left: 1.5em;
	}

	:global(.tiptap-content blockquote) {
		border-left: 3px solid #e0ddd8;
		padding-left: 1em;
		color: #666;
		font-style: italic;
	}

	:global(.tiptap-content code) {
		background: #f0ede8;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
		font-family: 'JetBrains Mono', monospace;
	}

	:global(.tiptap-content pre) {
		background: #1a1a1a;
		color: #e5e5e5;
		padding: 16px;
		border-radius: 8px;
		overflow-x: auto;
	}

	:global(.tiptap-content pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}

	:global(.tiptap-content img) {
		max-width: 100%;
		border-radius: 8px;
	}

	:global(.tiptap-content hr) {
		border: none;
		border-top: 1px solid #e0ddd8;
		margin: 1.5em 0;
	}

	:global(.tiptap-content p.is-editor-empty:first-child::before) {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
