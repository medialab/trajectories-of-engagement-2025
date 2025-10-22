<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let props = $props();

	let mixValue = $state(0);

	// Keep opacity derived from slider value
	const mixOpacity = $derived(mixValue / 100);

	// Preload all poster assets and expose their built URLs
	const originals = import.meta.glob('/src/lib/assets/posters/*.png', {
		query: '?url',
		eager: true
	}) as Record<string, string>;

	const annotated = import.meta.glob('/src/lib/assets/posters/*_annotated.png', {
		query: '?url',
		eager: true
	}) as Record<string, string>;
</script>

{#if props.originalPoster !== '' && props.annotatedPoster !== ''}
	<div
		class="post_cont vertical_flex"
		transition:fade={{ duration: 1000, easing: cubicOut, delay: 1000 }}
	>
		<div class="post_head horizontal_flex">
			<p class="s head_text">Original</p>

			<input
				class="mix_slider"
				type="range"
				id="volume"
				name="fading"
				min="0"
				max="110"
				bind:value={mixValue}
				step="any"
			/>
			<label for="fading" style="display: none">Fade</label>

			<p class="s head_text">Annotated</p>
		</div>
		<div class="post_img">
			<img
				class="base_img"
				src={props.originalPoster}
				alt={props.id}
				style="opacity: {1 - mixOpacity};"
			/>
			<img
				class="blend_img"
				src={props.annotatedPoster}
				alt="{props.id}_annotated"
				style="opacity: {mixOpacity};"
			/>
			<div class="bg_back"></div>
		</div>
	</div>
{/if}

<style>
	.post_cont {
		height: 100%;
		width: 538px;
		row-gap: 0px;
		z-index: 1;
		flex: 1;
		mix-blend-mode: color-burn;
		pointer-events: none;
	}

	.post_head {
		height: 40px;
		width: 100%;
		position: relative;
		background-color: var(--primary-color);
		z-index: 2;
		border: 2px solid black;
		justify-content: space-between;
		align-items: center;
		padding: 5px 10px;
		pointer-events: all !important;
		mix-blend-mode: normal;
	}

	.mix_slider {
		width: 100%;
		-webkit-appearance: none;
		appearance: none;
		height: 8px;
		outline: none;
		border-radius: 5px;
		border: 2px solid black;
		pointer-events: all;
		accent-color: green;
	}

	.mix_slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 9px;
		height: 20px;
		background: var(--primary-light);
		cursor: pointer;
		border-radius: 5px;
		border: 2px solid black;
	}

	.mix_slider::-webkit-slider-track {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		border: 2px solid black;
	}

	.head_text {
		text-transform: uppercase;
		font-weight: 500;
	}

	.post_img {
		height: 770px;
		width: 100%;
		border-radius: 0px;
		pointer-events: none;
		position: relative;
		overflow: hidden;
		border: 2px solid black;
	}

	.post_img > img {
		height: fit-content;
		width: 100%;
		object-fit: contain;
		object-position: top;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}

	.bg_back {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: var(--primary-dark);
		z-index: 0;
	}

	@media (max-width: 768px) {
		.post_cont {
			width: 100% !important;
			height: auto !important;
			position: relative !important;
		}

		.post_img > :nth-child(1) {
			position: relative;
		}

		.post_img {
			height: fit-content;
		}
	}
</style>
