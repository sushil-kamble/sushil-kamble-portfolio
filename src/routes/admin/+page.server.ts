import { db } from '$lib/server/db';
import { blogs, careers, projects, settings, skillCategories } from '$lib/server/schema';
import { asc, eq } from 'drizzle-orm';

export async function load() {
	const [aboutRows, allCareers, allSkillCategories, allProjects, allBlogs] = await Promise.all([
		db.select().from(settings).where(eq(settings.key, 'about')).limit(1),
		db.select().from(careers).orderBy(asc(careers.ordering)),
		db.select().from(skillCategories).orderBy(asc(skillCategories.ordering)),
		db.select().from(projects).orderBy(asc(projects.ordering)),
		db.select().from(blogs).orderBy(asc(blogs.ordering))
	]);

	const aboutCopy = aboutRows[0]?.value?.trim() ?? '';
	const aboutWords = aboutCopy ? aboutCopy.split(/\s+/).filter(Boolean).length : 0;

	const totalSkills = allSkillCategories.reduce((sum, category) => sum + category.skills.length, 0);
	const totalCareerHighlights = allCareers.reduce(
		(sum, career) => sum + career.detailsList.length,
		0
	);
	const totalProjectScreenshots = allProjects.reduce(
		(sum, project) => sum + project.screenshots.length,
		0
	);
	const totalProjectLinks = allProjects.reduce(
		(sum, project) => sum + Number(Boolean(project.github || project.direct)),
		0
	);
	const totalBlogTags = allBlogs.reduce((sum, blog) => sum + blog.tags.length, 0);

	const recentBlogs = [...allBlogs]
		.sort((left, right) => {
			const leftTime = Date.parse(left.createdAt);
			const rightTime = Date.parse(right.createdAt);
			return rightTime - leftTime;
		})
		.slice(0, 3);

	return {
		about: {
			present: Boolean(aboutCopy),
			words: aboutWords
		},
		counts: {
			sections: 5,
			careers: allCareers.length,
			skillCategories: allSkillCategories.length,
			totalSkills,
			projects: allProjects.length,
			blogs: allBlogs.length,
			totalEntries:
				allCareers.length + allSkillCategories.length + allProjects.length + allBlogs.length
		},
		highlights: {
			careerHighlights: totalCareerHighlights,
			projectScreenshots: totalProjectScreenshots,
			projectLinks: totalProjectLinks,
			blogTags: totalBlogTags
		},
		attention: {
			aboutMissing: !aboutCopy,
			careersWithoutLogo: allCareers.filter((career) => !career.logo).length,
			projectsWithoutScreenshots: allProjects.filter((project) => project.screenshots.length === 0)
				.length,
			blogsWithoutTags: allBlogs.filter((blog) => blog.tags.length === 0).length,
			emptySkillCategories: allSkillCategories.filter((category) => category.skills.length === 0)
				.length
		},
		previews: {
			careers: allCareers.slice(0, 3).map((career) => ({
				id: career.id,
				company: career.company,
				designation: career.designation,
				location: career.location,
				start: career.start,
				end: career.end,
				logo: career.logo,
				skills: career.skills.slice(0, 3),
				highlights: career.detailsList.length
			})),
			skillCategories: allSkillCategories.slice(0, 4).map((category) => ({
				id: category.id,
				title: category.title,
				ordering: category.ordering,
				totalSkills: category.skills.length,
				sampleSkills: category.skills.slice(0, 4)
			})),
			projects: allProjects.slice(0, 4).map((project) => ({
				id: project.id,
				title: project.title,
				description: project.description,
				ordering: project.ordering,
				stack: project.stack.slice(0, 4),
				screenshot: project.screenshots[0] ?? '',
				featureCount: project.features.length,
				hasExternalLink: Boolean(project.github || project.direct)
			})),
			blogs: allBlogs.slice(0, 4).map((blog) => ({
				id: blog.id,
				title: blog.title,
				description: blog.description,
				ordering: blog.ordering,
				tags: blog.tags.slice(0, 4),
				createdAt: blog.createdAt
			})),
			recentBlogs: recentBlogs.map((blog) => ({
				id: blog.id,
				title: blog.title,
				description: blog.description,
				createdAt: blog.createdAt,
				tags: blog.tags.slice(0, 3)
			}))
		}
	};
}
