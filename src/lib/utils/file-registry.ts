import type { FileEntry, PageData } from '$lib/types';
import { FIXED_TABS } from '$lib/state/editor.svelte';

/**
 * Build the complete file registry.
 * Includes the 5 fixed tabs (for command palette search) plus
 * individual project/post entries (for sidebar tree display).
 */
export function buildFileRegistry(data: PageData): FileEntry[] {
	const files: FileEntry[] = [
		// Fixed tabs first (for command palette)
		...FIXED_TABS,
		// Individual sidebar entries
		{
			id: 'about-sidebar',
			name: 'about_me.ts',
			type: 'about',
			icon: 'user',
			language: 'TypeScript',
			folder: 'portfolio'
		},
		{
			id: 'contact-sidebar',
			name: 'contact.tsx',
			type: 'contact',
			icon: 'mail',
			language: 'TSX',
			folder: 'portfolio'
		}
	];

	for (const project of data.projects) {
		files.push({
			id: `project-${project.id}`,
			name: `${slugify(project.title)}.ts`,
			type: 'project',
			icon: 'folder-code',
			language: 'TypeScript',
			folder: 'projects',
			dataId: project.id
		});
	}

	for (const blog of data.blogs) {
		files.push({
			id: `post-${blog.id}`,
			name: `${slugify(blog.title)}.md`,
			type: 'post',
			icon: 'file-text',
			language: 'Markdown',
			folder: 'posts',
			dataId: blog.id
		});
	}

	return files;
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}
