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
	import Footer from '$lib/comps/footer.svelte';

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

<Header />

{#if isPageLoaded}
	<div
		class="title_container"
		transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 100 }}
	>
		{#if !isMobileFlag}
			<h1 style="text-transform: uppercase;">Trajectories of engagement</h1>
		{:else}
			<h1>ARCHIVE</h1>
		{/if}
	</div>

	<div class="t_container">
		<table class="archive_table" transition:fade={{ duration: 1000, easing: cubicOut, delay: 200 }}>
			<thead class="t_header">
				<tr>
					<th scope="col" style="width: 5%;"
						><button>(N) {sortedBy === 'index' ? '↑' : ''}</button></th
					>
					<th scope="col" style="width: 10%;" id="year"
						><button onclick={() => (sortedBy = 'year')}
							>Dates {sortedBy === 'year' ? '↑' : ''}</button
						></th
					>
					<th scope="col" style="width: 30%;" id="title"
						><button onclick={() => (sortedBy = 'title')}
							>Title {sortedBy === 'title' ? '↑' : ''}</button
						></th
					>
					<th scope="col" style="width: 15%;" id="project_leaders"
						><button onclick={() => (sortedBy = 'project_leaders')}
							>Author {sortedBy === 'project_leaders' ? '↑' : ''}</button
						></th
					>
					<th scope="col" style="width: 25%;" id="research_center"
						><button onclick={() => (sortedBy = 'research_center')}
							>University {sortedBy === 'research_center' ? '↑' : ''}</button
						></th
					>
					<th scope="col" style="width: 15%;" id="link"
						><button onclick={() => (sortedBy = 'presentationURL')}
							>Link {sortedBy === 'presentationURL' ? '↑' : ''}</button
						></th
					>
				</tr>
			</thead>
			<tbody class="t_body">
				{#each sortedProjects() as project, index}
					<tr
						id="row"
						onclick={(e) => {
							e.stopPropagation();
							const resolvedPath = resolve(`/projects/${project.metadata.id}`);
							goto(resolvedPath);
						}}
					>
						<th scope="row" class="t_num">({index + 1})</th>
						<td id="year">{safeTrim(project.metadata?.year)}</td>
						<td id="title">{safeTrim(project.metadata?.title)}</td>
						<td id="project_leaders">{safeTrim(project.metadata?.project_leaders)}</td>
						<td id="research_center">{safeTrim(project.metadata?.research_center)}</td>
						<td id="link">{safeTrim(project.presentationURL)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<BezierCanvas />

<style>
	.t_container {
		position: absolute;
		top: var(--space-7xl);
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: var(--page-max-width);
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
		position: fixed;
		top: var(--space-xl);
		left: var(--page-gutter);
		width: fit-content;
		height: fit-content;
		background-color: var(--primary-light);
		z-index: 2;
	}

	td {
		align-items: start;
		justify-items: start;
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
			height: fit-content;
			background-color: unset;
			margin-top: 0px;
			padding: 0px var(--space-xl);
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
