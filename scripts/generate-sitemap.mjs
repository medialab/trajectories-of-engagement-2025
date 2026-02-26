import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const site = JSON.parse(readFileSync(resolve(root, 'src/lib/site.json'), 'utf8'));
const data = JSON.parse(readFileSync(resolve(root, 'src/lib/datasource.json'), 'utf8'));

const baseUrl = String(site.baseUrl || '').replace(/\/$/, '');
const projects = Array.isArray(data.projects) ? data.projects : [];

const projectPaths = projects
	.map((project) => String(project?.metadata?.id || '').trim())
	.filter((id) => id.length > 0)
	.map((id) => `/projects/${id}/`)
	.sort((a, b) => a.localeCompare(b));

const paths = ['/', '/about/', '/archive/', ...projectPaths];
const urlEntries = paths
	.map((path) => {
		const loc = `${baseUrl}${path}`;
		return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
	})
	.join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
const sitemapPath = resolve(root, 'static/sitemap.xml');
const previousXml = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf8') : '';

if (xml !== previousXml) {
	writeFileSync(sitemapPath, xml);
}
