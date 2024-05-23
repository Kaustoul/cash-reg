<script lang="ts">
    import SortedList from "$lib/componenets/interactables/SortedList.svelte";
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Delete.svelte';
    import MagnifyIcon from 'svelte-material-icons/Magnify.svelte';

    import type { DataRows, Schema } from '$lib/componenets/interactables/SortedList.svelte';

    export let data: DataRows;
    export let schema: Schema;
    export let clickableRows: boolean = false;
    export let onRowClick: (productId: number) => void = () => {};
    export let idFieldName: string = "id";
    export let showSearchBar: boolean = false;
    let search = '';
    
    function handleFocus(event: any) {
        event.target.select();
    }
</script>

<div class="action-bar">
    {#if showSearchBar}
        <div class="search-bar">
            <MagnifyIcon size="2rem" />
            <input bind:value={search} on:focus={handleFocus} type="search" placeholder="Search..." />
        </div>
    {/if}
    <div class="btn red disabled">
        <DeleteIcon size="1.7rem" />
        Smazat
    </div>
    <div class="btn green disabled">
        <PlusIcon size="2.2rem" />
        Nový
    </div>
</div>
<SortedList {data} {schema} {clickableRows} {onRowClick} {idFieldName}/>

<style lang="scss">
    @import '../styles.scss';
    .action-bar {
        display: flex; 
        justify-content: space-between;

        gap: .7rem;
        width: 100%;
        margin-bottom: 1rem;
    }

    $search-bar-height: 3.5rem;
    .search-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $medium-radius;
        width: 75%;
        height: $search-bar-height;
        background-color: $primary-color;
        padding-left: 1rem;

    }

    input[type="search"] {
        padding: 0.5rem;
        width: 100%;
        background-color: $primary-color;
        border: none;
        margin-right: .5rem;
        color: $text-color;
        font-size: larger;
    }

    input[type="search"]:focus {
        border: none;
        outline: none;
    }

    // .btn {
    //     height: auto;
    //     width: 10rem;
    // }

    // .green {
    //     background-color: $accent-color;
    // }

    // .red {
    //     background-color: $red;
    // }
</style>