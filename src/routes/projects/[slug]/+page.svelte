<script lang="ts">
	import type { PageProps } from './$types';
	import Header from '$lib/comps/hdr.svelte';
	import Button from '$lib/comps/btn.svelte';
	import Accordion from '$lib/comps/accordion.svelte';
	import BezierCanvas from '$lib/comps/cnvs.svelte';
	import Vid from '$lib/comps/vid.svelte';
	import Poster from '$lib/comps/poster.svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { menuOpen } from '$lib/utils';
	import { onMount } from 'svelte';

	const mainYtb = 'https://www.youtube.com/watch?v=BLa_1fw-pQA';

	let { data }: PageProps = $props();
	let scrollContainer: HTMLElement | null = null;

	$effect(() => {
		console.log('effectFired');
		console.log($menuOpen);
		if (!scrollContainer) return;
		scrollContainer.style.overflowY = $menuOpen ? 'hidden' : 'scroll';
	});

	onMount(() => {
		scrollContainer = document.documentElement;
	});
</script>



<div class="project_page_container" style="overflow: {$menuOpen ? 'hidden' : 'scroll'}">
	<Header />

	<div class="return_btn_container">
		<Button label="← GO BACK" href="back" />
	</div>

	<div class="vertical_flex" style="row-gap: 30px;">
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
		<div class="vertical_flex" style="background-color: var(--primary-light">
			<Accordion text={data.project.texts?.experience} title="Experience" />
			<Accordion text={data.project.texts?.concept} title="Concept" />
			<Vid
				title={data.project.metadata.title}
				src={data.project.presentationURL}
			/>
		</div>
	</div>

	{#if data}
		<div class="media_cont" transition:fade={{ duration: 1000, easing: cubicOut, delay: 1000 }}>
			<Vid
				excerpts={data.project.excerpts}
				src={mainYtb}
			/>
			<Poster
				id={data.project.metadata.id}
				originalPoster={data.originalPoster}
				annotatedPoster={data.annotatedPoster}
			/>
		</div>
	{/if}
</div>

<BezierCanvas />

<style>
	.return_btn_container {
		position: absolute;
		width: fit-content;
		padding: 20px;
		left: 0;
		top: 0;
		z-index: 41;
		pointer-events: none;
	}

	@media (min-width: 1780px) {
		.return_btn_container {
			padding: 20px 0px;
		}
	}

	.project_page_container {
		width: auto;
		position: relative;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		grid-column-gap: 10px;
		margin: 0px 20px 0px 20px;
		padding-top: 80px;
		overflow: hidden;
		background-color: transparent;
		max-width: 1600px;
		place-self: center;
		align-self: center;
		z-index: 15;
	}

	.project_page_container > :first-child {
		grid-column: 1 / 9;
		width: 100%;
		height: fit-content;
		overflow: scroll;
	}

	.project_page_container > :first-child > * {
		background-color: var(--primary-light);
	}

	.media_cont {
		grid-column: 12 / 22;
		position: relative;
		display: flex;
		flex-direction: column;
		height: fit-content;
		align-items: flex-end;
	}

	:global(.media_cont > :nth-child(1)) {
		position: absolute;
		bottom: 0;
		left: 0;
		mix-blend-mode: color-burn;
		max-width: 90%;
		transform: translateY(50%);
	}

	:global(.media_cont > :nth-child(1):hover) {
		z-index: 10;
		mix-blend-mode: normal;
	}

	:global(.media_cont > :nth-child(2):hover) {
		z-index: 10;
		mix-blend-mode: normal;
	}

	:global(.media_cont > :nth-child(2)) {
		position: relative;
		max-height: 90%;
		max-width: 90%;
	}

	@media (max-width: 768px) {
		.project_page_container {
			width: 100%;
			height: fit-content;
			display: flex;
			flex-direction: column;
			margin: 0px;
			padding: 80px 20px;
			row-gap: 20px;
			overflow: scroll;
			background-color: transparent;
		}

		.media_cont {
			width: 100% !important;
			height: fit-content;
			row-gap: 20px;
			position: static;
			justify-content: flex-start;
			margin-bottom: 50px;
		}

		:global(.media_cont > :nth-child(1)), :global(.media_cont > :nth-child(2)) {
			max-width: 100%;
			transform: unset;
		}

		.return_btn_container {
			display: none;
		}
	}
</style>
