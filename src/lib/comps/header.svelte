<script lang="ts">
	import Button from '$lib/comps/btn.svelte';
	import infoIcon from '$lib/assets/icons/info.svg';
</script>

<header class="flex flex-row fixed top-0 w-full justify-between px-4 mt-4 z-20">
	<div class="flex flex-row gap-2">
		<Button label="← GO BACK" href="back" />
	</div>
	<div class="flex flex-row gap-2">
		<Button href="/about" img={infoIcon} />
		<Button label="HOME" href="/" />
	</div>
</header>
