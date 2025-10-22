<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/comps/btn.svelte';
	import Header from '$lib/comps/hdr.svelte';
	import BezierCanvas from '$lib/comps/cnvs.svelte';
	import { currentTag, currentAuthor, currentResearchCenter } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import Info from '$lib/comps/info.svelte';
	import Carousel from '$lib/comps/carousel.svelte';
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	let containerEl: HTMLElement | undefined = $state(undefined);
	let bezRef: any;

	let { data }: PageProps = $props();

	$effect(() => {
		console.log(data.posters);
	});
</script>

<Header />

<div class="hero_container vertical_flex">
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

{#key data.posters}
	<div class="carousel_container" bind:this={containerEl} draggable="true">
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
		pointer-events: all;
		touch-action: none;
		overscroll-behavior: contain;
		user-select: none;
		-webkit-user-select: none;
		cursor: grab;
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
