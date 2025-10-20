<script lang="ts">
    // @ts-ignore
    import {Youtube} from 'svelte-youtube-embed';
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
	import { onMount } from 'svelte';

    let props = $props();

    // Bindable playback state exposed to parents and wired to <Youtube>
    let play = $state(false);
    let isPlaying = $state(false);
    let currentTime = $state(0);
    let currentTimeIndex = $state(0);

    let videoUrl = props.src || 'https://youtu.be/YtZkeY22YYM?si=gb_z72JozL30jxy_';
    let isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    let timestamps: number[] = $state([]);

    $inspect(timestamps);

    let youtubeId = $derived(new Promise((resolve) => {
        if (videoUrl.includes('youtu.be/')) {
            // Handle youtu.be/VIDEO_ID format
            resolve(videoUrl.split('youtu.be/')[1].split('?')[0]);
        } else if (videoUrl.includes('youtube.com/watch?v=')) {
            // Handle youtube.com/watch?v=VIDEO_ID format
            resolve(videoUrl.split('v=')[1].split('&')[0]);
        } else {
            resolve('');
        }
    }));

    const calculateSegments = () => {
        props.excerpts.forEach((excerpt: any) => {
            excerpt.timecodes.forEach((timecode: string) => {
                const [minutes, seconds] = timecode.split(':').map(Number);
                timestamps.push(minutes * 60 + seconds);
            });
        });
    }

    const goToNextSegment = () => {
        currentTimeIndex = (currentTimeIndex + 1) % timestamps.length;
        currentTime = timestamps[currentTimeIndex];
        console.log("currentTime:", currentTime);
        console.log("currentTimeIndex:", currentTimeIndex);
        if (play === true) return;
        play = true;
    }

    onMount(() => {
        calculateSegments();
    })
</script>

{#await youtubeId}
    <p>loading...</p>
{:then videoId}
        <div class="vid_cont vertical_flex" transition:fade={{duration: 1000, easing: cubicOut, delay: 1000}}>
            <button class="next_vid horizontal_flex" onclick={() => goToNextSegment()}>
                <p>NEXT SEGMENT →</p>
            </button>
            
            {#if isYouTube}
                    <Youtube
                        id={videoId}
                        bind:play={play as boolean}
                        bind:isPlaying={isPlaying as boolean}
                        startAt={currentTime}
                        title={props.title}
                        --title-font-family='Inter'
                        --title-font-size='16px'
                        --title-font-weight='500'
                        --title-color='var(--primary-color)'
                        --title-text-transform='uppercase'
                        --title-letter-spacing='-0.05em'
                    >
                        {#snippet play_button()}
                            <button class="play_pause horizontal_flex">
                                <p>PLAY</p>
                            </button>
                        {/snippet}
                    </Youtube>
            {/if}
            <footer>
                <p>{props.title}</p>
            </footer>
        </div>
{/await}


<style>
    .vid_cont {
        height: 350px;
        position: relative;
        width: 555px;
      
        border: 2px solid var(--primary-dark);
        background-color: var(--primary-light);
        z-index: 1;
        row-gap: 0px;
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
        padding: 8px 12px;
        position: relative;
    }

    button {
        position: absolute;
        width: fit-content;
        height: fit-content;
        background-color: var(--primary-color);
        border: 2px solid var(--primary-dark);
        cursor: pointer;
        padding: 4px 10px;
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
        top: -2px;
        right: -2px;
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