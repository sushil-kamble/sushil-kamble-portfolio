export type FileType = 'readme' | 'package-json' | 'project' | 'post' | 'about' | 'contact';

export interface FileEntry {
	id: string;
	name: string;
	type: FileType;
	icon: string;
	language: string;
	folder?: string;
	dataId?: string;
}

export type TreeNode = TreeFolder | TreeFile;

export interface TreeFolder {
	kind: 'folder';
	name: string;
	path: string;
	children: TreeNode[];
}

export interface TreeFile {
	kind: 'file';
	entry: FileEntry;
}
