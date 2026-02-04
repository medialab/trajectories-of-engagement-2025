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
	class="generic_btn active:scale-[98%] focus:scale-[98%] transition-all ease-in-out duration-125"
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
		<p>
			{props.label}
		</p>
	{/if}

	{#if props?.img && !hasBeenClicked}
		<div
			class="img_container"
			out:slide={{ duration: 350, easing: cubicInOut, axis: 'y' }}
			in:slide={{ duration: 350, easing: cubicInOut, axis: 'y', delay: 1200 }}
		>
			<img src={props?.img} alt={props?.imgAlt} />
		</div>
	{:else if props?.imgVar && hasBeenClicked}
		<div
			class="img_container"
			in:slide={{ duration: 350, easing: cubicInOut, axis: 'y' }}
			out:slide={{ duration: 350, easing: cubicInOut, axis: 'y', delay: 1200 }}
		>
			<img src={props?.imgVar} alt={props?.imgAlt} />
		</div>
	{/if}
</button>

<style>
	.generic_btn {
		border-radius: var(--space-xs);
		background-color: var(--primary-color);
		color: var(--primary-dark);
		cursor: pointer;
		border: 2px solid var(--primary-dark);
		font-weight: 500;
		align-items: center;
		pointer-events: all !important;
	}

	.generic_btn:hover {
		background-color: var(--primary-color);
		filter: invert(0.1);
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

	.img_container {
		height: 20px;
		width: auto;
		aspect-ratio: 1/1;
		place-items: center;
	}

	img {
		width: auto;
		object-fit: contain;
	}
</style>
