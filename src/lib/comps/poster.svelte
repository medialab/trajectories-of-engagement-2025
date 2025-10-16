<script>
let props = $props();

import testImg from '$lib/assets/posters/coeso.png';
</script>

<div class="post_cont vertical_flex">
    <div class="header"></div>
    <div class="post_img">
        <img src="{testImg}" alt="">
    </div>
</div>

<style>
    .post_cont {
        height: 773px;
        width: 538px;
        background-color: var(--primary-light);
        row-gap: 0px;
        z-index: 1;
        mix-blend-mode: normal;
        pointer-events: none;
    }

    .header {
        height: 40px;
        background-color: var(--primary-color);
    }

    .post_img {
        height: 100%;
        width: 100%;
    }

    .post_img > img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    @media (max-width: 768px) {
        .post_cont {
            width: 100% !important;
            height: auto !important;
            position: static !important;
        }
    }

</style>