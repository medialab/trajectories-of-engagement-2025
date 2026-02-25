export interface MetaAuthor {
	firstName?: string;
	lastName?: string;
	role?: string;
	[key: string]: unknown;
}

export interface IntroContent {
	fromBook?: {
		markdown?: string;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

export interface ProjectMetadata {
	id?: string;
	title?: string;
	year?: string;
	project_leaders?: string;
	research_center?: string;
	[key: string]: unknown;
}

export interface ProjectTexts {
	presentation?: string;
	experience?: string;
	concept?: string;
	[key: string]: unknown;
}

export interface ProjectExcerpt {
	type?: string;
	timecodes?: string[];
	[key: string]: unknown;
}

export interface ProjectRecord {
	metadata: ProjectMetadata;
	texts?: ProjectTexts;
	presentationURL?: string;
	excerpts?: ProjectExcerpt[];
	[key: string]: unknown;
}

export interface DatasourceMetadata {
	title?: string;
	abstract?: string;
	meta_authors?: MetaAuthor[];
	[key: string]: unknown;
}

export interface DatasourceRoot {
	metadata: DatasourceMetadata;
	intro?: IntroContent;
	projects: ProjectRecord[];
}

type DatasourceModule = DatasourceRoot | { default: DatasourceRoot };

const isDatasourceRoot = (value: unknown): value is DatasourceRoot => {
	if (!value || typeof value !== 'object') return false;

	const record = value as Record<string, unknown>;
	return 'metadata' in record && 'projects' in record;
};

export const getDatasource = (module: DatasourceModule): DatasourceRoot => {
	const candidate = 'default' in module ? module.default : module;
	const source = isDatasourceRoot(candidate) ? candidate : { metadata: {}, projects: [] };

	return {
		metadata: source.metadata ?? {},
		intro: source.intro,
		projects: Array.isArray(source.projects) ? source.projects : []
	};
};
