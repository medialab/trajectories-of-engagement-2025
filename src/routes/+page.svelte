<script lang="ts">
    import Button from '$lib/comps/btn.svelte';
    import Header from '$lib/comps/hdr.svelte';
    import Info from '$lib/comps/info.svelte';
    import Carousel from '$lib/comps/carousel.svelte';
    import { Canvas } from '@threlte/core';
    import { NoToneMapping } from 'three';

    let containerEl: HTMLElement;

</script>

<Header />

<div class="hero_container vertical_flex">
    <div class="vertical_flex">
        <h1>
            Trajectories
    of engagement
        </h1>
        <p>Trajectories of engagement are the paths through which researchers and external actors meet, collaborate, and co-create knowledge—across physical and digital settings—to address public issues</p>
    </div>
    <Button label="Access the archive ↓" href="#archive" />
</div>

<div class="tag_container align_right vertical_flex ">
    <Info label="Tag: #COESO" />
    <Info label="Aut: Mirella Campioli" />
    <Info label="Ind: EHESS / OpenEdition" />
</div>

<div class="carousel_container" >
    <div>
        <Canvas toneMapping={NoToneMapping}>
            <Carousel containerEl={containerEl}/>
        </Canvas>
    </div>
</div>

<div class="fake_scroller" bind:this={containerEl} data-scroll-container>
</div>




<style>
    .fake_scroller {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100000vh;
        overflow: hidden;
        place-items: center;
        z-index: 2;
        pointer-events: none;
    }

 h1 {
    text-transform: uppercase;
 }

 .hero_container {
    left: 20px;
    top: 20px;
    width: 60ch;
    row-gap: 20px;
    position: fixed;
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
        place-items: center;
        z-index: 1;
    }

    .carousel_container div {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>