<script lang="ts">
	import { goto } from '$app/navigation';
	import { menuOpen } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let props = $props();

	const isScheme = (s: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(s);
	const copyToClipboardFallback = (text: string) => {
		const el = document.createElement('textarea');
		el.value = text;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		try {
			document.execCommand('copy');
		} catch (err) {
			console.error('Fallback copy failed', err);
		}
		document.body.removeChild(el);
	};

	const intDecide = (ref: string) => {
		if (!ref) return;

		if (ref === 'back') {
			history.back();
			return;
		}

		if (ref === 'copyLink') {
			const textToCopy = window.location.href;
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard.writeText(textToCopy).catch(() => {
					// Fallback if writeText fails
					copyToClipboardFallback(textToCopy);
				});
			} else {
				copyToClipboardFallback(textToCopy);
			}
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
	class="generic_btn active:scale-[98%] focus:scale-[98%] transition-all ease-in-out duration-125 h-[40px]"
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
		<p class="mx-2">
			{props.label}
		</p>
	{/if}

	{#if props?.img && !hasBeenClicked}
		<div
			class="aspect-square h-fill w-auto"
			out:slide={{ duration: 350, easing: cubicInOut, axis: 'y' }}
			in:slide={{ duration: 350, easing: cubicInOut, axis: 'y', delay: 1200 }}
		>
			{#if hasBeenClicked}
				<img src={props?.imgVar} alt={props?.imgAlt} transition:slide={{ duration: 350 }} />
			{:else}
				<img src={props?.img} alt={props?.imgAlt} transition:slide={{ duration: 350 }} />
			{/if}
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
