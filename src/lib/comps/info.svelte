<script>
	let props = $props();

	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

{#if props.label}
	{#key props.label + props.value}
		<div
			class="info_container horizontal_flex"
			in:slide={{ duration: 1000, easing: cubicOut, axis: 'x' }}
		>
			<p class="s"><b>{props.label}:</b> {props.value}</p>
		</div>
	{/key}
{/if}

<style>
	.info_container {
		background-color: var(--primary-color);
		padding: var(--space-xs) var(--space-m);
		border-radius: var(--space-xs);
		width: fit-content;
		height: fit-content;
		border: 2px solid var(--primary-dark);
		white-space: nowrap;
		z-index: 20;
	}
</style>
