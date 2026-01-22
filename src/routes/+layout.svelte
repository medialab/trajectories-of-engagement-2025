<svelte:options runes={true} />

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
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
	<title>Trajectories of Engagement 2025</title>
	<meta
		name="description"
		content="A research showcase exploring engagement across culture, media and technology."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
	/>

	<meta name="theme-color" content="#111111" />

	<meta property="og:title" content="Trajectories of Engagement 2025" />
	<meta
		property="og:description"
		content="A research showcase exploring engagement across culture, media and technology."
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/medialab/trajectories-of-engagement-2025/0aa1ea759a3ad925ca650164984cc5e54dbf55c2/static/Thumb.jpg"
	/>
	<meta
		name="twitter:image"
		content="https://raw.githubusercontent.com/medialab/trajectories-of-engagement-2025/0aa1ea759a3ad925ca650164984cc5e54dbf55c2/static/Thumb.jpg"
	/>
	<meta property="og:url" content="https://medialab.github.io/trajectories-of-engagement-2025/" />
	<meta property="og:site_name" content="Trajectories of Engagement 2025" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Trajectories of Engagement 2025" />
	<meta
		name="twitter:description"
		content="A research showcase exploring engagement across culture, media and technology."
	/>
</svelte:head>

{@render children?.()}

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
		border-style: none;
	}

	:root {
		--primary-color: #ceffbf;
		--primary-light: #f5f5f5;
		--primary-dark: #111111;

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

	:global(h1) {
		font-size: 36px;
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.05em;
	}

	:global(p) {
		letter-spacing: -0.05em;
	}

	:global(.s) {
		font-size: 14px;
	}

	:global(.m) {
		font-size: 16px;
	}

	:global(.l) {
		font-size: 26px;
	}

	:global(.xl) {
		font-size: 32px;
	}

	:global(.vertical_flex) {
		display: flex;
		flex-direction: column;
		row-gap: var(--space-m);
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

	:global(.return_btn_container) {
		position: fixed;
		display: flex;
		flex-direction: row;
		column-gap: var(--space-xs);
		width: fit-content;
		padding: var(--space-xl) 0px;
		left: var(--space-xl);
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
