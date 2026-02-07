import type { FileEntry, TreeNode, TreeFolder, TreeFile } from '$lib/types';

export function buildSidebarTree(files: FileEntry[]): TreeNode[] {
	const folders = new Map<string, FileEntry[]>();
	const rootFiles: FileEntry[] = [];

	for (const file of files) {
		if (file.folder) {
			if (!folders.has(file.folder)) {
				folders.set(file.folder, []);
			}
			folders.get(file.folder)!.push(file);
		} else {
			rootFiles.push(file);
		}
	}

	const tree: TreeNode[] = [];

	// Root files first
	for (const entry of rootFiles) {
		tree.push({ kind: 'file', entry } satisfies TreeFile);
	}

	// Then folders
	const folderOrder = ['portfolio', 'projects', 'posts'];
	for (const name of folderOrder) {
		const children = folders.get(name);
		if (children && children.length > 0) {
			tree.push({
				kind: 'folder',
				name,
				path: name,
				children: children.map((entry) => ({ kind: 'file', entry }) satisfies TreeFile)
			} satisfies TreeFolder);
		}
	}

	return tree;
}
