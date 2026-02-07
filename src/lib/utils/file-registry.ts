import type { FileEntry, PageData } from '$lib/types';
import { FIXED_TABS } from '$lib/state/editor.svelte';
import { fileEntryHref } from '$lib/utils/navigation';

/**
 * Build the complete file registry.
 * Includes the 5 fixed tabs (for command palette search) plus
 * individual project/post entries (for sidebar tree display).
 */
export function buildFileRegistry(data: PageData): FileEntry[] {
	const files: FileEntry[] = [
		// Fixed tabs first (for command palette)
		...FIXED_TABS.map((tab) => ({ ...tab, href: fileEntryHref(tab) })),
		// Individual sidebar entries
		{
			id: 'about-sidebar',
			name: 'about_me.ts',
			type: 'about' as const,
			icon: 'user',
			language: 'TypeScript',
			folder: 'portfolio',
			href: '/about'
		},
		{
			id: 'contact-sidebar',
			name: 'contact.tsx',
			type: 'contact' as const,
			icon: 'mail',
			language: 'TSX',
			folder: 'portfolio',
			href: '/contact'
		}
	];

	// Index files for folder views
	files.push({
		id: 'projects-index',
		name: 'projects.md',
		type: 'projects' as const,
		icon: 'folder-code',
		language: 'Markdown',
		folder: 'projects',
		href: '/projects'
	});
	files.push({
		id: 'posts-index',
		name: 'posts.md',
		type: 'posts' as const,
		icon: 'file-text',
		language: 'Markdown',
		folder: 'posts',
		href: '/posts'
	});

	for (const project of data.projects) {
		const entry: FileEntry = {
			id: `project-${project.id}`,
			name: `${slugify(project.title)}.ts`,
			type: 'project',
			icon: 'folder-code',
			language: 'TypeScript',
			folder: 'projects',
			dataId: project.id
		};
		entry.href = fileEntryHref(entry);
		files.push(entry);
	}

	for (const blog of data.blogs) {
		const entry: FileEntry = {
			id: `post-${blog.id}`,
			name: `${slugify(blog.title)}.md`,
			type: 'post',
			icon: 'file-text',
			language: 'Markdown',
			folder: 'posts',
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
