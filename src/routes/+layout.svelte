<svelte:options runes={true} />

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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
	}

	:root {
		--primary-color: #ceffbf;
		--primary-light: #f5f5f5;
		--primary-dark: #111111;
	}

	:global(html),
	:global(body) {
		font-family: 'Inter', sans-serif;
		font-weight: 300;
		background-color: var(--primary-light);
	}

	:global(::selection) {
		background-color: var(--primary-dark);
		color: #fff;
	}

	:global(h1) {
		font-size: 48px;
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
		row-gap: 10px;
	}

	:global(.narrow) {
		row-gap: 5px;
		column-gap: 5px;
	}

	:global(.wide) {
		row-gap: 20px;
		column-gap: 20px;
	}

	:global(.horizontal_flex) {
		display: flex;
		flex-direction: row;
		column-gap: 10px;
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
	}
</style>
