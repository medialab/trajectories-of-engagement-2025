<svelte:options runes={true} />

<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { baseUrl } from '$lib/utils';
	// @ts-ignore - types provided via ambient module until package is installed
	import Tempus from 'tempus';

	let { children } = $props();

	onMount(() => {
		if (!browser) return;
		Tempus.patch();
		return () => {
			Tempus.unpatch();
		};
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href={favicon} />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
	/>

	<meta name="theme-color" content="#111111" />
</svelte:head>

{@render children?.()}

<style>
	:global(*) {
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
		border-style: none;
	}

	:root {
		--primary-color: #ceffbf;
		--primary-light: #f5f5f5;
		--primary-dark: #111111;
		--page-gutter: var(--space-xl);
		--page-max-width: 1600px;
		--page-inset: 0px;

		/* Spacing System */
		--space-3xs: 2px;
		--space-2xs: 4px;
		--space-xs: 5px;
		--space-s: 8px;
		--space-m: 10px;
		--space-ml: 12px;
		--space-l: 15px;
		--space-xl: 20px;
		--space-2xl: 30px;
		--space-3xl: 40px;
		--space-4xl: 50px;
		--space-5xl: 60px;
		--space-6xl: 80px;
		--space-7xl: 100px;
		--space-8xl: 120px;
		--space-huge: 220px;
	}

	:global(html),
	:global(body) {
		font-family: 'Inter', sans-serif;
		font-weight: 300;
		background-color: var(--primary-light);
		width: 100%;
		overscroll-behavior: none;
	}

	:global(::selection) {
		background-color: var(--primary-dark);
		color: #fff;
	}

	:global(.vertical_flex) {
		display: flex;
		flex-direction: column;
		row-gap: var(--space-m);
		overflow-x: visible;
	}

	:global(.narrow) {
		row-gap: var(--space-xs);
		column-gap: var(--space-xs);
	}

	:global(.wide) {
		row-gap: var(--space-xl);
		column-gap: var(--space-xl);
	}

	:global(.horizontal_flex) {
		display: flex;
		flex-direction: row;
		column-gap: var(--space-m);
	}

	:global(.align_right) {
		align-items: flex-end;
	}

	:global(.align_left) {
		align-items: flex-start;
	}

	:global(.align_center) {
		align-items: center;
	}

	:global(button, a) {
		background-color: unset;
		border: unset;
		color: unset;
		font-weight: unset;
		font-size: unset;
		font-family: unset;
		font-style: unset;
		font-variant: unset;
		font-optical-sizing: unset;
		font-kerning: unset;
		font-feature-settings: unset;
		text-wrap: nowrap;
	}

	@media (max-width: 768px) {
		:global(h1) {
			font-size: 32px;
		}

		:global(.l) {
			font-size: 16px;
		}

		:global(body) {
			max-width: 100vw !important;
			overflow-x: hidden !important;
		}

		:global(.return_btn_container) {
			display: none !important;
		}
	}

	@media (min-width: 1780px) {
		:global(h1) {
			font-size: 48px;
		}
	}

	@media (min-width: 1921px) {
		:root {
			--page-gutter: max(var(--space-xl), calc((100vw - var(--page-max-width)) / 2));
			--page-inset: var(--space-m);
		}
	}

	:global(.return_btn_container) {
		position: fixed;
		display: flex;
		flex-direction: row;
		column-gap: var(--space-xs);
		width: fit-content;
		padding: var(--space-xl) 0px;
		left: calc(var(--page-gutter) + var(--page-inset));
		top: 0;
		z-index: 41;
		pointer-events: none;
	}

	@media (min-width: 1780px) {
		:global(.return_btn_container) {
			padding: var(--space-xl) 0px;
		}
	}
</style>
