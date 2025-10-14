    import { writable } from "svelte/store";

    export let currentTag = writable(undefined);
    export let currentAuthor = writable('');
    export let currentResearchCenter = writable('');