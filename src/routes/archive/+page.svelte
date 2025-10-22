<script lang="ts">
	import type { PageProps } from './$types';

	import Header from '$lib/comps/hdr.svelte';
	import BezierCanvas from '$lib/comps/cnvs.svelte';
	import { goto } from '$app/navigation';
	import { isMobile } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { data }: PageProps = $props();

	let isMobileFlag = $state(isMobile());

	let sortedBy = $state('year');
	let isPageLoaded = $state(false);

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
				return project?.metadata?.title ?? '';
			case 'project_leaders':
				return project?.metadata?.project_leaders ?? '';
			case 'research_center':
				return project?.metadata?.research_center ?? '';
			case 'presentationURL':
				return project?.presentationURL ?? '';
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
					{#if isPageLoaded}
						<tr
							id="row"
							onclick={(e: any) => {
								e.stopPropagation();
								const resolvedPath = resolve(`/projects/${project.metadata.id}`);
								goto(resolvedPath);
							}}
						>
							<th scope="row" class="t_num">({index + 1})</th>
							<td id="year"
								>{project.metadata.year?.trim() ? project.metadata.year : '2020-2023'}</td
							>
							<td id="title">{project.metadata.title?.trim() ? project.metadata.title : ''}</td>
							<td id="project_leaders"
								>{project.metadata.project_leaders?.trim()
									? project.metadata.project_leaders
									: 'Donato Ricci'}</td
							>
							<td id="research_center"
								>{project.metadata.research_center?.trim()
									? project.metadata.research_center
									: 'Medialab Sciences Po'}</td
							>
							<td id="link"
								>{project.presentationURL?.trim() ? project.presentationURL : 'ytb.com'}</td
							>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<BezierCanvas />

<style>
	.t_container {
		position: absolute;
		top: 100px;
		left: 20px;
		right: 20px;
		width: auto;
		z-index: 10;
		background-color: color-mix(in srgb, var(--primary-light) 95%, transparent);
	}

	.archive_table {
		text-align: left;
		width: 100%;
		font-weight: 400;
		border-collapse: separate;
		border-spacing: 0 10px; /* row gap */
	}

	/* add vertical gap between header and first data row */
	.archive_table tbody::before {
		content: '';
		display: block;
		height: 10px; /* adjust gap size */
	}

	.t_header {
		background-color: var(--primary-color);
		font-weight: 600;
	}

	.t_header th {
		padding: 5px 5px 5px 0px;
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
		line-clamp: 1;
		webkit-line-clamp: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.title_container {
		position: fixed;
		top: 20px;
		left: 20px;
		width: fit-content;
		height: fit-content;
		background-color: var(--primary-light);
		z-index: 2;
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
			margin-top: 80px;
			padding: 20px 20px 0px 20px;
		}
		.t_header {
			display: none;
		}

		.t_container {
			position: relative;
			top: unset;
			left: unset;
			right: unset;
			transform: unset;
			width: 100%;
			height: fit-content;
			background-color: unset;
			margin-top: 0px;
			padding: 0px 20px;
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
			padding: 0px 20px 0px 0px;
		}
	}
</style>
