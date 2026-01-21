import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const data = await import('$lib/datasource.json');
    const intro = data.intro;
    return { intro };
};