<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/comps/btn.svelte';
	import { currentTag, currentAuthor, currentResearchCenter } from '$lib/utils';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import infoIcon from '$lib/assets/icons/info.svg';
	import { getContext } from 'svelte';

	import Info from '$lib/comps/info.svelte';
	import Carousel from '$lib/comps/carousel.svelte';
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import { isTextureReady } from '$lib/utils';
	import { pageMeta, siteName } from '$lib/seo';
	import Footer from '$lib/comps/footer.svelte';

	let containerEl: HTMLElement | undefined = $state(undefined);
	const triggerBezierRegeneration = getContext<(() => void) | undefined>(
		'trigger-bezier-regeneration'
	);

	let { data }: PageProps = $props();
	const meta = pageMeta.home;
</script>

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

<main class="main_container h-screen h-dvh">
	{#if !$isTextureReady}
		<section class="loader_screen w-full h-full fixed z-100">
			<p out:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 200 }}>Loading...</p>
		</section>
	{/if}

	<div
		id="title_container"
		class="fixed flex flex-col gap-2 md:w-fit w-full p-4 2xl:p-6 z-20 h-fit top-0 left-0"
	>
		<div class="flex flex-col gap-2 bg-primary-light p-2">
			<h1 class="uppercase">Trajectories<br />of engagement</h1>
			{#if data.abstract}
				<p class="line-clamp-6 w-[90%] md:w-[50ch]">
					{@html data.abstract}
				</p>
			{/if}
			<div class="flex flex-row gap-2">
				{#each data.authors as author}
					<p class="text-nowrap">
						{#if author.role === 'creator'}
							{author.firstName} {author.lastName}
						{/if}
					</p>
				{/each}
			</div>
		</div>

		<div class="flex flex-row flex-wrap gap-2 w-fit z-30 p-2">
			<Button href="/about" img={infoIcon} />
			<Button label="Read the book" href="https://hal.science/hal-05459145v1" />
			<Button label="Access the archive" href="/archive" />
		</div>
	</div>

	{#if $currentTag}
		<div class="md:flex hidden flex-col items-end gap-2 fixed right-4 bottom-16 2xl:gap-3 z-50">
			{#if $currentAuthor}
				<Info label="Leader	" value={$currentAuthor} />
			{/if}
			{#if $currentResearchCenter}
				<Info label="Research center" value="{$currentResearchCenter.slice(0, 50)}..." />
			{/if}
			{#if $currentTag}
				<Info label="Title" value={$currentTag} />
			{/if}
		</div>
	{/if}

	{#key data.posters}
		<div
			class="carousel_container w-full h-full absolute md:top-0 top-1/5"
			bind:this={containerEl}
			style="pointer-events: {$isTextureReady ? 'all' : 'none'};"
		>
			<svelte:boundary>
				<div>
					<Canvas toneMapping={NoToneMapping}>
						<Carousel
							{containerEl}
							onHoverPoster={() => triggerBezierRegeneration?.()}
							projects={data.projects}
							posters={data.posters}
							loadstatus={true}
							introDelayMs={1000}
						/>
					</Canvas>
				</div>
				{#snippet failed(_error, reset)}
					<div class="carousel_error">
						<p>Carousel unavailable.</p>
						<button type="button" onclick={reset}>Retry</button>
					</div>
				{/snippet}
			</svelte:boundary>
		</div>
	{/key}

	<Footer />
</main>

<style>
	.carousel_container {
		left: 50%;
		transform: translateX(-50%);
		overflow: hidden;
		place-items: start;
		z-index: 1;
		pointer-events: none;
		box-sizing: border-box;
		touch-action: manipulation;
		overscroll-behavior: contain;
		user-select: none;
		cursor: pointer;
	}

	.carousel_container div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		user-select: none;
		-webkit-user-drag: none;
		user-select: none;
		cursor: grab;
	}

	.loader_screen {
		background-color: var(--color-primary-light);
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
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		cursor: cell;
	}

	.loader_screen::-webkit-scrollbar {
		display: none;
	}

	.carousel_error {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: -2.5;
		background-color: var(--color-primary-light);
		z-index: 40;
	}
</style>
