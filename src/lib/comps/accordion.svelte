<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let { text, title }: { text: string; title: string } = $props();
	let isOpen = $state(false);
</script>

{#if text}
	<div class="flex flex-col gap-[-2.5] w-full overflow-visible gap-4">
		<button
			class="w-full! h-fit! bg-primary rounded-lg p-2 outline -outline-offset-1 overflow-visible hover:brightness-90"
			tabindex="0"
			onclick={() => (isOpen = !isOpen)}
			onkeydown={(e) => e.key === 'Enter' && (isOpen = !isOpen)}
		>
			<p class="font-medium">{title} {isOpen ? '↑' : '↓'}</p>
		</button>
		{#if isOpen}
			<p transition:slide={{ duration: 650, easing: cubicOut, axis: 'y' }}>{text}</p>
		{/if}
	</div>
{/if}
