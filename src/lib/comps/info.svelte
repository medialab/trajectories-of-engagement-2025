<script>
	let props = $props();

	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

{#if props.label}
	{#key props.label + props.value}
		<div
			class="info_container horizontal_flex py-2 px-4 rounded-md w-fit h-fit text-nowrap z-20 hidden md:flex"
			in:slide={{ duration: 1000, easing: cubicOut, axis: 'x' }}
		>
			<p><b>{props.label}:</b> {props.value}</p>
		</div>
	{/key}
{/if}

<style>
	.info_container {
		background-color: var(--primary-color);
		border: 1.5px solid black;
	}

	@media (max-width: 768px) {
		.info_container {
			display: none;
		}
	}
</style>
