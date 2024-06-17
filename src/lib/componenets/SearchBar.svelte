<script lang="ts" generics="T">
    import MagnifyIcon from 'svelte-material-icons/Magnify.svelte';
    import Fuse from 'fuse.js';   
    
    export let data: T[];
    export let results: T[] = data;
    export let keys: string[];
    let search = '';
    
    export function resetSearch() {
        results = data;
        search = '';
    }
    
    const fuse = new Fuse(data, {
        keys: keys,
        includeScore: false, // Include score to rank results
        threshold: 0.4, // Adjust as needed, controls the fuzzy matching threshold
    });

    
    results = data;
    function handleSearch() {
        if (fuse && search.trim() !== '') {
            results = fuse.search(search.trim()).map(result => result.item);
        } else {
            results = data;
        }
    }

    function handleFocus(event: any) {
        event.target.select();
    }
</script>

<div class="search-bar">
    <MagnifyIcon size="2rem" />
    <input 
        bind:value={search} 
        on:input={handleSearch}
        on:focus={handleFocus} 
        type="search" 
        placeholder="Search..." 
    />
</div>

<style lang="scss">
    @use "$lib/styles/inputs" as inputs;
    
    .search-bar {
        @include inputs.search-bar($height: 3.5rem);
    }

</style>
