export const CONTEXT_KEYS = {
	EDITOR_STATE: 'editor-state',
	PORTFOLIO_DATA: 'portfolio-data',
	FILE_REGISTRY: 'file-registry'
} as const;

export const FILE_ICON_MAP: Record<string, string> = {
	'file-text': '📄',
	braces: '{}',
	user: '👤',
	mail: '✉️',
	'folder-code': '📦',
	folder: '📁'
} as const;
