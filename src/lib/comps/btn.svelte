<script lang="ts">
	import { goto } from '$app/navigation';
	import { menuOpen } from '$lib/utils';
	import { resolve } from '$app/paths';

	let props = $props();

	const isScheme = (s: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(s);

	const intDecide = (ref: string) => {
		if (!ref) return;

		if (ref === 'back') {
			history.back();
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
		// @ts-ignore
		const resolvedPath = resolve(`${ref}`);
		goto(resolvedPath);
	};
</script>

<button
	type="button"
	data-sveltekit-reload
	class="generic_btn"
	class:disabled={props?.disabled === true}
	onclick={() => intDecide(props?.href)}
	style={props?.img ? 'background-color: white' : ''}
>
	{#if props?.label}
		<p class="m">
			{props.label}
		</p>
	{/if}

	{#if props?.img}
		<img src={props?.img} alt={props?.imgAlt} />
	{/if}
</button>

<style>
	.generic_btn {
		display: flex;
		width: fit-content;
		height: fit-content;
		min-height: 30px;
		padding: 10px 20px;
		border-radius: 5px;
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
		background-color: var(--primary-dark);
		color: var(--primary-color);
	}

	.disabled {
		opacity: 0.3;
	}

	img {
		height: 20px;
	}
</style>
