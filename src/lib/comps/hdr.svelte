<script>
    let props = $props();
    import Button from '$lib/comps/btn.svelte';
    import logo from '$lib/assets/favicon.svg';
</script>

<header class="horizontal_flex">
    <Button label="FR" />
    <Button label="EN" />
    <Button label="ABOUT" href="/about" />
    <Button img={logo} />
</header>

<style>

    header {
        position: fixed;
        right: 20px;
        top: 20px;
        column-gap: 5px;
        z-index: 4;
    }

    :global(.generic_btn) {
        height: 35px !important;
        padding: 5px 10px  !important;
    }

</style>