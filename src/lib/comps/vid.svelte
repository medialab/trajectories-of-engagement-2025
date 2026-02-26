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
	<div
		class="vid_empty w-full outline outline-2 outline-primary-dark bg-primary-light p-[-4] text-center"
	>
		<p>No video available</p>
	</div>
{:else if isYouTube && youtubeId}
	<div
		class="vid_cont flex flex-col gap-[-2.5] relative w-full aspect-video bg-primary-light z-1 outline outline-2 outline-primary-dark"
	>
		{#if hasSegments && isPlaying === true}
			<button
				class="next_vid flex flex-row gap-[-2.5] absolute w-fit h-fit bg-primary outline outline-2 outline-primary-dark cursor-pointer p-[-1_-2.5] rounded-none z-2 mix-normal"
				onclick={() => goToNextSegment()}
				transition:slide={{ duration: 1000, easing: cubicOut, axis: 'y' }}
			>
				<p>NEXT SEGMENT →</p>
			</button>
			<button
				class="prev_vid flex flex-row gap-[-2.5] absolute w-fit h-fit bg-primary outline outline-2 outline-primary-dark cursor-pointer p-[-1_-2.5] rounded-none z-2 mix-normal"
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
			--title-color="var(--color-primary)"
			--title-text-transform="uppercase"
			--title-letter-spacing="-0.05em"
		>
			{#snippet play_button()}
				<div
					class="play_pause flex flex-row gap-[-2.5] generic_btn bg-[#c5c5c5] px-4 py-2 place-self-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<p>PLAY</p>
				</div>
			{/snippet}
		</Youtube>
	</div>
{:else}
	<div
		class="vid_empty w-full outline outline-2 outline-primary-dark bg-primary-light p-[-4] text-center"
	>
		<p>No video available</p>
	</div>
{/if}

<style>
	@media (max-width: 768px) {
		.vid_cont {
			width: 100% !important;
			height: auto !important;
			position: relative !important;
		}
	}
</style>
