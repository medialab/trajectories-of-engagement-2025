<script lang="ts">
	import { goto } from '$app/navigation';
	import { menuOpen } from '$lib/utils';
	import { resolve } from '$app/paths';

	let props = $props();

	const intDecide = (o: unknown) => {
		console.log(o);

		if (o === 'back') {
			history.back();
			return;
		}
		if (o === 'burger_menu') {
			$menuOpen = !$menuOpen;
			return;
		} else if (typeof o === 'string') {
			// @ts-ignore
			const resolvedPath = resolve(`${o}`);
			goto(resolvedPath);
		}
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
