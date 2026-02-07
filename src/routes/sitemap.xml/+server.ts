import { fetchBlogs, fetchProjects } from '$lib/services/notion';

const SITE_URL = 'https://sushilkamble.com';

export const prerender = true;

export async function GET() {
	const [blogs, projects] = await Promise.all([fetchBlogs(), fetchProjects()]);

	const staticPages = [
		{ loc: '', priority: '1.0', changefreq: 'monthly' },
		{ loc: '/about', priority: '0.8', changefreq: 'monthly' },
		{ loc: '/contact', priority: '0.7', changefreq: 'yearly' },
		{ loc: '/posts', priority: '0.9', changefreq: 'weekly' },
		{ loc: '/projects', priority: '0.9', changefreq: 'weekly' }
	];

	const blogPages = blogs.map((b) => ({
		loc: `/posts/${b.id}`,
		priority: '0.7',
		changefreq: 'monthly'
	}));

	const projectPages = projects.map((p) => ({
		loc: `/projects/${p.id}`,
		priority: '0.7',
		changefreq: 'monthly'
	}));

	const allPages = [...staticPages, ...blogPages, ...projectPages];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
