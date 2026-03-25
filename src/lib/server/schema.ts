import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const settings = sqliteTable('settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const careers = sqliteTable('careers', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	company: text('company').notNull(),
	designation: text('designation').notNull().default(''),
	details: text('details').notNull().default(''),
	detailsList: text('details_list', { mode: 'json' }).notNull().$type<string[]>().default([]),
	logo: text('logo').notNull().default(''),
	link: text('link').notNull().default(''),
	location: text('location').notNull().default(''),
	start: text('start').notNull().default(''),
	end: text('end').notNull().default(''),
	skills: text('skills', { mode: 'json' }).notNull().$type<string[]>().default([]),
	ordering: integer('ordering').notNull().default(0)
});

export const skillCategories = sqliteTable('skill_categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	skills: text('skills', { mode: 'json' }).notNull().$type<string[]>().default([]),
	ordering: integer('ordering').notNull().default(0)
});

export const projects = sqliteTable('projects', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	description: text('description').notNull().default(''),
	stack: text('stack', { mode: 'json' }).notNull().$type<string[]>().default([]),
	features: text('features', { mode: 'json' }).notNull().$type<string[]>().default([]),
	screenshots: text('screenshots', { mode: 'json' }).notNull().$type<string[]>().default([]),
	github: text('github').notNull().default(''),
	direct: text('direct').notNull().default(''),
	ordering: integer('ordering').notNull().default(0)
});

export const blogs = sqliteTable('blogs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	description: text('description').notNull().default(''),
	tags: text('tags', { mode: 'json' }).notNull().$type<string[]>().default([]),
	content: text('content').notNull().default(''),
	blogUrl: text('blog_url').notNull().default(''),
	githubUrl: text('github_url').notNull().default(''),
	liveUrl: text('live_url').notNull().default(''),
	ordering: integer('ordering').notNull().default(0),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});
