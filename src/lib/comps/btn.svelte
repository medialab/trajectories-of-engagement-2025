<script lang="ts">
    import { goto } from "$app/navigation";
    let props = $props();

    const intDecide = (o: any) => {
        if (o === "back") {
            history.back();
        } else if (o || o.trim() !== '' || o !== '#' || o.trim() !== null || o.trim() !== undefined) {
            goto(o);
        } else {
            return;
        }
    }
</script>

<button
    type="button"
    data-sveltekit-reload
    class="generic_btn" onclick={() => intDecide(props?.href)} style={props?.img ? 'background-color: white' : ''}
    onkeydown={(e) => e.key === 'Enter' && intDecide(props?.href)}
    >
        {#if props?.label}
            <p class="m">
                {props.label}
            </p>
        {/if}
        {#if props?.img}
            <img src="{props?.img}" alt="{props?.imgAlt}" />
        {/if}
</button>

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