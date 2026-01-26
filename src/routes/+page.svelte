<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/comps/btn.svelte';
	import Header from '$lib/comps/header.svelte';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import { currentTag, currentAuthor, currentResearchCenter } from '$lib/utils';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import Info from '$lib/comps/info.svelte';
	import Carousel from '$lib/comps/carousel.svelte';
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import { afterNavigate } from '$app/navigation';
	import { isTextureReady } from '$lib/utils';
	import { marked } from 'marked';
	import { baseUrl, ogDescription, ogTitle } from '$lib/utils';
	import Footer from '$lib/comps/footer.svelte';

	let loadElements = $state(false);
	let containerEl: HTMLElement | undefined = $state(undefined);
	let bezRef: any;

	let { data }: PageProps = $props();

	afterNavigate(() => {
		loadElements = true;
	});

	const getIntroMarkdown = (intro: unknown) => {
		const fromBook = intro && typeof intro === 'object' ? (intro as any).fromBook : null;
		const markdown = fromBook && typeof fromBook === 'object' ? (fromBook as any).markdown : '';
		return typeof markdown === 'string' ? markdown : '';
	};

	let aboutText = $derived(marked.parse(getIntroMarkdown(data?.intro)));
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

{#if !$isTextureReady}
	<section class="loader_screen" out:fade={{ duration: 1000, easing: cubicOut, delay: 1000 }}>
		<p out:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 200 }} class="m">
			Loading...
		</p>
	</section>
{/if}

{#if loadElements}
	<div
		class="hero_container vertical_flex"
		transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 600 }}
	>
		<div class="vertical_flex">
			<h1>Trajectories<br />of engagement</h1>
			{#if aboutText}
				<p class="m line_clamp">
					{@html aboutText}
				</p>
			{/if}
			<div class="horizontal_flex">
				{#each data.authors as author}
					<p class="s">
						{#if author.role === 'creator'}
							{author.firstName} {author.lastName}
						{/if}
					</p>
				{/each}
			</div>
		</div>

		<div class="horizontal_flex">
			<Button label="Read more →" href="/about" />
			<Button label="Access the archive ↓" href="/archive" />
			<Button label="Read the book" href="https://hal.science/hal-05459145v1" />
			<!-- <Button label="Get this bezier" onClick={() => bezRef?.downloadSvg()} /> -->
		</div>
	</div>
{/if}

{#if $currentTag}
	<div class="tag_container align_right vertical_flex">
		{#if $currentAuthor}
			<Info label="Leader	" value={$currentAuthor} />
		{/if}
		{#if $currentResearchCenter}
			<Info label="Research center" value={$currentResearchCenter} />
		{/if}
		{#if $currentTag}
			<Info label="Title" value={$currentTag} />
		{/if}
	</div>
{/if}

{#if loadElements}
	{#key data.posters}
		<div
			class="carousel_container"
			bind:this={containerEl}
			style="pointer-events: {$isTextureReady ? 'all' : 'none'};"
		>
			<div>
				<Canvas toneMapping={NoToneMapping}>
					<Carousel
						{containerEl}
						onHoverPoster={() => bezRef?.triggerRegeneration?.()}
						projects={data.projects}
						posters={data.posters}
					/>
				</Canvas>
			</div>
		</div>
	{/key}
{/if}

<Footer />
<BezierCanvas bind:this={bezRef} />

<style>
	h1 {
		text-transform: uppercase;
		background-color: var(--primary-light);
	}

	p {
		background-color: var(--primary-light);
	}

	.line_clamp {
		display: -webkit-box;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 5;
	}

	@supports not (-webkit-line-clamp: 1) {
		.line_clamp {
			display: block;
			line-height: 1.2;
			max-height: calc(1.2em * 5);
		}
	}

	:global(.line_clamp h2) {
		font-size: 16px;
		font-weight: unset;
	}

	.hero_container {
		left: var(--space-xl);
		top: var(--space-xl);
		width: 50ch;
		row-gap: var(--space-xl);
		position: fixed;
		z-index: 5;
	}

	.tag_container {
		position: fixed;
		right: var(--space-xl);
		bottom: calc(var(--space-xl) + 40px);
		z-index: 10;
	}

	.carousel_container {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		place-items: start;
		z-index: 1;
		pointer-events: none;
		touch-action: none;
		overscroll-behavior: contain;
		user-select: none;
		-webkit-user-select: none;
		cursor: pointer;
	}

	.carousel_container div {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		user-select: none;
		/* Add these to prevent image dragging */
		-webkit-user-drag: none;
		user-select: none;
		cursor: grab;
	}

	.loader_screen {
		width: 100vw;
		height: 100%;
		background-color: var(--primary-light);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 300;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		overflow: hidden;
		-webkit-overflow-scrolling: none;
		-ms-overflow-style: none;
		scrollbar-width: none;
		-ms-touch-action: none;
		touch-action: none;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		cursor: cell;
	}

	.loader_screen::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 768px) {
		.hero_container {
			top: var(--space-4xl);
			width: 90%;
		}

		.carousel_container {
			margin-top: var(--space-huge);
			overflow: hidden !important;
		}

		.carousel_container > * {
			position: relative !important;
		}
	}

	@media (min-width: 1780px) {
		.hero_container {
			width: 60ch;
		}
	}
</style>
