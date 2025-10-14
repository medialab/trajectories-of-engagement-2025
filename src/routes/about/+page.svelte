<script lang="ts">

    import Header from '$lib/comps/hdr.svelte';
    import Button from '$lib/comps/btn.svelte';
    import logoIcon from '$lib/assets/favicon.svg';
    import BezierCanvas from '$lib/comps/cnvs.svelte';

    let AboutText: string = $state('Trajectories of engagement refer to moments in the research process where external actors are involved and co-construct knowledge with the research team. These research paths involving an outside can take various forms of material production based on physical and/or digital environments. Often used in digital data-grounded labs or citizen science projects, trajectories of engagement are shaped in research which aims to address social concerns or public issues. <br><br> This research project aims to explore and describe the different forms that trajectories of engagement can take in the humanities and social sciences, the interactions between internal and external actors that they can generate, and the materiality of the socio-technical choices involved. <br><br> The expected outputs are to build an observatory and a network of researchers interested in studying these trajectories and a book will be written to present the identified trajectories.');

</script>

<Header />


<div class="about_container vertical_flex">
    <img src="{logoIcon}" alt="medialab's logo">
    <p class="l">{@html AboutText}</p>
    <Button label="Get in touch with us" href="mailto:trajectoriesofengagement@sciencespo.fr" />
</div>

<BezierCanvas/>
<BezierCanvas/>

<style>

.about_container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 95ch;
    row-gap: 20px;
    background-color: var(--primary-light);
    padding: 20px;
    white-space: pre-line;
    align-items: center;
    z-index: 10;
}

img {
    width: 30px;
    height: 30px;
}


</style>