<script>
    let props = $props();

    import Button from '$lib/comps/btn.svelte';
    import BurgerIcon from '$lib/assets/icons/burger.svg';
    import logo from '$lib/assets/favicon.svg';

    import { isMobile } from '$lib/utils';
    import { onMount } from 'svelte';
    import { menuOpen } from '$lib/utils';
    
    let isMobileFlag = $state(false);

    onMount(() => {
        isMobileFlag = isMobile();
        console.log(isMobileFlag);
    });
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
    <div class="burger_menu vertical_flex">
        <Button label="ABOUT" href="/about" />
        <Button label="ARCHIVE" href="/about" />
        <Button label="HOME" href="/about" />
    </div>
{/if}

<style>

    header {
        position: fixed;
        right: 20px;
        top: 20px;
        column-gap: 5px;
        z-index: 40;
    }

    :global(.generic_btn) {
        height: 35px !important;
        padding: 5px 10px  !important;
    }

    .burger_menu {
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
        }

        :global(header > button) {
           border: 0px !important;
           background-color: unset !important;
           font-weight: 700 !important;
        }

        .burger_menu {
            position: fixed;
            top: 0;
            margin-top: 50px;
            display: flex;
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: var(--primary-light);
            z-index: 5;
        }
    }

</style>