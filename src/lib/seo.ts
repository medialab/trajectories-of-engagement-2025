import site from '$lib/site.json';

type PageMeta = {
	title: string;
	description: string;
	url: string;
	image: string;
	type: string;
	twitterCard: string;
};

type ProjectLike = {
	metadata?: {
		id?: string;
		title?: string;
		year?: string;
		project_leaders?: string;
		research_center?: string;
	};
	texts?: {
		presentation?: string;
	};
};

const toText = (value: unknown) => (value == null ? '' : String(value));
const toTrimmed = (value: unknown) => toText(value).trim();

export const siteName = site.siteName;
export const baseUrl = site.baseUrl;

const defaultImage = `${baseUrl}${site.defaultImage}`;

export const pageMeta: Record<'home' | 'about' | 'archive', PageMeta> = {
	home: {
		title: site.siteName,
		description: site.description,
		url: baseUrl,
		image: defaultImage,
		type: 'website',
		twitterCard: 'summary_large_image'
	},
	about: {
		title: `${site.siteName} — About`,
		description: site.aboutDescription,
		url: `${baseUrl}/about/`,
		image: defaultImage,
		type: 'website',
		twitterCard: 'summary_large_image'
	},
	archive: {
		title: `${site.siteName} — Archive`,
		description: site.archiveDescription,
		url: `${baseUrl}/archive/`,
		image: defaultImage,
		type: 'website',
		twitterCard: 'summary_large_image'
	}
};

export const getProjectMeta = (project: ProjectLike | null): PageMeta => {
	const projectId = toTrimmed(project?.metadata?.id);
	const title = toTrimmed(project?.metadata?.title) || `${site.siteName} — Project`;
	const description =
		toTrimmed(project?.texts?.presentation) ||
		toTrimmed(project?.metadata?.project_leaders) ||
		site.description;

	return {
		title,
		description,
		url: projectId ? `${baseUrl}/projects/${projectId}/` : baseUrl,
		image: projectId ? `${baseUrl}/og/${projectId}.jpg` : defaultImage,
		type: 'article',
		twitterCard: 'summary_large_image'
	};
};

const jsonLdScript = (payload: unknown) =>
	`<script type="application/ld+json">${JSON.stringify(payload)}</script>`;

export const orgJsonLdScript = jsonLdScript({
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: site.siteName,
	url: baseUrl,
	description: site.description
});

export const websiteJsonLdScript = jsonLdScript({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: site.siteName,
	url: baseUrl,
	description: site.description
});

const parseAuthors = (leaders: string) =>
	leaders
		.split(/,|;| and /i)
		.map((name) => name.trim())
		.filter((name) => name.length > 0)
		.map((name) => ({ '@type': 'Person', name }));

const extractYear = (value: unknown) => {
	const text = toText(value);
	const match = text.match(/\d{4}/);
	return match ? match[0] : '';
};

export const getProjectJsonLdScript = (project: ProjectLike | null) => {
	if (!project) return '';
	const meta = getProjectMeta(project);
	const authors = parseAuthors(toText(project?.metadata?.project_leaders));
	const datePublished = extractYear(project?.metadata?.year);

	const payload: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: meta.title,
		description: meta.description,
		url: meta.url,
		image: meta.image
	};

	if (authors.length > 0) {
		payload.author = authors;
	}

	if (datePublished) {
		payload.datePublished = datePublished;
	}

	return jsonLdScript(payload);
};
