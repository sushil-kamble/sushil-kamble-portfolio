import type { FileEntry, TreeNode, TreeFolder, TreeFile } from '$lib/types';

/**
 * Build a nested sidebar tree from flat file entries.
 * Supports slash-separated folder paths (e.g. "sushilkamble-com/projects").
 *
 * Folders first (alphabetical), then files in their original order (Notion API ordering).
 */
export function buildSidebarTree(files: FileEntry[]): TreeNode[] {
	const root: TreeNode[] = [];
	const folderMap = new Map<string, TreeFolder>();

	/** Get or create a folder node at the given path, creating parents as needed. */
	function ensureFolder(path: string): TreeFolder {
		const existing = folderMap.get(path);
		if (existing) return existing;

		const parts = path.split('/');
		const name = parts[parts.length - 1];
		const folder: TreeFolder = { kind: 'folder', name, path, children: [] };
		folderMap.set(path, folder);

		if (parts.length === 1) {
			// Top-level folder — attach to root
			root.push(folder);
		} else {
			// Nested folder — attach to parent
			const parentPath = parts.slice(0, -1).join('/');
			const parent = ensureFolder(parentPath);
			parent.children.push(folder);
		}

		return folder;
	}

	for (const entry of files) {
		const fileNode: TreeFile = { kind: 'file', entry };

		if (entry.folder) {
			const folder = ensureFolder(entry.folder);
			folder.children.push(fileNode);
		} else {
			root.push(fileNode);
		}
	}

	// Sort every level: folders first, then files, each alphabetically
	sortChildren(root);
	for (const folder of folderMap.values()) {
		sortChildren(folder.children);
	}

	return root;
}

function sortChildren(nodes: TreeNode[]) {
	nodes.sort((a, b) => {
		// Folders before files
		if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1;
		// Folders: alphabetical
		if (a.kind === 'folder' && b.kind === 'folder') {
			return a.name.localeCompare(b.name);
		}
		// Files: preserve insertion order (Notion API ordering)
		return 0;
	});
}
