/** Types for the 5 fixed tabs */
export type FixedTabType = 'readme' | 'about' | 'projects' | 'posts' | 'contact';

/** Types for individual sidebar file entries */
export type SidebarFileType = 'project' | 'post';

/** Union of all file types */
export type FileType = FixedTabType | SidebarFileType;

export interface FileEntry {
	id: string;
	name: string;
	type: FileType;
	icon: string;
	language: string;
	folder?: string;
	dataId?: string;
	href?: string;
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
