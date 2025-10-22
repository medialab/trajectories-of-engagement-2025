import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

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
