<script lang="ts">
	// @ts-ignore
	import { Youtube } from 'svelte-youtube-embed';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { timecodeToSeconds } from 'timecode-converter';

	let props = $props();

	// Bindable playback state exposed to parents and wired to <Youtube>
	let play: boolean = $state(false);
	let isPlaying: boolean = $state(false);
	let currentTime: number = $state(0);
	let currentTimeIndex: number = $state(0);

	let videoUrl: string = props.src;
	let isYouTube: boolean = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
	let timestamps: number[] = $state([]);

	let youtubeId: Promise<string> = $derived(
		new Promise((resolve) => {
			if (videoUrl.includes('youtu.be/')) {
				// Handle youtu.be/VIDEO_ID format
				const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];

				resolve(videoId);
			} else if (videoUrl.includes('youtube.com/watch?v=')) {
				// Handle youtube.com/watch?v=VIDEO_ID format
				const videoId = videoUrl.split('v=')[1].split('&')[0];

				resolve(videoId);
			} else {
				resolve('');
			}
		})
	);

	const calculateSegments = () => {
		if (!props.excerpts) return;
		props.excerpts.forEach((excerpt: any) => {
			if (excerpt.timecodes && excerpt.timecodes.length > 0) {
				const startTime = timecodeToSeconds(excerpt.timecodes[0], 25);

				timestamps.push(startTime);
			}
		});
		currentTime = timestamps[0];
	};

	const goToNextSegment = () => {
		if (timestamps.length === 0) return;
		currentTimeIndex = (currentTimeIndex + 1) % timestamps.length;
		currentTime = timestamps[currentTimeIndex];
		play = true;
	};

	const goToPreviousSegment = () => {
		if (timestamps.length === 0) return;
		currentTimeIndex = (currentTimeIndex - 1 + timestamps.length) % timestamps.length;
		currentTime = timestamps[currentTimeIndex];
		play = true;
	};

	onMount(() => {
		calculateSegments();
	});
</script>

{#await youtubeId}
	<p>loading...</p>
{:then videoId}
	{#if typeof videoId === 'string'}
		<div class="vid_cont vertical_flex">
			{#if props.excerpts && isPlaying === true}
				<button
					class="next_vid horizontal_flex"
					onclick={() => goToNextSegment()}
					transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y' }}
				>
					<p class="s">NEXT SEGMENT →</p>
				</button>
				<button
					class="prev_vid horizontal_flex"
					onclick={() => goToPreviousSegment()}
					transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y' }}
				>
					<p class="s">PREVIOUS SEGMENT ←</p>
				</button>
			{/if}

			{#if isYouTube}
				<Youtube
					id={videoId as string}
					bind:play={play as boolean}
					bind:isPlaying={isPlaying as boolean}
					startAt={currentTime}
					title={props.title}
					thumbnail=""
					--title-font-family="Inter"
					--title-font-size="16px"
					--title-font-weight="500"
					--title-color="var(--primary-color)"
					--title-text-transform="uppercase"
					--title-letter-spacing="-0.05em"
				>
					{#snippet play_button()}
						<button class="play_pause horizontal_flex">
							<p>PLAY</p>
						</button>
					{/snippet}
				</Youtube>
			{/if}

			<!--{#if props.title}
				<footer>
					<p>{props.title.slice(0, 20)}</p>
				</footer>
			{/if}-->
		</div>
	{/if}
{/await}

<style>
	.vid_cont {
		height: fit-content;
		position: relative;
		width: 100%;
		border: 2px solid var(--primary-dark);
		background-color: var(--primary-light);
		z-index: 1;
		row-gap: 0px;
		aspect-ratio: 16/9;
	}

	:global(.you__tube) {
		height: fit-content;
	}

	footer {
		background-color: var(--primary-color);
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		padding: var(--space-s) var(--space-ml);
		position: relative;
	}

	button {
		position: absolute;
		width: fit-content;
		height: fit-content;
		background-color: var(--primary-color);
		border: 2px solid var(--primary-dark);
		cursor: pointer;
		padding: var(--space-2xs) var(--space-m);
		border-radius: 0px;
		z-index: 2;
		mix-blend-mode: normal;
	}

	.play_pause {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.next_vid {
		top: calc(-1 * var(--space-3xs));
		right: calc(-1 * var(--space-3xs));
	}

	.prev_vid {
		top: calc(-1 * var(--space-3xs));
		left: calc(-1 * var(--space-3xs));
	}

	p {
		text-transform: uppercase;
		margin: 0;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.vid_cont {
			width: 100% !important;
			height: auto !important;
			position: relative !important;
		}
	}
</style>
