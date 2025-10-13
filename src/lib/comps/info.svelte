<script>
    let props = $props();
</script>

<div class="info_container horizontal_flex">
    <p class="s">{props.label}</p>
</div>

<style>
    .info_container {
        background-color: #ffffff;
        padding: 5px 10px;
        border-radius: 5px;
        width: fit-content;
        height: fit-content;
    }
</style>