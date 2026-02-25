<script>
	let props = $props();

	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

{#if props.label}
	{#key props.label + props.value}
		<div
			class="bg-[#ceffbf] horizontal_flex py-2 px-4 rounded-md w-fit h-fit text-nowrap z-20 hidden md:flex outline"
			in:slide={{ duration: 1000, easing: cubicOut, axis: 'x' }}
		>
			<p><b>{props.label}:</b> {props.value}</p>
		</div>
	{/key}
{/if}
