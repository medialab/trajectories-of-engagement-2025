<script lang="ts">
	import { Youtube } from 'svelte-youtube-embed';
	import type { ProjectExcerpt } from '$lib/datasource';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { timecodeToSeconds } from 'timecode-converter';

	type VidProps = {
		src?: string;
		excerpts?: ProjectExcerpt[];
		title?: string;
	};

	const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');
	const toYoutubeId = (url: string): string => {
		if (!url) return '';
		if (url.includes('youtu.be/')) {
			return url.split('youtu.be/')[1]?.split('?')[0] ?? '';
		}
		if (url.includes('youtube.com/watch?v=')) {
			return url.split('v=')[1]?.split('&')[0] ?? '';
		}
		return '';
	};
	const getExcerptStart = (excerpt: ProjectExcerpt): number | null => {
		const timecode = excerpt.timecodes?.[0];
		if (!timecode) return null;
		const seconds = timecodeToSeconds(timecode, 25);
		return Number.isFinite(seconds) ? seconds : null;
	};

	let { src = '', excerpts = [], title = '' }: VidProps = $props();

	let play: boolean = $state(false);
	let isPlaying: boolean = $state(false);
	let currentTime: number = $state(0);
	let currentTimeIndex: number = $state(0);

	let videoUrl = $derived.by(() => toStringValue(src));
	let isYouTube = $derived.by(
		() => videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
	);
	let hasVideo = $derived.by(() => videoUrl.length > 0);
	let youtubeId = $derived.by(() => (isYouTube ? toYoutubeId(videoUrl) : ''));
	let timestamps = $derived.by(() => {
		const parsedTimestamps: number[] = [];
		for (const excerpt of excerpts) {
			const start = getExcerptStart(excerpt);
			if (start !== null) {
				parsedTimestamps.push(start);
			}
		}
		return parsedTimestamps;
	});
	let hasSegments = $derived.by(() => timestamps.length > 0);

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

	$effect(() => {
		currentTimeIndex = 0;
		currentTime = timestamps[0] ?? 0;
		play = false;
	});
</script>

{#if !hasVideo}
	<div class="vid_empty">
		<p>No video available</p>
	</div>
{:else if isYouTube && youtubeId}
	<div class="vid_cont vertical_flex">
		{#if hasSegments && isPlaying === true}
			<button
				class="next_vid horizontal_flex"
				onclick={() => goToNextSegment()}
				transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y' }}
			>
				<p>NEXT SEGMENT →</p>
			</button>
			<button
				class="prev_vid horizontal_flex"
				onclick={() => goToPreviousSegment()}
				transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y' }}
			>
				<p>PREVIOUS SEGMENT ←</p>
			</button>
		{/if}

		<Youtube
			id={youtubeId}
			bind:play
			bind:isPlaying
			startAt={currentTime}
			{title}
			thumbnail=""
			--title-font-family="Inter"
			--title-font-size="16px"
			--title-font-weight="500"
			--title-color="var(--primary-color)"
			--title-text-transform="uppercase"
			--title-letter-spacing="-0.05em"
		>
			{#snippet play_button()}
				<div class="play_pause horizontal_flex generic_btn">
					<p>PLAY</p>
				</div>
			{/snippet}
		</Youtube>
	</div>
{:else}
	<div class="vid_empty">
		<p>No video available</p>
	</div>
{/if}

<style>
	.vid_cont {
		height: fit-content;
		position: relative;
		width: 100%;
		outline: 2px solid var(--primary-dark);
		background-color: var(--primary-light);
		z-index: 1;
		row-gap: 0px;
		aspect-ratio: 16/9;
	}

	.vid_empty {
		width: 100%;
		outline: 2px solid var(--primary-dark);
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
		outline: 2px solid var(--primary-dark);
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
