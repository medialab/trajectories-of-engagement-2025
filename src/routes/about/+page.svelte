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

	const getIntroMarkdown = (intro: unknown) => {
		const fromBook = intro && typeof intro === 'object' ? (intro as any).fromBook : null;
		const markdown = fromBook && typeof fromBook === 'object' ? (fromBook as any).markdown : '';
		return typeof markdown === 'string' ? markdown : '';
	};

	let aboutText = $derived(marked.parse(getIntroMarkdown(data?.intro)));

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
		<div class="credits vertical_flex">
			<p class="m"><b>Credits</b></p>
			<p class="m"><span>Project design:</span>Marta Severo, Donato Ricci, Robin de Mourat</p>
			<p class="m"><span>Chapters editing:</span>Élie Petit, Marta Severo, Donato Ricci</p>
			<p class="m"><span>Book design:</span>Donato Ricci</p>
			<p class="m"><span>Website design & development:</span>Tommaso Prinetti</p>
			<p class="m"><span>Preliminary inquiries and workshop preparation:</span> Alex Pellier</p>
			<p class="m"><span>Posters design:</span> Alex Pellier, Donato Ricci, Robin de Mourat</p>
			<p class="m">
				<span>Workshop design and animation:</span> Robin de Mourat, Marta Severo, Alex Pellier
			</p>
			<p class="m"><span>Videos captation and editing:</span> la SCOP des sales gosses</p>
		</div>
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

	.credits {
		width: 100%;
		align-items: flex-start;
		row-gap: var(--space-xs);
		border-top: 2px solid var(--primary-dark);
		padding-top: var(--space-m);
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
