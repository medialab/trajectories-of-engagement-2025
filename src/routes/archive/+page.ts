import { getDatasource } from '$lib/datasource';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const source = getDatasource(await import('$lib/datasource.json'));
	return { projects: source.projects };
};
