import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const data = await import('$lib/datasource.json');

	const projects = (data as any).default?.projects ?? (data as any).projects ?? [];

	const project = projects.find((p: any) => p.metadata.id === params.slug);

	if (project) {
		return {
			project
		};
	}

	error(404, 'Not found');
};

export const entries: EntryGenerator = async () => {
	const data = await import('$lib/datasource.json');
	const projects = (data as any).default?.projects ?? (data as any).projects ?? [];
	return projects
		.map((p: any) => p?.metadata?.id)
		.filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
		.map((id: string) => ({ slug: id }));
};
