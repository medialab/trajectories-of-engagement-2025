<script>
    import { goto } from "$app/navigation";
    let props = $props();
</script>

<a
data-sveltekit-reload
class="generic_btn" onclick={() => goto(props?.href)} style={props?.img ? 'background-color: white' : ''}>
    {#if props?.label}
        <p class="m">
            {props.label}
        </p>
    {/if}
    {#if props?.img}
        <img src="{props?.img}" alt="{props?.imgAlt}" />
    {/if}
</a>

<style>
    .generic_btn {
        display: flex;
        width: fit-content;
        height: fit-content;
        min-height: 30px;
        padding: 10px 20px;
        border-radius: 5px;
        background-color: var(--primary-color);
        color: var(--primary-dark);
        cursor: pointer;
        border: 2px solid var(--primary-dark);
        font-weight: 500;
    }

    .generic_btn:hover {
        background-color: var(--primary-color);
        filter: invert(0.1);
    }

    .generic_btn:active {
        background-color: var(--primary-dark);
        color: var(--primary-color);
    }

    img {
        height: 20px;
    }
    

</style>