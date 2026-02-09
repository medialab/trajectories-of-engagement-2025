<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut, quartInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { afterNavigate } from '$app/navigation';

	let props = $props();

	const isNonEmptyString = (value: unknown): value is string =>
		typeof value === 'string' && value.trim().length > 0;

	let initialSlide = new Tween(20, { duration: 2000, easing: quartInOut });

	let mixValue = $state(100);

	let maxValue = $state(100);
	let minValue = $state(0);

	const mixOpacity = $derived(mixValue / 100);
	const hasPosters = $derived.by(
		() => isNonEmptyString(props.originalPoster) && isNonEmptyString(props.annotatedPoster)
	);
	const safeId = $derived.by(() => (typeof props.id === 'string' ? props.id.trim() : ''));

	function slideAnimation() {
		initialSlide.set(100);
		setTimeout(() => {
			initialSlide.set(10);
		}, 2000);
	}

	async function downloadPoster(annotatedURl: string, originalURl: string, title: string) {
		const safeTitle = typeof title === 'string' ? title.trim() : '';
		if (!safeTitle) return;
		let sourceURl: string;

		if (mixValue < 50) {
			sourceURl = originalURl;
		} else {
			sourceURl = annotatedURl;
		}

		const response = await fetch(sourceURl);
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${safeTitle}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	afterNavigate(() => {
		setTimeout(() => {
			slideAnimation();
		}, 100);
	});

	$effect(() => {
		mixValue = initialSlide.current;
	});
</script>

{#if hasPosters}
	<div class="post_img">
		<p
			class="mix_value cursor-grab text-base!"
			style="left: {Math.max(12, Math.min(88, Math.round(mixValue)))}%; white-space: nowrap"
		>
			← Grab me →
		</p>
		<div class="slid_cont horizontal_flex">
			<input
				class="mix_slider"
				type="range"
				name="fading"
				min={minValue}
				max={maxValue}
				bind:value={mixValue}
				step="any"
			/>
			<label for="fading" style="display: none">Fade</label>
		</div>
		<img
			class="base_img"
			src={props.originalPoster}
			alt={safeId}
			style="opacity: {1 - mixOpacity};"
		/>
		<img
			class="blend_img"
			src={props.annotatedPoster}
			alt={safeId ? `${safeId}_annotated` : ''}
			style="opacity: {mixOpacity};"
		/>
		<button
			class="download_btn"
			onclick={() => downloadPoster(props.annotatedPoster, props.originalPoster, safeId)}
			aria-label="Download poster"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
				><path
					d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
				/></svg
			>
		</button>
		<div class="bg_back"></div>
	</div>
{/if}

<style>
	.mix_value {
		position: absolute;
		z-index: 20;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1px var(--space-xs);
		background-color: var(--primary-color);
		border: 1px solid black;
		transform-origin: center;
	}

	.slid_cont {
		height: 100%;
		width: 100%;
		position: absolute;
		background-color: transparent;
		z-index: 10;
		border: 1px solid black;
		justify-content: space-between;
		align-items: center;
		padding: 0px;
		pointer-events: all !important;
		mix-blend-mode: normal;
	}

	.mix_slider {
		width: 110%;
		-webkit-appearance: none;
		appearance: none;
		height: var(--space-s);
		outline: none;
		border-radius: var(--space-xs);
		border: 0px solid black;
		pointer-events: all;
		background-color: transparent;
		cursor: grab;
	}

	.mix_slider:active {
		cursor: grabbing;
	}

	.mix_slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: var(--space-m);
		height: 2000px;
		background: var(--primary-color);
		cursor: inherit;
		border-radius: var(--space-xs);
		border: 1px solid black;
	}

	.mix_slider::-moz-range-thumb {
		width: var(--space-m);
		height: 2000px;
		background: var(--primary-color);
		cursor: inherit;
		border-radius: var(--space-xs);
		border: 1px solid black;
	}

	.mix_slider::-webkit-slider-thumb:active {
		cursor: grabbing;
	}

	.mix_slider::-moz-range-thumb:active {
		cursor: grabbing;
	}

	.mix_slider::-webkit-slider-thumb:focus {
		transform: scale(1.2);
		transition: transform 3s ease-in-out;
	}

	.mix_slider::-moz-range-thumb:focus {
		transform: scale(1.2);
		transition: transform 0.2s ease-in-out;
	}

	.mix_slider::-webkit-slider-track {
		width: 100%;
		height: var(--space-2xs);
		border-radius: var(--space-3xs);
		border: 1px solid black;
	}

	.post_img {
		width: fit-content;
		height: fit-content;
		border-radius: 0px;
		pointer-events: none;
		position: relative;
		overflow: hidden;
		border: 0.5px solid black;
		aspect-ratio: 0.69;
		mix-blend-mode: normal;
	}

	@supports (mix-blend-mode: color-burn) {
		.post_img {
			mix-blend-mode: color-burn;
		}
	}

	.post_img > img {
		height: 100%;
		width: auto;
		object-fit: contain;
		object-position: top;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}

	.base_img {
		position: relative !important;
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

	.download_btn {
		position: absolute;
		bottom: 0;
		right: 0;
		z-index: 12;
		padding: var(--space-xs);
		background-color: var(--primary-color);
		border: 1px solid var(--primary-dark);
		pointer-events: all;
		border-radius: var(--space-xs) 0px 0px 0px;
	}

	.download_btn:hover {
		filter: brightness(0.9);
	}

	.download_btn svg {
		width: 25px;
		height: 21px;
		fill: var(--primary-dark);
	}

	@media (max-width: 768px) {
		.mix_value {
			width: fit-content;
		}
	}
</style>
