<script lang="ts">
	import { goto } from '$app/navigation';
	import { menuOpen } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let props = $props();

	const isScheme = (s: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(s);

	const intDecide = (ref: string) => {
		if (!ref) return;

		if (ref === 'back') {
			history.back();
			return;
		}

		if (ref === 'copyLink') {
			navigator.clipboard.writeText(window.location.href);
			return;
		}

		if (ref === 'burger_menu') {
			$menuOpen = !$menuOpen;
			return;
		}

		if (isScheme(ref)) {
			if (/^https?:\/\//i.test(ref)) {
				window.open(ref, '_blank');
			} else {
				window.location.href = ref;
			}
			return;
		}
		const resolvedPath = (resolve as any)(`${ref}`);
		(goto as any)(resolvedPath);
	};

	let hasBeenClicked = $state(false);

	const clickLoop = () => {
		if (!props?.imgVar) return;
		hasBeenClicked = true;
		setTimeout(() => {
			hasBeenClicked = false;
		}, 400);
	};
</script>

<button
	type="button"
	data-sveltekit-reload
	class="generic_btn active:scale-[98%] focus:scale-[98%] transition-all ease-in-out duration-125
	min-h-[40px] max-h-[40px] 2xl:min-h-[80px] 2xl:max-h-[80px]"
	class:disabled={props?.disabled === true}
	onclick={() => {
		if (props.onClick) {
			props.onClick();
			return;
		}
		intDecide(props?.href);
		clickLoop();
	}}
	style={props?.img ? 'background-color: white' : ''}
>
	{#if props?.label}
		<p class="mx-2 2xl:mx-4">
			{props.label}
		</p>
	{/if}

	{#if props?.img && !hasBeenClicked}
		<div
			class="aspect-square 2xl:mx-4"
			out:slide={{ duration: 350, easing: cubicInOut, axis: 'y' }}
			in:slide={{ duration: 350, easing: cubicInOut, axis: 'y', delay: 1200 }}
		>
			<img src={props?.img} alt={props?.imgAlt} />
		</div>
	{:else if props?.imgVar && hasBeenClicked}
		<div
			class="aspect-square 2xl:mx-4"
			in:slide={{ duration: 350, easing: cubicInOut, axis: 'y' }}
			out:slide={{ duration: 350, easing: cubicInOut, axis: 'y', delay: 1200 }}
		>
			<img src={props?.imgVar} alt={props?.imgAlt} />
		</div>
	{/if}
</button>

<style>
	.generic_btn {
		background-color: var(--primary-color);
	}

	.generic_btn:active {
		background-color: var(--primary-dark) !important;
		color: var(--primary-color);
	}

	.generic_btn:active img {
		filter: invert(1) brightness(10);
	}

	.disabled {
		opacity: 0.3;
	}
</style>
