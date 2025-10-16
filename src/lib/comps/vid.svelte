<script lang="ts">
    import Youtube from "svelte-youtube-embed";

    let props = $props();

    let videoUrl = props.src || 'https://youtu.be/YtZkeY22YYM?si=gb_z72JozL30jxy_';
    let isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

    let youtubeId = $derived((videoUrl: string) => {
        if (videoUrl.includes('youtu.be/')) {
            // Handle youtu.be/VIDEO_ID format
            return videoUrl.split('youtu.be/')[1].split('?')[0];
        } else if (videoUrl.includes('youtube.com/watch?v=')) {
            // Handle youtube.com/watch?v=VIDEO_ID format
            return videoUrl.split('v=')[1].split('&')[0];
        }
        return '';
    });
</script>

<div class="vid_cont vertical_flex">
    <!--<button class="play_pause horizontal_flex" onclick={() => isPlaying = !isPlaying}>
        <p>PLAY</p>
        <p>/</p>
        <p>PAUSE</p>
    </button>-->
    <button class="next_vid horizontal_flex">
        <p>NEXT SEGMENT →</p>
    </button>
    
    {#if isYouTube}
            <Youtube id={youtubeId(videoUrl)} thumbnail={undefined} animations={false} --title-font-family='Inter' --title-font-size='14px' --title-font-weight='500' --title-color='var(--primary-color)' --title-text-transform='uppercase' --title-letter-spacing='-0.05em'>
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

<style>
    .vid_cont {
        height: 350px;
        position: relative;
        width: 555px;
      
        border: 2px solid var(--primary-dark);
        background-color: var(--primary-light);
        z-index: 2;
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
            position: static !important;
        }
    }
</style>