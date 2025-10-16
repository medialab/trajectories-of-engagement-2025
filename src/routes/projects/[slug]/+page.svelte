<script lang="ts">
    import type { PageProps } from './$types';
    import Header from '$lib/comps/hdr.svelte';
    import Button from '$lib/comps/btn.svelte';
    import Accordion from '$lib/comps/accordion.svelte';
    import BezierCanvas from '$lib/comps/cnvs.svelte';
    import Vid from '$lib/comps/vid.svelte';
    import Poster from '$lib/comps/poster.svelte';
    
    let { data }: PageProps = $props();

</script>

<Header />

<div class="return_btn">
    <Button label="← GO BACK" href="back" />
</div>

<div class="project_page_container">
    <div class="vertical_flex" style="row-gap: 30px;">
        <div class="vertical_flex">
            <h1 id="pr_title">{data.project.metadata.title}</h1>
            <p>{data.project.metadata?.year} | {data.project.metadata?.project_leaders} | {data.project.metadata?.research_center}</p>  
        </div>
        <div class="vertical_flex">
            <Accordion text={data.project.texts?.presentation} title="Presentation" />
            <Accordion text={data.project.texts?.experience} title="Experience" />
            <Accordion text={data.project.texts?.concept} title="Concept" />
        </div>
    </div>

    <div class="media_cont">
        <Vid title={data.project.metadata.title} excerpts={data.project.excerpts} />
        <Poster title={data.project.metadata.title} />
    </div>
</div>

<BezierCanvas />


<style>

    .return_btn {
        position: fixed;
        top: 20px;
        left: 20px;
    }

    .project_page_container {
        width: auto;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        grid-column-gap: 10px;
        margin: 80px 20px;
        overflow: hidden;
        background-color: transparent;
    }

    .project_page_container > :first-child {
        grid-column: 1 / 9;
        width: 100%;
        height: fit-content;
        overflow: scroll;
    }

    .project_page_container > :first-child > * {
        background-color: var(--primary-light);
    }

    .project_page_container > :nth-child(2) {
        grid-column: 13 / 21;
        width: 657px;
        height: 874px;
        position: relative;
    }

    .media_cont {
        background-color: var(--primary-light);
    }

    :global(.media_cont > :nth-child(1)) {
        position: absolute;
        bottom: 0;
        left: 0;
    }
    
    :global(.media_cont > :nth-child(2)) {
        position: absolute;
        top: 0;
        right: 0;
    }

    @media (max-width: 768px) {
        .project_page_container {
            width: 100%;
            height: fit-content;
            display: flex;
            flex-direction: column;
            margin: 80px 0px;
            padding: 0px 20px;
            row-gap: 20px;
            overflow: scroll;
            background-color: transparent;
        }

        .media_cont {
            width: 100% !important;
            height: fit-content;
            display: flex;
            flex-direction: column;
            row-gap: 20px;
            position: static;
        }
    }
</style>