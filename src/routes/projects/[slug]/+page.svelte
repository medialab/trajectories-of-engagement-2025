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
	import { menuOpen } from '$lib/utils';
	import { onMount } from 'svelte';
	import Footer from '$lib/comps/footer.svelte';

	const mainYtb = 'https://www.youtube.com/watch?v=BLa_1fw-pQA';

	let { data }: PageProps = $props();
	let scrollContainer: HTMLElement | null = null;

	// Open Graph/Twitter card data
	const BASE = 'https://medialab.github.io/trajectories-of-engagement-2025';
	let pageUrl = $derived(
		data.project?.metadata?.id ? `${BASE}/projects/${data.project.metadata.id}/` : BASE
	);
	let ogTitle = $derived(
		data.project?.metadata?.title
			? `${data.project.metadata.title} – Trajectories of Engagement 2025`
			: 'Project – Trajectories of Engagement 2025'
	);
	let ogDescription = $derived(
		data.project?.texts?.presentation ||
			[data.project?.metadata?.project_leaders, data.project?.metadata?.research_center]
				.filter(Boolean)
				.join(' | ') ||
			'A research showcase exploring engagement across culture, media and technology.'
	);
	let imagePath = $derived((data.annotatedPoster || data.originalPoster) as string | undefined);
	let ogImage = $derived(
		imagePath
			? imagePath.startsWith('http')
				? imagePath
				: `${BASE}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`
			: undefined
	);

	$effect(() => {
		if (!scrollContainer) return;
		scrollContainer.style.overflowY = $menuOpen ? 'hidden' : 'scroll';
	});

	onMount(() => {
		scrollContainer = document.documentElement;
	});
</script>

<svelte:head>
	<title>{ogTitle}</title>
	<meta name="description" content={ogDescription} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:type" content="article" />
	{#if ogImage}<meta property="og:image" content={ogImage} />{/if}
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="Trajectories of Engagement 2025" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	{#if ogImage}<meta name="twitter:image" content={ogImage} />{/if}
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
				<h1 id="pr_title">{data.project.metadata.title}</h1>
				{#if data.project.metadata?.year || data.project.metadata?.project_leaders || data.project.metadata?.research_center}
					<p class="m">
						{data.project.metadata?.year} | {data.project.metadata?.project_leaders} | {data.project
							.metadata?.research_center}
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
				<Vid src={mainYtb} excerpts={data.project.excerpts} />
			</div>
		</div>

		<div class="media_cont" transition:fade={{ duration: 1000, easing: cubicOut, delay: 1000 }}>
			<Vid title={data.project.metadata.title} src={data.project.presentationURL} />
			<Poster
				id={data.project.metadata.id}
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
		margin: 0px var(--space-xl) var(--space-6xl) var(--space-xl);
		padding-top: var(--space-6xl);
		background-color: transparent;
		max-width: 1600px;
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
		mix-blend-mode: color-burn;
		max-width: 90%;
		/* Overlap with the poster above by approximately half of the video's height */
		/* Since the video is 16:9, half of its height is roughly 28% of its width. */
		/* adjusted to account for the 90% max-width. */
		margin-top: -26%;
		z-index: 2;
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
