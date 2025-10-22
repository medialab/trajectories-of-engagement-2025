<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/comps/btn.svelte';
	import Header from '$lib/comps/hdr.svelte';
	import BezierCanvas from '$lib/comps/cnvs.svelte';
	import { currentTag, currentAuthor, currentResearchCenter } from '$lib/utils';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import Info from '$lib/comps/info.svelte';
	import Carousel from '$lib/comps/carousel.svelte';
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import { afterNavigate } from '$app/navigation';
	import { isTextureReady } from '$lib/utils';

	let loadElements = $state(false);
	let containerEl: HTMLElement | undefined = $state(undefined);
	let bezRef: any;

	let { data }: PageProps = $props();

	$effect(() => {
		console.log(data.posters);
	});

	afterNavigate(() => {
		loadElements = true;
	});
</script>

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
			<h1>Trajectories of engagement</h1>
			<p class="m">
				Trajectories of engagement are the paths through which researchers and external actors meet,
				collaborate, and co-create knowledge—across physical and digital settings—to address public
				issues
			</p>
		</div>

		<Button label="Access the archive ↓" href="/archive" />
	</div>
{/if}

{#if $currentTag}
	<div class="tag_container align_right vertical_flex">
		{#if $currentAuthor}
			<Info label="Leader: {$currentAuthor}" />
		{/if}
		{#if $currentResearchCenter}
			<Info label="Research center: {$currentResearchCenter}" />
		{/if}
		{#if $currentTag}
			<Info label="Title: #{$currentTag}" />
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

<BezierCanvas bind:this={bezRef} />

<style>
	h1 {
		text-transform: uppercase;
		background-color: var(--primary-light);
	}

	p {
		background-color: var(--primary-light);
	}

	.hero_container {
		left: 20px;
		top: 20px;
		width: 50ch;
		row-gap: 20px;
		position: fixed;
		z-index: 5;
	}

	.tag_container {
		position: fixed;
		right: 20px;
		bottom: 20px;
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
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
		cursor: grab;
	}

	.loader_screen {
		width: 100vw;
		height: 100vh;
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

	@media (max-width: 768px) {
		.hero_container {
			top: 80px;
			width: 90%;
		}

		.carousel_container {
			margin-top: 220px;
			overflow: hidden !important;
		}

		.carousel_container > * {
			position: relative !important;
		}
	}
</style>
