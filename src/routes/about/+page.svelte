<script lang="ts">
	import Header from '$lib/comps/header.svelte';
	import Button from '$lib/comps/btn.svelte';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import { marked } from 'marked';
	import Footer from '$lib/comps/footer.svelte';

	import { isMobile, baseUrl, ogTitle, ogDescription } from '$lib/utils';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { data } = $props();

	let isMobileFlag = $state(isMobile());
	let loadElements = $state(false);

	let aboutText = $derived(marked.parse((Object.values(data.intro)[0] as any).markdown));

	onMount(() => {
		isMobileFlag = isMobile();
	});

	afterNavigate(() => {
		loadElements = true;
	});
</script>

<svelte:head>
	<title>{ogTitle}</title>
	<meta property="og:title" content={ogTitle} />
	<meta property="og:site_name" content={ogTitle} />
	<meta name="twitter:card" content={ogTitle} />
	<meta name="twitter:title" content={ogTitle} />
	<meta property="og:image" content={`${baseUrl}/Thumb.jpg`} />
	<meta name="twitter:image" content={`${baseUrl}/Thumb.jpg`} />
	<meta name="description" content={ogDescription} />
	<meta property="og:description" content={ogDescription} />
	<meta name="twitter:description" content={ogDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={baseUrl} />
	<link rel="canonical" href={baseUrl} />
</svelte:head>

<Header />
<div class="return_btn_container">
	<Button label="← GO BACK" href="back" />
</div>

{#if loadElements}
	<div
		class="about_container vertical_flex"
		transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 300 }}
	>
		{#if !isMobileFlag}
			<p>Trajectories of Engagement</p>
		{:else}
			<h1>ABOUT</h1>
		{/if}
		{#await aboutText then text}
			<p class="m" transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 600 }}>
				{@html text}
			</p>
		{/await}
		<Button label="Get in touch with us" href="mailto:trajectoriesofengagement@sciencespo.fr" />
	</div>
{/if}

{#if !isMobileFlag}
	<BezierCanvas />
	<BezierCanvas />
{/if}

<Footer />

<style>
	.about_container {
		position: absolute;
		top: 10%;
		left: 50%;
		transform: translate(-50%);
		width: 95ch;
		row-gap: var(--space-xl);
		background-color: var(--primary-light);
		padding: var(--space-xl);
		padding-bottom: var(--space-5xl);
		white-space: pre-line;
		justify-content: flex-start;
		align-items: center;
		z-index: 10;
	}

	@media (max-width: 768px) {
		.about_container {
			width: 100%;
			top: unset;
			left: unset;
			transform: unset;
			align-items: flex-start;
			position: static;
			margin-top: var(--space-6xl);
		}
	}
</style>
