/** Types for the 5 fixed tabs */
export type FixedTabType = 'readme' | 'career' | 'projects' | 'posts' | 'contact';

/** Types for individual sidebar file entries */
export type SidebarFileType = 'project' | 'post';

/** Union of all file types */
export type FileType = FixedTabType | SidebarFileType;

/** ── Theme & Font ── */

export type ThemeId =
	| 'dark-default'
	| 'light'
	| 'monokai'
	| 'dracula'
	| 'github-dark'
	| 'palenight'
	| 'catppuccin'
	| 'synthwave'
	| 'one-dark-pro'
	| 'tokyo-night'
	| 'nord';

export type FontId =
	| 'jetbrains-mono'
	| 'fira-code'
	| 'cascadia-code'
	| 'source-code-pro'
	| 'ibm-plex-mono';

export interface ThemeDefinition {
	id: ThemeId;
	label: string;
	description: string;
}

export interface FontDefinition {
	id: FontId;
	label: string;
	fontFamily: string;
}

/** Command palette modes */
export type PaletteMode = 'files' | 'commands' | 'themes' | 'fonts';

export interface PaletteCommand {
	id: string;
	label: string;
	description?: string;
	action: () => void;
}

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
