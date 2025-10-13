<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
</svelte:head>

{@render children?.()}

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html, body, :global(body) {
		font-family: 'Inter', sans-serif;
		font-weight: 400;
		background-color: #F5F5F5;
	}

	:global(::selection) {
		background-color: #000;
		color: #fff;
	}

	:global(h1) {
		font-size: 48px;
		font-weight: 600;	
		line-height: 1.1;
	}

	:global(p) {
		font-weight: 300;
	}

	:global(.s) {
		font-size: 14px;
			
	}

	:global(.m) {
		font-size: 16px;
		
	}

	:global(.l) {
		font-size: 24px;
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
	
	

</style>