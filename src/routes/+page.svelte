<script lang="ts">
    import type { PageProps } from './$types';
    import Button from '$lib/comps/btn.svelte';
    import Header from '$lib/comps/hdr.svelte';
    import BezierCanvas from '$lib/comps/cnvs.svelte';
    import { currentTag, currentAuthor, currentResearchCenter } from '$lib/utils';
    import { slide } from 'svelte/transition';
    import {cubicOut} from 'svelte/easing';

    import Info from '$lib/comps/info.svelte';
    import Carousel from '$lib/comps/carousel.svelte';
    import { Canvas } from '@threlte/core';
    import { NoToneMapping } from 'three';
    import { isMobile } from '$lib/utils';
    import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

    let containerEl: HTMLElement | undefined = $state(undefined);
    let bezRef: any;

    let { data }: PageProps = $props();

    let isMobileFlag = $derived.by(() => isMobile());
</script>


<Header />



<div class="hero_container vertical_flex">
    <div class="vertical_flex">
        <h1>
            Trajectories of engagement
        </h1>
        <p class="l">Trajectories of engagement are the paths through which researchers and external actors meet, collaborate, and co-create knowledge—across physical and digital settings—to address public issues</p>
    </div>

    <Button label="Access the archive ↓" href="/archive" />
</div>
{#if $currentTag}
    <div class="tag_container align_right vertical_flex ">
        <Info label="Leader: {$currentAuthor ?? 'hover something'}" />
        <Info label="Research center: {$currentResearchCenter ?? 'hover something'}" />
        <Info label="Title: #{$currentTag ?? 'hover something'}" />
    </div>
{/if}


<div class="carousel_container" bind:this={containerEl}  >
    <div>
        <Canvas toneMapping={NoToneMapping}>
            <Carousel containerEl={containerEl} onHoverPoster={() => bezRef?.triggerRegeneration?.()} projects={data.projects}/>
        </Canvas>
    </div>
</div>

<BezierCanvas bind:this={bezRef} />

<style>


    h1 {
        text-transform: uppercase;
        background-color: var(--primary-light);
    }

    p {
        background-color: var(--primary-light);
    }

 .hero_container {
    left: 20px;
    top: 20px;
    width: 60ch;
    row-gap: 20px;
    position: fixed;
    z-index: 5;
 }

 .tag_container {
    position: fixed;
    right: 20px;
    bottom: 20px;
 }

 .carousel_container {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        place-items: start;
        z-index: 1;
        pointer-events: all;
        touch-action: none;
        overscroll-behavior: contain;
    }

    .carousel_container div {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    @media (max-width: 768px) {
        .hero_container {
            top: 80px;
            width: 90%;
        }

        .carousel_container {
            margin-top: 220px;
            overflow: hidden !important;
        }

        .carousel_container > * {
            position: relative !important;
        }
    }
</style>