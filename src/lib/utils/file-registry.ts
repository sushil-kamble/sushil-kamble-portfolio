import type { FileEntry, PageData } from '$lib/types';
import { FIXED_TABS } from '$lib/state/editor.svelte';
import { fileEntryHref } from '$lib/utils/navigation';

/**
 * Build the complete file registry.
 * Includes the 5 fixed tabs (for command palette / tab bar) plus
 * individual sidebar entries arranged in a VS Code-style project tree.
 *
 * Tree structure:
 *   sushilkamble-com/
 *     README.md
 *     career.ts
 *     contact.tsx
 *     projects/
 *       index.ts
 *       <each-project>.ts
 *     posts/
 *       index.md
 *       <each-post>.md
 */
export function buildFileRegistry(data: PageData): FileEntry[] {
	const files: FileEntry[] = [
		// Fixed tabs (for command palette search + tab bar — no folder)
		...FIXED_TABS.map((tab) => ({ ...tab, href: fileEntryHref(tab) })),

		// ── Sidebar entries: root files inside sushilkamble-com/ ──
		{
			id: 'readme-sidebar',
			name: 'README.md',
			type: 'readme' as const,
			icon: 'file-text',
			language: 'Markdown',
			folder: 'sushilkamble-com',
			href: '/'
		},
		{
			id: 'about-sidebar',
			name: 'career.ts',
			type: 'about' as const,
			icon: 'user',
			language: 'TypeScript',
			folder: 'sushilkamble-com',
			href: '/about'
		},
		{
			id: 'contact-sidebar',
			name: 'contact.tsx',
			type: 'contact' as const,
			icon: 'mail',
			language: 'TSX',
			folder: 'sushilkamble-com',
			href: '/contact'
		},

		// ── Subfolder index files ──
		{
			id: 'projects-index',
			name: 'index.ts',
			type: 'projects' as const,
			icon: 'folder-code',
			language: 'TypeScript',
			folder: 'sushilkamble-com/projects',
			href: '/projects'
		},
		{
			id: 'posts-index',
			name: 'index.md',
			type: 'posts' as const,
			icon: 'file-text',
			language: 'Markdown',
			folder: 'sushilkamble-com/posts',
			href: '/posts'
		}
	];

	// ── Individual project files ──
	for (const project of data.projects) {
		const entry: FileEntry = {
			id: `project-${project.id}`,
			name: `${slugify(project.title)}.ts`,
			type: 'project',
			icon: 'folder-code',
			language: 'TypeScript',
			folder: 'sushilkamble-com/projects',
			dataId: project.id
		};
		entry.href = fileEntryHref(entry);
		files.push(entry);
	}

	// ── Individual post files ──
	for (const blog of data.blogs) {
		const entry: FileEntry = {
			id: `post-${blog.id}`,
			name: `${slugify(blog.title)}.md`,
			type: 'post',
			icon: 'file-text',
			language: 'Markdown',
			folder: 'sushilkamble-com/posts',
			dataId: blog.id
		};
		entry.href = fileEntryHref(entry);
		files.push(entry);
	}

	return files;
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}
