import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const data = await import('$lib/datasource.json');
	const postersRaw = import.meta.glob('/src/lib/assets/posters/*.png', {
		eager: true,
		import: 'default'
	}) as Record<string, string>;
	const projects = (data as any).default?.projects ?? (data as any).projects ?? [];
	return { projects, posters: postersRaw };
};
