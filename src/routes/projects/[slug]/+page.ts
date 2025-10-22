import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

const posters = import.meta.glob('/src/lib/assets/posters/*.png', {
	eager: true,
	import: 'default'
}) as Record<string, string>;

export const load: PageLoad = async ({ params }) => {
	const data = await import('$lib/datasource.json');

	const projects = (data as any).default?.projects ?? (data as any).projects ?? [];

	const project = projects.find((p: any) => p.metadata.id === params.slug);

	if (project) {
		const originalPoster = posters[`/src/lib/assets/posters/${project.metadata.id}.png`];
		const annotatedPoster = posters[`/src/lib/assets/posters/${project.metadata.id}_annotated.png`];
		return {
			project: project as any,
			originalPoster: originalPoster as string,
			annotatedPoster: annotatedPoster as string
		};
	}

	error(404, 'Not found');
};

// This is used to prerender the project pages, basically traversing the datasource it's able to understand the possible slugs

export const entries: EntryGenerator = async () => {
	const data = await import('$lib/datasource.json');
	const projects = (data as any).default?.projects ?? (data as any).projects ?? [];
	return projects
		.map((p: any) => p?.metadata?.id)
		.filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
		.map((id: string) => ({ slug: id }));
};
