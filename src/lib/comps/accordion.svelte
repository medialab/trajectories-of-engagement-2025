<script lang="ts">
    import Button from '$lib/comps/btn.svelte';
    import { cubicOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    
    let { text, title }: { text: string; title: string } = $props();
    let isOpen = $state(false);
</script>

<div class="vertical_flex">
    <div 
        class="accordion_header" 
        role="button" 
        tabindex="0"
        onclick={() => isOpen = !isOpen}
        onkeydown={(e) => e.key === 'Enter' && (isOpen = !isOpen)}
    >
        <Button label="{title} {isOpen ? '↑' : '↓'}" href="" />
    </div>
    {#if isOpen}
        <p transition:slide={{duration: 650, easing: cubicOut, axis: 'y'}}>{text}</p>
    {/if}
</div>

<style>
    .accordion_header, .accordion_header > :global(button) {
        width: 100%;
    }
    
    .vertical_flex {
        display: flex;
        flex-direction: column;
    }
    
    p {
        margin-bottom: 20px;
        background-color: var(--primary-light);
    }

    @media (max-width: 768px) {
        .accordion_header, .accordion_header > :global(button) {
            width: 100%;
        }
    }
</style>

