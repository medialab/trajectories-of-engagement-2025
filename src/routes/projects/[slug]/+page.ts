import { error } from '@sveltejs/kit';
import { getDatasource } from '$lib/datasource';
import type { EntryGenerator, PageLoad } from './$types';

const posters = import.meta.glob('/src/lib/assets/posters/*.png', {
	import: 'default'
}) as Record<string, () => Promise<string>>;

export const load: PageLoad = async ({ params }) => {
	const source = getDatasource(await import('$lib/datasource.json'));
	const project = source.projects.find((item) => item.metadata.id === params.slug);

	if (project) {
		const projectId = project.metadata.id ?? '';
		const originalPosterPath = `/src/lib/assets/posters/${projectId}.png`;
		const annotatedPosterPath = `/src/lib/assets/posters/${projectId}_annotated.png`;
		const [originalPoster, annotatedPoster] = await Promise.all([
			posters[originalPosterPath]
				? posters[originalPosterPath]().catch(() => '')
				: Promise.resolve(''),
			posters[annotatedPosterPath]
				? posters[annotatedPosterPath]().catch(() => '')
				: Promise.resolve('')
		]);

		return {
			project,
			originalPoster: originalPoster ?? '',
			annotatedPoster: annotatedPoster ?? ''
		};
	}

	error(404, 'Not found');
};

export const entries: EntryGenerator = async () => {
	const source = getDatasource(await import('$lib/datasource.json'));
	return source.projects
		.map((item) => item.metadata.id)
		.filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
		.map((id: string) => ({ slug: id }));
};
