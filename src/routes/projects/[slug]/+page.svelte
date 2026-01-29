<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/comps/btn.svelte';
	import Accordion from '$lib/comps/accordion.svelte';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import Vid from '$lib/comps/vid.svelte';
	import Poster from '$lib/comps/poster.svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Footer from '$lib/comps/footer.svelte';
	import copyIcon from '$lib/assets/icons/copy.svg';
	import infoIcon from '$lib/assets/icons/info.svg';
	import checkIcon from '$lib/assets/icons/check.svg';
	import { setupLenis, baseUrl } from '$lib/utils';
	import { onMount } from 'svelte';

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
<div class="project_page_container place-self-center">
	{#if data.project}
		<div class="col-2 row-span-1 w-full h-fit flex flex-row gap-2 justify-between">
			<div class="flex flex-row gap-2">
				<Button label="← GO BACK" href="back" />
				<Button href="copyLink" img={copyIcon} imgVar={checkIcon} />
				<Button href="/about" img={infoIcon} />
			</div>
		</div>
		<div class="flex flex-col info_container gap-8">
			<div class="vertical_flex bg-[#f5f5f5] gap-4">
				<h1 id="pr_title">{displayTitle}</h1>
				{#if projectYear || projectLeaders || projectResearchCenter}
					<p style="font-weight: bold;">
						{projectYear} | {projectLeaders} | {projectResearchCenter}
					</p>
				{:else}
					<p>No metadata available</p>
				{/if}
				{#if data.project.texts?.presentation}
					<p>{data.project.texts?.presentation}</p>
				{:else}
					<p>No presentation text available</p>
				{/if}
			</div>
			<div class="flex flex-col bg-[#f5f5f5] gap-4">
				<Accordion text={data.project.texts?.experience} title="Experience" />
				<Accordion text={data.project.texts?.concept} title="Concept" />
				{#if hasSegments}
					<Vid src={mainYtb} excerpts={data.project.excerpts} />
				{/if}
			</div>
		</div>

		<div
			class="media_cont grid-cols-2 grid-rows-3"
			transition:fade={{ duration: 1000, easing: cubicOut, delay: 1000 }}
		>
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
				<p>We couldn't find the project you're looking for.</p>
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
		position: relative;
		display: grid;
		height: max-content;
		grid-template-columns: 1fr 2fr 1fr;
		grid-template-rows: auto auto auto;
		grid-gap: var(--space-xl);
		grid-column-gap: var(--space-m);
		place-items: center;
		padding: var(--space-4xl) var(--space-l);
		width: 100%;
		max-width: var(--page-max-width);
		background-color: transparent;
		z-index: 15;
	}

	.project_page_container > :first-child > * {
		background-color: var(--primary-light);
	}

	.info_container {
		grid-column: 2;
		grid-row: 2;
		width: 100%;
		height: fit-content;
		overflow-y: scroll;
		overflow-x: visible;
	}

	.media_cont {
		grid-column: 2;
		grid-row: 3;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: fit-content;
		width: 80%;
		padding: 0;
		margin: 0;
	}

	:global(.media_cont > :nth-child(1)) {
		order: 2;
		align-self: flex-start;
		mix-blend-mode: normal;
		max-width: 90%;
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

	@media (max-width: 768px) {
		.project_page_container {
			width: 100%;
			height: fit-content;
			display: flex;
			flex-direction: column;
			margin: 0px;
			padding: var(--space-2xl) var(--space-xl);
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
