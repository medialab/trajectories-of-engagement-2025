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
	let isDownloading = $state(false);
	let downloadError = $state('');

	const DOWNLOAD_TIMEOUT_MS = 8000;
	const RETRY_DELAY_MS = 300;
	const MAX_DOWNLOAD_ATTEMPTS = 2;

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

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	async function fetchWithTimeout(url: string, timeoutMs: number) {
		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

		try {
			return await fetch(url, { signal: controller.signal });
		} finally {
			clearTimeout(timeout);
		}
	}

	async function fetchPosterBlob(url: string): Promise<Blob> {
		let lastError: unknown = null;

		for (let attempt = 1; attempt <= MAX_DOWNLOAD_ATTEMPTS; attempt++) {
			try {
				const response = await fetchWithTimeout(url, DOWNLOAD_TIMEOUT_MS);
				if (!response.ok) {
					throw new Error(`Poster download failed with status ${response.status}`);
				}
				return await response.blob();
			} catch (error) {
				lastError = error;
				if (attempt < MAX_DOWNLOAD_ATTEMPTS) {
					await wait(RETRY_DELAY_MS);
				}
			}
		}

		throw lastError instanceof Error ? lastError : new Error('Poster download failed');
	}

	async function downloadPoster(annotatedURl: string, originalURl: string, title: string) {
		const safeTitle = typeof title === 'string' ? title.trim() : '';
		if (!safeTitle || isDownloading) return;
		let sourceURl: string;
		downloadError = '';
		isDownloading = true;

		if (mixValue < 50) {
			sourceURl = originalURl;
		} else {
			sourceURl = annotatedURl;
		}

		try {
			const blob = await fetchPosterBlob(sourceURl);
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${safeTitle}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			downloadError = 'Download failed. Please try again.';
			console.error('Poster download failed:', error);
		} finally {
			isDownloading = false;
		}
	}

	onMount(() => {
		setTimeout(() => {
			slideAnimation();
		}, 200);
	});

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
	<div
		class="max-w-full h-auto rounded-none pointer-events-none relative overflow-hidden outline aspect-[0.69] w-full md:w-[80%]"
	>
		<p
			class="mix_value cursor-grab text-base! absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-[1px_5px] bg-primary outline outline-1 outline-black origin-center"
			style="left: {Math.max(12, Math.min(88, Math.round(mixValue)))}%; white-space: nowrap"
		>
			← Grab me →
		</p>
		<div
			class="slid_cont flex flex-row gap-[-2.5] absolute h-full w-full z-10 outline outline-1 outline-black justify-between items-center p-0 pointer-events-all mix-normal"
		>
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
			class="h-full w-full object-cover object-top absolute top-0 left-0 z-2"
			src={props.originalPoster}
			alt={safeId}
			style="opacity: {1 - mixOpacity};"
		/>
		<img
			class="h-full w-full object-cover object-top absolute top-0 left-0 z-2"
			src={props.annotatedPoster}
			alt={safeId ? `${safeId}_annotated` : ''}
			style="opacity: {mixOpacity};"
		/>
		<button
			class="download_btn absolute bottom-0 right-0 z-12 p-[5px] bg-primary outline outline-1 outline-primary-dark pointer-events-all rounded-tl-[5px]"
			onclick={() => downloadPoster(props.annotatedPoster, props.originalPoster, safeId)}
			aria-label="Download poster"
			aria-busy={isDownloading}
			disabled={isDownloading}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
				><path
					d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
				/></svg
			>
		</button>
		{#if downloadError}
			<p
				class="download_error absolute left-[5px] bottom-[5px] z-13 p-[2px_5px] bg-primary-light outline outline-primary-dark"
			>
				{downloadError}
			</p>
		{/if}
		<div class="bg_back absolute inset-0 bg-primary-dark z-0"></div>
	</div>
{/if}

<style>
	.mix_slider {
		width: 110%;
		-webkit-appearance: none;
		appearance: none;
		border-radius: 5px;
		outline: 0px solid black;
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
		width: 10px;
		height: 2000px;
		background: var(--color-primary);
		cursor: inherit;
		border-radius: 5px;
		outline: 1px solid black;
	}

	.mix_slider::-moz-range-thumb {
		width: 10px;
		height: 2000px;
		background: var(--color-primary);
		cursor: inherit;
		border-radius: 5px;
		outline: 1px solid black;
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
		height: 4px;
		border-radius: 2px;
		outline: 1px solid black;
	}

	.download_btn:hover {
		filter: brightness(0.9);
	}

	.download_btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.download_btn svg {
		width: 25px;
		height: 21px;
		fill: var(--color-primary-dark);
	}

	.download_error {
		position: absolute;
		left: 5px;
		bottom: 5px;
		z-index: 13;
		padding: 2px 5px;
		background-color: var(--color-primary-light);
		outline: 1px solid var(--color-primary-dark);
	}

	@media (max-width: 768px) {
		.mix_value {
			width: fit-content;
		}
	}
</style>
