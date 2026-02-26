import { getDatasource } from '$lib/datasource';
import type { PageServerLoad } from './$types';

const posters = import.meta.glob('/src/lib/assets/posters/*.png', {
	eager: true,
	import: 'default'
}) as Record<string, string>;

export const load: PageServerLoad = async () => {
	const source = getDatasource(await import('$lib/datasource.json'));

	return {
		projects: source.projects,
		posters,
		abstract: source.metadata.abstract ?? '',
		authors: source.metadata.meta_authors ?? []
	};
};
