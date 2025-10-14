<script lang="ts">
    import type { PageProps } from './$types';
    import Header from '$lib/comps/hdr.svelte';
    import Button from '$lib/comps/btn.svelte';
    
    let { data }: PageProps = $props();

</script>

<Header />


<div class="return_btn">
    <Button label="RETURN TO ARCHIVE" href="/archive" />
</div>

<div class="project_page_container">

</div>


<style>

    .return_btn {
        position: fixed;
        top: 20px;
        left: 20px;
    }

    .project_page_container {
        width: 100%;
        height: 100%;
    }

</style>