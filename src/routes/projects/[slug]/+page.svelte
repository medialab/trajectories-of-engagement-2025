<script lang="ts">
	import type { PageProps } from './$types';
	import Header from '$lib/comps/header.svelte';
	import Button from '$lib/comps/btn.svelte';
	import Accordion from '$lib/comps/accordion.svelte';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import Vid from '$lib/comps/vid.svelte';
	import Poster from '$lib/comps/poster.svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { menuOpen, baseUrl } from '$lib/utils';
	import { onMount } from 'svelte';
	import Footer from '$lib/comps/footer.svelte';

	const mainYtb = 'https://www.youtube.com/watch?v=BLa_1fw-pQA';

	let { data }: PageProps = $props();

	const fallbackTitle = 'Trajectories of Engagement 2025';
	const fallbackDescription =
		'A research showcase exploring engagement across culture, media and technology.';
	const fallbackImage = `${baseUrl}/Thumb.jpg`;

	const toText = (value: unknown) => (value == null ? '' : String(value));
	const toTrimmed = (value: unknown) => toText(value).trim();

	let project = $derived(data?.project ?? null);
	let projectId = $derived(toTrimmed(project?.metadata?.id));
	let projectTitle = $derived(toTrimmed(project?.metadata?.title));
	let displayTitle = $derived(projectTitle || 'No data to be displayed');
	let projectYear = $derived(toText(project?.metadata?.year));
	let projectLeaders = $derived(toText(project?.metadata?.project_leaders));
	let projectResearchCenter = $derived(toText(project?.metadata?.research_center));
	let hasSegments = $derived(Array.isArray(project?.excerpts) && project.excerpts.length > 0);

	let metaSummary = $derived(
		[projectLeaders, projectResearchCenter].filter((value) => value.trim().length > 0).join(' | ')
	);

	let pageUrl = $derived(projectId ? `${baseUrl}/projects/${projectId}/` : baseUrl);
	let ogTitle = $derived(projectTitle || fallbackTitle);
	let ogDescription = $derived(project?.texts?.presentation || metaSummary || fallbackDescription);
	let ogImage = $derived(projectId ? `${baseUrl}/og/${projectId}.jpg` : fallbackImage);
</script>

<svelte:head>
	<title>{ogTitle}</title>
	<meta name="description" content={ogDescription} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:type" content="article" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content={`Trajectories of Engagement - ${ogTitle}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={ogImage} />
	<link rel="canonical" href={pageUrl} />
</svelte:head>

<div class="project_page_container">
	<Header />

	<div class="return_btn_container">
		<Button label="← GO BACK" href="back" />
		<Button label="COPY PAGE LINK" href="copyLink" />
	</div>

	{#if data.project}
		<div class="vertical_flex info_container" style="row-gap: var(--space-2xl);">
			<div class="vertical_flex" style="background-color: var(--primary-light)">
				<h1 id="pr_title">{displayTitle}</h1>
				{#if projectYear || projectLeaders || projectResearchCenter}
					<p class="m" style="font-weight: bold;">
						{projectYear} | {projectLeaders} | {projectResearchCenter}
					</p>
				{:else}
					<p class="m">No metadata available</p>
				{/if}
				{#if data.project.texts?.presentation}
					<p class="m">{data.project.texts?.presentation}</p>
				{:else}
					<p class="m">No presentation text available</p>
				{/if}
			</div>
			<div class="vertical_flex" style="background-color: var(--primary-light)">
				<Accordion text={data.project.texts?.experience} title="Experience" />
				<Accordion text={data.project.texts?.concept} title="Concept" />
				{#if hasSegments}
					<Vid src={mainYtb} excerpts={data.project.excerpts} />
				{/if}
			</div>
		</div>

		<div class="media_cont" transition:fade={{ duration: 1000, easing: cubicOut, delay: 1000 }}>
			<Vid title={projectTitle || fallbackTitle} src={data.project.presentationURL} />
			<Poster
				id={projectId}
				originalPoster={data.originalPoster}
				annotatedPoster={data.annotatedPoster}
			/>
		</div>
	{:else}
		<div class="vertical_flex info_container" style="row-gap: var(--space-2xl);">
			<div
				class="vertical_flex"
				style="padding: var(--space-xl); background-color: var(--primary-light)"
			>
				<h1 id="pr_title">Project Not Found</h1>
				<p class="m">We couldn't find the project you're looking for.</p>
				<div style="margin-top: var(--space-xl); pointer-events: auto;">
					<Button label="← BACK TO PROJECTS" href="/projects" />
				</div>
			</div>
		</div>
	{/if}
</div>

<Footer />

<BezierCanvas />

<style>
	.project_page_container {
		width: auto;
		position: relative;
		height: fit-content;
		min-height: 100vh;
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		grid-column-gap: var(--space-m);
		margin: 0px auto var(--space-6xl) auto;
		width: 100%;
		max-width: var(--page-max-width);
		padding-top: var(--space-6xl);
		background-color: transparent;
		place-self: center;
		align-self: center;
		z-index: 15;
	}

	.project_page_container > :first-child > * {
		background-color: var(--primary-light);
	}

	.info_container {
		grid-column: 1 / 10;
		width: 100%;
		height: fit-content;
		overflow: scroll;
	}

	.media_cont {
		grid-column: 12 / 22;
		position: relative;
		display: flex;
		flex-direction: column;
		height: fit-content;
	}

	:global(.media_cont > :nth-child(1)) {
		order: 2;
		align-self: flex-start;
		mix-blend-mode: normal;
		max-width: 90%;
		/* Overlap with the poster above by approximately half of the video's height */
		/* Since the video is 16:9, half of its height is roughly 28% of its width. */
		/* adjusted to account for the 90% max-width. */
		margin-top: -26%;
		z-index: 2;
	}

	@supports (mix-blend-mode: color-burn) {
		:global(.media_cont > :nth-child(1)) {
			mix-blend-mode: color-burn;
		}
	}

	:global(.media_cont > :nth-child(2):hover) {
		z-index: 10;
		mix-blend-mode: normal;
	}

	:global(.media_cont > :nth-child(2)) {
		order: 1;
		align-self: flex-end;
		max-height: 90%;
		max-width: 90%;
		z-index: 1;
	}

	@media (max-width: 1780px) {
		:global(.media_cont) {
			grid-column: 13 / 22 !important;
		}

		:global(.info_container) {
			grid-column: 1 / 9 !important;
		}
	}

	@media (max-width: 768px) {
		.project_page_container {
			width: 100%;
			height: fit-content;
			display: flex;
			flex-direction: column;
			margin: 0px;
			padding: var(--space-6xl) var(--space-xl);
			row-gap: var(--space-xl);
			overflow: scroll;
			background-color: transparent;
		}

		.media_cont {
			width: 100% !important;
			height: fit-content;
			row-gap: var(--space-xl);
			position: static;
			justify-content: flex-start;
			margin-bottom: var(--space-4xl);
		}

		:global(.media_cont > :nth-child(1)),
		:global(.media_cont > :nth-child(2)) {
			max-width: 100%;
			transform: unset;
			order: unset;
			margin-top: 0;
		}
	}
</style>
