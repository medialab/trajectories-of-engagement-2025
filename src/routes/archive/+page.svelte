<script lang="ts">
	import type { PageProps } from './$types';

	import Header from '$lib/comps/header.svelte';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import { goto } from '$app/navigation';
	import { isMobile, baseUrl, ogTitle, ogDescription } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { setupLenis } from '$lib/utils';

	let { data }: PageProps = $props();

	let isMobileFlag = $state(isMobile());

	let sortedBy = $state('year');
	let isPageLoaded = $state(false);

	const toText = (value: unknown) => (value == null ? '' : String(value));
	const safeTrim = (value: unknown) => toText(value).trim();

	afterNavigate(() => {
		isPageLoaded = true;
	});

	function getKeyValue(project: any, key: string): string | number {
		switch (key) {
			case 'index':
				return (data.projects as any[]).indexOf(project) + 1;
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
		const arr = [...(data.projects as any[])];
		const key = sortedBy;
		return arr.sort((a, b) => {
			const av = getKeyValue(a, key);
			const bv = getKeyValue(b, key);
			if (typeof av === 'number' && typeof bv === 'number') return av - bv;
			return String(av).localeCompare(String(bv), undefined, {
				numeric: true,
				sensitivity: 'base'
			});
		});
	});

	onMount(() => {
		let lenis: any = null;

		setupLenis().then((l) => {
			lenis = l;
		});

		return () => {
			lenis?.destroy();
		};
	});
</script>

<svelte:head>
	<title>{ogTitle}</title>
	<meta property="og:title" content={ogTitle} />
	<meta property="og:site_name" content={ogTitle} />
	<meta name="twitter:card" content={ogTitle} />
	<meta name="twitter:title" content={ogTitle} />
	<meta property="og:image" content={`${baseUrl}/Thumb.jpg`} />
	<meta name="twitter:image" content={`${baseUrl}/Thumb.jpg`} />
	<meta name="description" content={ogDescription} />
	<meta property="og:description" content={ogDescription} />
	<meta name="twitter:description" content={ogDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={baseUrl} />
	<link rel="canonical" href={baseUrl} />
</svelte:head>
<main class="main_container h-fit">
	<Header />
	{#if isPageLoaded}
		<div
			class="relative w-fit p-4 mt-16"
			transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 100 }}
		>
			{#if !isMobileFlag}
				<h1 style="text-transform: uppercase;">Trajectories of engagement</h1>
			{:else}
				<h1>ARCHIVE</h1>
			{/if}
		</div>

		<div class="t_container w-full px-4">
			<table
				class="archive_table"
				transition:fade={{ duration: 1000, easing: cubicOut, delay: 200 }}
			>
				<thead class="t_header">
					<tr>
						<th scope="col" style="width: 5%;" onclick={() => (sortedBy = 'index')}
							><button class="cursor-pointer"><p>(N) {sortedBy === 'index' ? '↑' : ''}</p></button
							></th
						>
						<th scope="col" style="width: 10%;" id="year" onclick={() => (sortedBy = 'year')}
							><button class="cursor-pointer"><p>Dates {sortedBy === 'year' ? '↑' : ''}</p></button
							></th
						>
						<th scope="col" style="width: 30%;" id="title" onclick={() => (sortedBy = 'title')}
							><button class="cursor-pointer"><p>Title {sortedBy === 'title' ? '↑' : ''}</p></button
							></th
						>
						<th
							scope="col"
							style="width: 15%;"
							id="project_leaders"
							onclick={() => (sortedBy = 'project_leaders')}
							><button class="cursor-pointer"
								><p>Author {sortedBy === 'project_leaders' ? '↑' : ''}</p></button
							></th
						>
						<th
							scope="col"
							style="width: 25%;"
							id="research_center"
							onclick={() => (sortedBy = 'research_center')}
							><button class="cursor-pointer"
								><p>University {sortedBy === 'research_center' ? '↑' : ''}</p></button
							></th
						>
						<th
							scope="col"
							style="width: 15%;"
							id="link"
							onclick={() => (sortedBy = 'presentationURL')}
							><button class="cursor-pointer"
								><p>Link {sortedBy === 'presentationURL' ? '↑' : ''}</p></button
							></th
						>
					</tr>
				</thead>
				<tbody class="t_body">
					{#each sortedProjects() as project, index}
						<tr
							id="row"
							class="cursor-pointer"
							onclick={(e) => {
								e.stopPropagation();
								const resolvedPath = resolve(`/projects/${project.metadata.id}`);
								goto(resolvedPath);
							}}
						>
							<th scope="row" class="t_num"><p>({index + 1})</p></th>
							<td id="year"><p>{safeTrim(project.metadata?.year)}</p></td>
							<td id="title"><p>{safeTrim(project.metadata?.title)}</p></td>
							<td id="project_leaders"><p>{safeTrim(project.metadata?.project_leaders)}</p></td>
							<td id="research_center"><p>{safeTrim(project.metadata?.research_center)}</p></td>
							<td id="link"><p>{safeTrim(project.presentationURL)}</p></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>
<BezierCanvas />

<style>
	.t_container {
		z-index: 10;
		background-color: var(--primary-light);
		background-color: color-mix(in srgb, var(--primary-light) 95%, transparent);
	}

	.archive_table {
		text-align: left;
		width: 100%;
		font-weight: 400;
		border-collapse: separate;
		border-spacing: 0 var(--space-m); /* row gap */
	}

	/* add vertical gap between header and first data row */
	.archive_table tbody::before {
		content: '';
		display: block;
		height: var(--space-m); /* adjust gap size */
	}

	.t_header {
		background-color: var(--primary-color);
		font-weight: 600;
	}

	.t_header th {
		padding: var(--space-xs) var(--space-xs) var(--space-xs) 0px;
		border-top: 2px solid #000;
		border-bottom: 2px solid #000;
	}

	.t_header th:first-child {
		border-left: 2px solid #000;
	}
	.t_header th:last-child {
		border-right: 2px solid #000;
	}

	.t_num {
		color: #949494;
		font-weight: 400;
		vertical-align: top;
	}

	#row:hover {
		background-color: var(--primary-color);
		color: #949494;
	}

	#row {
		cursor: pointer;
	}

	#link {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.title_container {
		position: relative;
		top: var(--space-xl);
		left: var(--page-gutter);
		width: fit-content;
		height: fit-content;
		background-color: var(--primary-light);
		z-index: 2;
	}

	td {
		vertical-align: top;
		justify-items: start;
		text-align: start;
	}

	@media (max-width: 768px) {
		.title_container {
			position: static;
			top: unset;
			left: unset;
			transform: unset;
			width: 100%;
			height: fit-content;
			background-color: unset;
			margin-top: var(--space-6xl);
			padding: var(--space-xl) var(--space-xl) 0px var(--space-xl);
		}
		.t_header {
			display: none;
		}

		.t_container {
			position: relative;
			top: unset;
			left: 0;
			right: 0;
			transform: none;
			width: 100%;
			max-width: none;
			height: max-content;
			background-color: unset;
			margin-top: 0px;
			margin-bottom: var(--space-xl);
			background-color: var(--primary-light);
			z-index: 10;
		}

		#year,
		#project_leaders,
		#research_center,
		#link {
			display: none;
		}

		.archive_table tbody::before {
			height: 0px; /* adjust gap size */
		}

		.t_num {
			padding: 0px var(--space-xl) 0px 0px;
		}
	}
</style>
