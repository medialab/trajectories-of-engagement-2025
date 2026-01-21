<script lang="ts">
	import Header from '$lib/comps/header.svelte';
	import Button from '$lib/comps/btn.svelte';
	import logoIcon from '$lib/assets/favicon.svg';
	import BezierCanvas from '$lib/comps/cnvs.svelte';
	import { marked } from 'marked';

	import { isMobile } from '$lib/utils';
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
			<img src={logoIcon} alt="medialab's logo" />
		{:else}
			<h1>ABOUT</h1>
		{/if}
		{#await aboutText then text}
			<p class="l">{@html text}</p>
		{/await}
		<Button label="Get in touch with us" href="mailto:trajectoriesofengagement@sciencespo.fr" />
	</div>
{/if}

{#if isMobileFlag}
	<!-- nada-->
{:else}
	<BezierCanvas />
	<BezierCanvas />
{/if}

<style>
	.about_container {
		position: absolute;
		top: 10%;
		left: 50%;
		transform: translate(-50%);
		width: 95ch;
		row-gap: 20px;
		background-color: var(--primary-light);
		padding: 20px;
		white-space: pre-line;
		justify-content: flex-start;
		align-items: center;
		z-index: 10;
	}

	img {
		width: 30px;
		height: 30px;
	}

	@media (max-width: 768px) {
		.about_container {
			width: 100%;
			top: unset;
			left: unset;
			transform: unset;
			align-items: flex-start;
			position: static;
			margin-top: 80px;
		}
	}
</style>
