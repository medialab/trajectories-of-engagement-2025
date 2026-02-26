<script lang="ts">
	import type { PageProps } from './$types';

	import Header from '$lib/comps/header.svelte';
	import type { ProjectRecord } from '$lib/datasource';
	import { goto } from '$app/navigation';
	import { isMobile } from '$lib/utils';
	import { pageMeta, siteName } from '$lib/seo';
	import { resolve } from '$app/paths';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { setupLenis } from '$lib/utils';

	let { data }: PageProps = $props();

	let isMobileFlag = $state(isMobile());

	let sortedBy = $state('year');
	let sortOrder = $state<'asc' | 'desc'>('asc');
	const meta = pageMeta.archive;

	const toText = (value: unknown) => (value == null ? '' : String(value));
	const safeTrim = (value: unknown) => toText(value).trim();

	function getKeyValue(project: ProjectRecord, key: string): string | number {
		switch (key) {
			case 'index':
				return data.projects.indexOf(project) + 1;
			case 'year': {
				const y = project?.metadata?.year ?? '';
				const m = String(y).match(/\d{4}/);
				return m ? parseInt(m[0], 10) : -Infinity;
			}
			case 'title':
				return toText(project?.metadata?.title);
			case 'project_leaders':
				return toText(project?.metadata?.project_leaders);
			case 'research_center':
				return toText(project?.metadata?.research_center);
			case 'presentationURL':
				return toText(project?.presentationURL);
			default:
				return '';
		}
	}

	const sortedProjects = $derived(() => {
		const arr = [...data.projects];
		const key = sortedBy;
		const orderMultiplier = sortOrder === 'asc' ? 1 : -1;

		return arr.sort((a, b) => {
			const av = getKeyValue(a, key);
			const bv = getKeyValue(b, key);
			let cmp = 0;
			if (typeof av === 'number' && typeof bv === 'number') {
				cmp = av - bv;
			} else {
				cmp = String(av).localeCompare(String(bv), undefined, {
					numeric: true,
					sensitivity: 'base'
				});
			}
			return cmp * orderMultiplier;
		});
	});

	function handleSort(key: string) {
		if (sortedBy === key) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortedBy = key;
			sortOrder = 'asc';
		}
	}

	onMount(() => {
		let lenis: any = null;
		const controller = new AbortController();

		void setupLenis(undefined, controller.signal).then((l) => {
			if (controller.signal.aborted) {
				l?.destroy();
				return;
			}
			lenis = l;
		});

		return () => {
			controller.abort();
			lenis?.destroy();
		};
	});
</script>

{#snippet sortArrow(key: string)}
	<span
		class="transition-all duration-300 inline-block {sortedBy === key
			? 'opacity-100'
			: 'opacity-0 group-hover:opacity-50'} {sortedBy === key && sortOrder === 'desc'
			? 'rotate-180'
			: ''}"
	>
		↑
	</span>
{/snippet}

<svelte:head>
	<title>{meta.title}</title>
	<meta property="og:title" content={meta.title} />
	<meta property="og:site_name" content={siteName} />
	<meta name="twitter:card" content={meta.twitterCard} />
	<meta name="twitter:title" content={meta.title} />
	<meta property="og:image" content={meta.image} />
	<meta name="twitter:image" content={meta.image} />
	<meta name="description" content={meta.description} />
	<meta property="og:description" content={meta.description} />
	<meta name="twitter:description" content={meta.description} />
	<meta property="og:type" content={meta.type} />
	<meta property="og:url" content={meta.url} />
	<link rel="canonical" href={meta.url} />
</svelte:head>

<main class="main_container h-fit">
	<Header />
	<div class="relative w-fit p-4 mt-16">
		{#if !isMobileFlag}
			<h1 class="uppercase bg-neutral-100">Trajectories of engagement</h1>
		{:else}
			<h1>ARCHIVE</h1>
		{/if}
	</div>

	<div
		class="w-full px-4 z-10 bg-primary-light bg-opacity-50 max-md:relative max-md:top-unset max-md:left-0 max-md:right-0 max-md:transform-none max-md:max-w-none max-md:h-max max-md:mt-0 max-md:mb-[-5]"
	>
		<table class="text-left w-full font-normal border-separate border-spacing-y-5">
			<thead class="bg-primary font-semibold max-md:hidden">
				<tr>
					<th
						scope="col"
						class="w-[5%] p-[5px_5px_5px_0px] group"
						onclick={() => handleSort('index')}
					>
						<button class="cursor-pointer flex items-center gap-1">
							<p>(N)</p>
							{@render sortArrow('index')}
						</button>
					</th>
					<th
						scope="col"
						class="w-[10%] p-[5px_5px_5px_0px] group"
						id="year"
						onclick={() => handleSort('year')}
					>
						<button class="cursor-pointer flex items-center gap-1">
							<p>Dates</p>
							{@render sortArrow('year')}
						</button>
					</th>
					<th
						scope="col"
						class="w-[30%] p-[5px_5px_5px_0px] group"
						id="title"
						onclick={() => handleSort('title')}
					>
						<button class="cursor-pointer flex items-center gap-1">
							<p>Title</p>
							{@render sortArrow('title')}
						</button>
					</th>
					<th
						scope="col"
						class="w-[15%] p-[5px_5px_5px_0px] group"
						id="project_leaders"
						onclick={() => handleSort('project_leaders')}
					>
						<button class="cursor-pointer flex items-center gap-1">
							<p>Author</p>
							{@render sortArrow('project_leaders')}
						</button>
					</th>
					<th
						scope="col"
						class="w-[25%] p-[5px_5px_5px_0px] group"
						id="research_center"
						onclick={() => handleSort('research_center')}
					>
						<button class="cursor-pointer flex items-center gap-1">
							<p>University</p>
							{@render sortArrow('research_center')}
						</button>
					</th>
					<th
						scope="col"
						class="w-[15%] p-[5px_5px_5px_0px] group"
						id="link"
						onclick={() => handleSort('presentationURL')}
					>
						<button class="cursor-pointer flex items-center gap-1">
							<p>Link</p>
							{@render sortArrow('presentationURL')}
						</button>
					</th>
				</tr>
			</thead>
			<tbody
				class="before:content-[''] before:block before:h-[-2.5] max-md:before:h-0 gap-2 border-spacing-2"
			>
				{#each sortedProjects() as project, index}
					<tr
						class="cursor-pointer hover:bg-primary hover:text-[#949494] py-20"
						onclick={(e) => {
							e.stopPropagation();
							const resolvedPath = resolve(`/projects/${project.metadata.id}`);
							goto(resolvedPath);
						}}
					>
						<th scope="row" class="text-[#949494] font-normal align-top max-md:p-[0px_-5_0px_0px]">
							<p>({index + 1})</p>
						</th>
						<td class="align-top text-start max-md:hidden" id="year">
							<p>{safeTrim(project.metadata?.year)}</p>
						</td>
						<td class="align-top text-start" id="title">
							<p>{safeTrim(project.metadata?.title)}</p>
						</td>
						<td class="align-top text-start max-md:hidden" id="project_leaders">
							<p>{safeTrim(project.metadata?.project_leaders)}</p>
						</td>
						<td class="align-top text-start max-md:hidden" id="research_center">
							<p>{safeTrim(project.metadata?.research_center)}</p>
						</td>
						<td
							class="align-top text-start overflow-hidden text-ellipsis whitespace-nowrap max-md:hidden"
							id="link"
						>
							<p>{safeTrim(project.presentationURL)}</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
