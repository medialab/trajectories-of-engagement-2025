<script lang="ts">
	// @ts-ignore
	import { Youtube } from 'svelte-youtube-embed';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { timecodeToSeconds } from 'timecode-converter';

	let props = $props();

	const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');

	// Bindable playback state exposed to parents and wired to <Youtube>
	let play: boolean = $state(false);
	let isPlaying: boolean = $state(false);
	let currentTime: number = $state(0);
	let currentTimeIndex: number = $state(0);

	let videoUrl = $derived.by(() => toStringValue(props.src));
	let isYouTube = $derived.by(
		() => videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
	);
	let hasVideo = $derived.by(() => videoUrl.length > 0);
	let timestamps: number[] = $state([]);

	let youtubeId: Promise<string> = $state(
		new Promise((resolve) => {
			if (!isYouTube || !videoUrl) {
				resolve('');
				return;
			}

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
		timestamps = [];
		if (!Array.isArray(props.excerpts)) return;
		props.excerpts.forEach((excerpt: any) => {
			if (excerpt.timecodes && excerpt.timecodes.length > 0) {
				const startTime = timecodeToSeconds(excerpt.timecodes[0], 25);

				timestamps.push(startTime);
			}
		});
		if (timestamps.length > 0) {
			currentTime = timestamps[0];
		}
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

{#if !hasVideo}
	<div class="vid_empty">
		<p class="s">No video available</p>
	</div>
{:else}
	{#await youtubeId}
		<p>loading...</p>
	{:then videoId}
		{#if isYouTube && videoId}
			<div class="vid_cont vertical_flex">
				{#if Array.isArray(props.excerpts) && isPlaying === true}
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

				<!--{#if props.title}
					<footer>
						<p>{props.title.slice(0, 20)}</p>
					</footer>
				{/if}-->
			</div>
		{:else}
			<div class="vid_empty">
				<p class="s">No video available</p>
			</div>
		{/if}
	{/await}
{/if}

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

	.vid_empty {
		width: 100%;
		border: 2px solid var(--primary-dark);
		background-color: var(--primary-light);
		padding: var(--space-l);
		text-align: center;
	}

	:global(.you__tube) {
		height: fit-content;
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
