<script lang="ts">
	import Button from '$lib/comps/btn.svelte';
	import BurgerIcon from '$lib/assets/icons/burger.svg';

	import { isMobile } from '$lib/utils';
	import { onMount } from 'svelte';
	import { menuOpen } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { beforeNavigate } from '$app/navigation';

	let isMobileFlag = $state(false);

	onMount(() => {
		isMobileFlag = isMobile();
	});

	beforeNavigate(() => {
		menuOpen.set(false);
	});
</script>

<header class="horizontal_flex">
	{#if isMobileFlag}
		<Button label="TRAJECTORIES" href="/" />
		<Button img={BurgerIcon} href="burger_menu" />
	{:else}
		<Button label="ABOUT" href="/about" />
		<Button label="HOME" href="/" />
	{/if}
</header>

{#if $menuOpen}
	<div
		class="burger_menu vertical_flex"
		in:slide={{ duration: 750, axis: 'y', easing: cubicOut }}
		out:slide={{ duration: 750, axis: 'y', easing: cubicOut, delay: 300 }}
	>
		<div
			class="horizontal_flex lang_switch"
			in:slide={{ duration: 750, axis: 'y', easing: cubicOut, delay: 300 }}
			out:slide={{ duration: 750, axis: 'y', easing: cubicOut }}
		></div>
		<div
			class="vertical_flex clickables"
			in:slide={{ duration: 750, axis: 'y', easing: cubicOut, delay: 300 }}
			out:slide={{ duration: 750, axis: 'y', easing: cubicOut }}
		>
			<Button label="ABOUT" href="/about" />
			<Button label="ARCHIVE" href="/archive" />
			<Button label="HOME" href="/" />
		</div>

		<div
			class="lang_switch bottom_text"
			in:slide={{ duration: 750, axis: 'y', easing: cubicOut, delay: 300 }}
			out:slide={{ duration: 750, axis: 'y', easing: cubicOut }}
		>
			<p class="s">
				This project was brought to life by the combined efforts of medialab sciencespo and
				universite paris nanterre. all rights reserved to medialab sciencespo.
			</p>
		</div>
	</div>
{/if}

<style>
	header {
		position: fixed;
		right: var(--space-xl);
		top: 0;
		width: fit-content;
		column-gap: var(--space-xs);
		z-index: 40;

		justify-content: flex-end;
		padding: var(--space-xl) 0px;
		pointer-events: none;
	}

	:global(.generic_btn) {
		height: 35px !important;
		padding: var(--space-xs) var(--space-m) !important;
	}

	.burger_menu {
		display: none;
	}

	.lang_switch,
	.bottom_text {
		display: none;
	}

	@media (max-width: 768px) {
		header {
			width: 100%;
			max-width: 100vw;
			top: 0px;
			left: 0px;
			right: unset;
			justify-content: space-between;
			padding: 0px var(--space-m);
			background-color: var(--primary-light);
			align-items: center;
			border-bottom: 1px solid var(--primary-dark);
			z-index: 45;
			background-color: white;
		}

		:global(header > button, .burger_menu > div > button, .burger_menu > div > button) {
			border: 0px !important;
			background-color: unset !important;
			font-weight: 700 !important;
		}

		:global(.burger_menu > div > button) {
			padding: 0px !important;
		}

		.burger_menu {
			position: fixed;
			top: 0;
			left: 0;
			padding-top: var(--space-4xl);
			display: flex;
			align-items: flex-start;
			justify-content: center;
			width: 100%;
			height: 100%;
			padding: var(--space-xl);
			background-color: white;
			z-index: 43;
			row-gap: var(--space-xl);
			pointer-events: visible;
			scroll-behavior: disabled;
		}

		:global(.burger_menu > .clickables > button > p) {
			font-size: 48px;
			font-weight: 600;
		}

		.lang_switch {
			display: flex;
			position: absolute;
			top: var(--space-5xl);
			column-gap: var(--space-xs);
		}

		.bottom_text {
			bottom: 0px;
			top: unset !important;
			padding-bottom: var(--space-xl);
		}
	}
</style>
