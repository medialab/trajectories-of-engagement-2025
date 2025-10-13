<script>
    import { goto } from "$app/navigation";
    let props = $props();
</script>

<button class="generic_btn" onclick={() => goto(props?.href)} style={props?.img ? 'background-color: white' : ''}>
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
        width: fit-content;
        height: fit-content;
        min-height: 30px;
        padding: 10px 20px;
        border-radius: 5px;
        background-color: #CEFFBF;
        color: #111111;
        cursor: pointer;
        border: 1.5px solid black;
        font-weight: 700;
    }

    .generic_btn:hover {
        background-color: #7ddb60;
    }

    .generic_btn:active {
        background-color: #111111;
        color: #CEFFBF;
    }

    img {
        height: 20px;
    }
    

</style>