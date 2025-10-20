<script>

    import Button from '$lib/comps/btn.svelte';
    import BurgerIcon from '$lib/assets/icons/burger.svg';
    import logo from '$lib/assets/favicon.svg';

    import { isMobile } from '$lib/utils';
    import { onMount } from 'svelte';
    import { menuOpen } from '$lib/utils';
	import { backIn } from 'svelte/easing';
	import { slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
	import { beforeNavigate } from '$app/navigation';
    
    let isMobileFlag = $state(false);

    onMount(() => {
        isMobileFlag = isMobile();
        console.log(isMobileFlag);
    });

    beforeNavigate(() => {
        menuOpen.set(false)
    })
</script>

<header class="horizontal_flex">
    {#if isMobileFlag}
        <Button img={logo} href="/" />
        <Button label="TRAJECTORIES" href="/" />
        <Button img={BurgerIcon} href="burger_menu" />

    {:else}
        <Button label="FR" />
        <Button label="EN" />
        <Button label="ABOUT" href="/about" />
        <Button img={logo} href="/" />
    {/if}
</header>

{#if $menuOpen}
    <div class="burger_menu vertical_flex" transition:slide={{duration:550, axis: 'y', easing: cubicOut}}>
        <div class="horizontal_flex lang_switch" transition:slide={{duration:550, axis: 'y', easing: cubicOut, delay: 300}}>
            <Button label="FR"/>
            <Button label="/" />
            <Button label="EN" disabled={true}/>
        </div>
        <div class="vertical_flex clickables" transition:slide={{duration:550, axis: 'y', easing: cubicOut, delay: 300}}>
            <Button label="ABOUT" href="/about" />
            <Button label="ARCHIVE" href="/archive" />
            <Button label="HOME" href="/" />
        </div>
        
        <div class="lang_switch bottom_text" transition:slide={{duration:550, axis: 'y', easing: cubicOut, delay: 300}}>
            <p class="s">
                This project was brought to life by the combined efforts of medialab sciencespo and universite paris nanterre. all rights reserved to medialab sciencespo.
            </p>
        </div>
    </div>
{/if}

<style>

    header {
        position: fixed;
        left: 50%;
        right: 50%;
        top: 0px;
        column-gap: 5px;
        z-index: 40;
        place-self: center;
        max-width: 1600px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 20px;
        pointer-events: none;
    }

    :global(.generic_btn) {
        height: 35px !important;
        padding: 5px 10px  !important;
    }

    .burger_menu {
        display: none;
    }

    .lang_switch, .bottom_text {
        display: none;
    }

    @media (max-width: 768px) {
        header {
            width: 100%;
            max-width: 100vw;
            top: 0px;
            left: 0px;
            right: unset;
            justify-content: space-between;
            padding: 10px 20px;
            background-color: var(--primary-light);
            align-items: center;
            border-bottom: 1px solid var(--primary-dark);
            z-index: 45;
        }

        :global(header > button, .burger_menu > div > button, .burger_menu > div > button) {
           border: 0px !important;
           background-color: unset !important;
           font-weight: 700 !important;
        }

        :global(.burger_menu > div > button) {
            padding: 0px !important;
        }

        .burger_menu {
            position: fixed;
            top: 0;
            padding-top: 50px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: white;
            z-index: 43;
            row-gap: 20px;
            pointer-events: visible;
            scroll-behavior: disabled;
        }

        :global(.burger_menu > .clickables > button > p) {
            font-size: 48px;
            font-weight: 600;
        }

        .lang_switch {
            display: flex;
            position: absolute;
            top: 60px;
            column-gap: 5px;
        }

        .bottom_text {
            bottom: 0px;
            top: unset !important;
            padding-bottom: 20px;
        }
    }

    @media (min-width: 1780px) {
        header {
            padding: 20px 0px;
        }
    }

</style>