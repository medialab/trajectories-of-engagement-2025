<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
</svelte:head>

<svelte:options runes={true} />

{@render children?.()}

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
	}

	:root {
		--primary-color: #CEFFBF;
		--primary-light: #F5F5F5;
		--primary-dark: #111111;
	}

	html, body, :global(body) {
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

</style>