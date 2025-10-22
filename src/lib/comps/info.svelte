<script>
	let props = $props();

	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

{#if props.label}
	{#key props.label}
		<div
			class="info_container horizontal_flex"
			in:slide={{ duration: 1000, easing: cubicOut, axis: 'x' }}
		>
			<p class="s">{props.label}</p>
		</div>
	{/key}
{/if}

<style>
	.info_container {
		background-color: var(--primary-color);
		padding: 5px 10px;
		border-radius: 5px;
		width: fit-content;
		height: fit-content;
		border: 2px solid var(--primary-dark);
		white-space: nowrap;
	}
</style>
