<script lang="ts">
	import Header from '$lib/comps/header.svelte';
	import Button from '$lib/comps/btn.svelte';
	import { marked } from 'marked';
	import Footer from '$lib/comps/footer.svelte';

	import { pageMeta, siteName } from '$lib/seo';
	import type { IntroContent } from '$lib/datasource';
	import { onMount } from 'svelte';
	import { setupLenis } from '$lib/utils';

	let { data } = $props();
	const meta = pageMeta.about;

	const getIntroMarkdown = (intro?: IntroContent) => intro?.fromBook?.markdown ?? '';
	const sanitizeMarkdown = (value: string) =>
		value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
	const sanitizeHtml = (value: string) =>
		value
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
			.replace(/\son\w+=["'][^"']*["']/gi, '')
			.replace(/\s(href|src)=["']\s*javascript:[^"']*["']/gi, ' $1="#"');

	let aboutText = $derived(
		Promise.resolve(marked.parse(sanitizeMarkdown(getIntroMarkdown(data?.intro)))).then((html) =>
			sanitizeHtml(typeof html === 'string' ? html : String(html))
		)
	);

	onMount(() => {
		let lenis: { destroy: () => void } | null = null;
		const controller = new AbortController();

		void setupLenis(undefined, controller.signal).then((l) => {
			if (controller.signal.aborted) {
				l?.destroy();
				return;
			}
			lenis = l;
		});

		return () => {
			controller.abort();
			lenis?.destroy();
		};
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
	<Header />
	<div class="about_container vertical_flex relative w-1/2 px-4 pt-4 my-16 z-10 place-self-center">
		<h1>About this project</h1>
		{#await aboutText then text}
			<p>
				{@html text}
			</p>
		{:catch}
			<p>Content is temporarily unavailable.</p>
		{/await}

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
		<Button label="Get in touch with us" href="mailto:trajectoriesofengagement@sciencespo.fr" />
	</div>
	<Footer />
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
		outline: 2px solid var(--primary-dark);
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
