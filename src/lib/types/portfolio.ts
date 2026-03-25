export interface Career {
	id: string;
	company: string;
	start: string;
	end: string;
	location: string;
	designation: string;
	link: string;
	logo: string;
	details: string;
	skills: string[];
	detailsList: string[];
}

export interface Project {
	id: string;
	slug: string;
	title: string;
	stack: string[];
	features: string[];
	screenshots: string[];
	direct: string;
	github: string;
	description: string;
}

export interface Skill {
	id: string;
	title: string;
	skills: string[];
}

export interface Blog {
	id: string;
	slug: string;
	title: string;
	description: string;
	tags: string[];
	blog: string;
	github: string;
	live: string;
	content?: string;
	createdAt: string;
}

export interface PageData {
	about_me: string;
	careers: Career[];
	projects: Project[];
	skills: Skill[];
	blogs: Blog[];
}
