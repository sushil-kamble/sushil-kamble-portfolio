import { mergeAttributes, Node } from '@tiptap/core';

function escapeTitle(value: string): string {
	return value.replace(/"/g, '\\"');
}

export default Node.create({
	name: 'image',
	group: 'block',
	draggable: true,
	selectable: true,
	atom: true,

	addAttributes() {
		return {
			src: {
				default: null
			},
			alt: {
				default: null
			},
			title: {
				default: null
			}
		};
	},

	parseHTML() {
		return [{ tag: 'img[src]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['img', mergeAttributes(HTMLAttributes)];
	},

	addStorage() {
		return {
			markdown: {
				serialize(state: {
					write: (value: string) => void;
					esc: (value: string) => string;
				}, node: { attrs: { alt?: string | null; src: string; title?: string | null } }) {
					const alt = state.esc(node.attrs.alt ?? '');
					const src = node.attrs.src.replace(/[\(\)]/g, '\\$&');
					const title = node.attrs.title ? ` "${escapeTitle(node.attrs.title)}"` : '';

					state.write(`![${alt}](${src}${title})`);
				},
				parse: {
					// Markdown parsing is handled by markdown-it.
				}
			}
		};
	}
});
