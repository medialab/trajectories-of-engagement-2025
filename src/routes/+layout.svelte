<svelte:options runes={true} />

<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';
	import { orgJsonLdScript, websiteJsonLdScript } from '$lib/seo';
	import Tempus from 'tempus';

	let { children } = $props();
	let bezierRef: { triggerRegeneration?: () => void } | null = $state(null);

	setContext('trigger-bezier-regeneration', () => {
		bezierRef?.triggerRegeneration?.();
	});

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
	{@html orgJsonLdScript}
	{@html websiteJsonLdScript}
</svelte:head>

{#key page.url.pathname}
	<main class="min-h-screen min-h-dvh relative z-30 flex flex-col items-center">
		{@render children?.()}
	</main>
{/key}

<BezierCanvas bind:this={bezierRef} />
