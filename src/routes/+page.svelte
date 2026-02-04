<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/comps/btn.svelte';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import { currentTag, currentAuthor, currentResearchCenter } from '$lib/utils';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import infoIcon from '$lib/assets/icons/info.svg';

	import Info from '$lib/comps/info.svelte';
	import Carousel from '$lib/comps/carousel.svelte';
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import { afterNavigate } from '$app/navigation';
	import { isTextureReady } from '$lib/utils';
	import { pageMeta, siteName } from '$lib/seo';
	import Footer from '$lib/comps/footer.svelte';

	let loadElements = $state(false);
	let containerEl: HTMLElement | undefined = $state(undefined);
	let bezRef: any;

	let { data }: PageProps = $props();
	const meta = pageMeta.home;

	afterNavigate(() => {
		loadElements = true;
	});
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

<main class="main_container h-screen">
	{#if !$isTextureReady}
		<section
			class="loader_screen w-full h-full fixed z-100"
			out:fade={{ duration: 1000, easing: cubicOut, delay: 1000 }}
		>
			<p out:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 200 }}>Loading...</p>
		</section>
	{/if}

	{#if loadElements}
		<div
			id="title_container"
			class="fixed flex flex-col gap-2 md:w-fit w-full p-4 z-20 h-fit top-0 left-0"
			transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 600 }}
		>
			<div class="flex flex-col gap-2 bg-[#f5f5f5] p-2">
				<h1 class="text-4xl!">Trajectories<br />of engagement</h1>
				{#if data.abstract}
					<p class="line-clamp-5 md:line-clamp-12 w-[90%] md:w-[62ch]">
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
	{/if}

	{#if $currentTag}
		<div class="md:flex hidden flex-col items-end gap-2 fixed right-4 bottom-16 z-50">
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

	{#if loadElements}
		{#key data.posters}
			<div
				class="carousel_container w-full h-full absolute max-w-[1920px] md:top-0 top-1/5"
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
							loadstatus={loadElements}
							introDelayMs={1000}
						/>
					</Canvas>
				</div>
			</div>
		{/key}
	{/if}

	<Footer />
	<BezierCanvas bind:this={bezRef} />
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
		border-left: 1px solid #000;
		border-right: 1px solid #000;
		touch-action: none;
		overscroll-behavior: contain;
		user-select: none;
		-webkit-user-select: none;
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
		background-color: var(--primary-light);
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
</style>
