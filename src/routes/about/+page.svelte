<script lang="ts">
	import Header from '$lib/comps/header.svelte';
	import Button from '$lib/comps/btn.svelte';
	import BezierCanvas from '$lib/comps/canvas.svelte';
	import { marked } from 'marked';
	import Footer from '$lib/comps/footer.svelte';

	import { isMobile } from '$lib/utils';
	import { pageMeta, siteName } from '$lib/seo';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { setupLenis } from '$lib/utils';

	let { data } = $props();

	let isMobileFlag = $state(isMobile());
	let loadElements = $state(false);
	const meta = pageMeta.about;

	const getIntroMarkdown = (intro: unknown) => {
		const fromBook = intro && typeof intro === 'object' ? (intro as any).fromBook : null;
		const markdown = fromBook && typeof fromBook === 'object' ? (fromBook as any).markdown : '';
		return typeof markdown === 'string' ? markdown : '';
	};

	let aboutText = $derived(marked.parse(getIntroMarkdown(data?.intro)));

	onMount(() => {
		isMobileFlag = isMobile();

		let lenis: any = null;

		setupLenis().then((l) => {
			lenis = l;
		});

		return () => {
			lenis?.destroy();
		};
	});

	afterNavigate(() => {
		loadElements = true;
	});
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta property="og:title" content={meta.title} />
	<meta property="og:site_name" content={siteName} />
	<meta name="twitter:card" content={meta.twitterCard} />
	<meta name="twitter:title" content={meta.title} />
	<meta property="og:image" content={meta.image} />
	<meta name="twitter:image" content={meta.image} />
	<meta name="description" content={meta.description} />
	<meta property="og:description" content={meta.description} />
	<meta name="twitter:description" content={meta.description} />
	<meta property="og:type" content={meta.type} />
	<meta property="og:url" content={meta.url} />
	<link rel="canonical" href={meta.url} />
</svelte:head>

<main class="main_container justify-center">
	{#if loadElements}
		<Header />
		<div
			class="about_container vertical_flex relative w-1/2 px-4 pt-4 mt-16 z-10 place-self-center"
			transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 300 }}
		>
			<h1>About this project</h1>
			{#await aboutText then text}
				<p transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y', delay: 600 }}>
					{@html text}
				</p>
			{/await}
			<Button label="Get in touch with us" href="mailto:trajectoriesofengagement@sciencespo.fr" />
			<div class="credits vertical_flex">
				<p><b>Credits</b></p>
				<p><span>Project design:</span>Marta Severo, Donato Ricci, Robin de Mourat</p>
				<p><span>Chapters editing:</span>Élie Petit, Marta Severo, Donato Ricci</p>
				<p><span>Book design:</span>Donato Ricci</p>
				<p><span>Website design & development:</span>Tommaso Prinetti</p>
				<p><span>Preliminary inquiries and workshop preparation:</span> Alex Pellier</p>
				<p><span>Posters design:</span> Alex Pellier, Donato Ricci, Robin de Mourat</p>
				<p>
					<span>Workshop design and animation:</span> Robin de Mourat, Marta Severo, Alex Pellier
				</p>
				<p><span>Videos captation and editing:</span> la SCOP des sales gosses</p>
			</div>
			<Footer />
		</div>
	{/if}

	{#if !isMobileFlag}
		<BezierCanvas />
		<BezierCanvas />
	{/if}
</main>

<style>
	.about_container {
		position: relative;
		height: max-content;
		top: 10%;
		row-gap: var(--space-xl);
		background-color: var(--primary-light);
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
