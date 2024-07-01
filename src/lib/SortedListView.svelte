<script lang="ts">
    import SortedList from "$lib/componenets/interactables/SortedList.svelte";
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Delete.svelte';
    import MagnifyIcon from 'svelte-material-icons/Magnify.svelte';
    import ImportIcon from 'svelte-material-icons/Import.svelte';

    import type { DataRows, Schema } from '$lib/componenets/interactables/SortedList.svelte';
    import { invalidateAll } from "$app/navigation";
    import SearchBar from "./componenets/SearchBar.svelte";
    import type { IProduct } from "./shared/interfaces/product";

    export let data: DataRows;
    export let schema: Schema;
    export let clickableRows: boolean = false;
    export let onRowClick: (productId: number) => void = () => {};
    export let idFieldName: string = "idx";
    export let showSearchBar: boolean = false;
    export let removeButton: boolean = false;
    export let onRemovePressed: (selectedIds: (string | number)[]) => void = () => {};
    export let buttons: { [key: string]: { 
        icon: "plus" | "delete" | "import",
        color: "red" | "blue" | "green" | "yellow" | "accent",
        action: () => void 
    }} = {}; 
    export let selected: (string | number)[] = [];
    let search = '';

    let filteredData = data;

    function handleFocus(event: any) {
        event.target.select();
    }



    const BTN_SIZE = "1.7rem"
</script>

<div class="action-bar">
    {#if showSearchBar}
        <SearchBar 
            data={data}
            keys={['name', 'items.subname', 'productId']}
            bind:results={filteredData}
        /> 
    {/if}
    {#if removeButton}
        <button type="button"
            class={`btn btn-red ${selected.length == 0 ? 'disabled' : ''}`}
            on:click={() => {
                onRemovePressed(selected);
            }}
        >
            <DeleteIcon size="2rem" />
            Smazat 
        </button>
    {/if}

    {#each Object.entries(buttons) as [key, value]}
        <button type="button"
            class={`btn btn-${value.color}`}
            on:click={() => value.action()}
        >
            {#if value.icon === "plus"}
                <PlusIcon size={BTN_SIZE} />
            {:else if value.icon === "delete"}
                <DeleteIcon size={BTN_SIZE} />
            {:else if value.icon === "import"}
                <ImportIcon size={BTN_SIZE} />  
            {/if}
            {key}
        </button>
    {/each}
</div>
<div class="list">
    <SortedList data={filteredData} {schema} {clickableRows} {onRowClick} {idFieldName} bind:selected/>
</div>
<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .list {
        height: 100%;

        @include inputs.scrollable;
    }

    .action-bar {
        display: flex; 
        justify-content: end;

        gap: .7rem;
        width: 100%;
        margin-bottom: 1rem;
    }

    $search-bar-height: 3.5rem;
    .search-bar {
        @include inputs.search-bar($height: $search-bar-height);
    }
    
    .btn {
        max-width: 10rem;
    }

    .btn-green {
        @include buttons.btn($btn-color: vars.$green, $btn-height: $search-bar-height);
    }

    .btn-accent {
        @include buttons.btn($btn-color: vars.$accent-color, $btn-height: $search-bar-height);    
    }

    .btn-red {
        @include buttons.btn($btn-color: vars.$red, $btn-height: $search-bar-height);
    }

    .btn-yellow {
        @include buttons.btn($btn-color: vars.$yellow, $btn-height: $search-bar-height);
    }

    .btn-blue {
        @include buttons.btn($btn-color: vars.$blue, $btn-height: $search-bar-height);
    }

    
</style>
