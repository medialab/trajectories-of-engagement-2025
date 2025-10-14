import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const data = await import('$lib/datasource.json');
  const projects = (data as any).default?.projects ?? (data as any).projects ?? [];
  return { projects };
};