<script lang="ts">
    import SortedList from "$lib/componenets/interactables/SortedList.svelte";
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Delete.svelte';
    import ImportIcon from 'svelte-material-icons/Import.svelte';

    import type { DataRows, Schema } from '$lib/componenets/interactables/SortedList.svelte';
    import SearchBar from "./componenets/SearchBar.svelte";

    export let data: DataRows;
    export let schema: Schema;
    export let clickableRows: boolean = false;
    export let onRowClick: (productId: number) => void = () => {};
    export let idFieldName: string = Object.keys(data[0])[0];
    export let showSearchBar: boolean = false;
    export let removeButton: boolean = false;
    export let onRemovePressed: (selectedIds: (string | number)[]) => void = () => {};
    export let buttons: { [key: string]: { 
        icon: "plus" | "delete" | "import",
        color: "red" | "blue" | "green" | "yellow" | "accent",
        action: () => void,
        disabled?: boolean
    }} = {}; 
    export let selected: (string | number)[] = [];
    export let customSearchKeys: string[] | null = null;
    export let selectors: boolean = true;
    export let customRenderer: { [fieldName: string]: (row: any, column: any) => any } = {};
    export let emptyMessage: string = "Žádná data k zobrazení";
    export let grayRowOn: (row: any) => boolean = () => false;

    let filteredData = data;
    const BTN_SIZE = "1.7rem"

    // Compute search keys from schema
    $: searchKeys = schema
        .filter(col => col.searchKey)
        .map(col => col.fieldName);

    // If you want to fall back to some defaults if none are set:
    // $: searchKeys = schema.filter(col => col.searchIndex).map(col => col.fieldName) || ['name', 'surname', 'email'];
</script>

<div class="action-bar">
    {#if showSearchBar}
        <SearchBar 
            data={data}
            keys={customSearchKeys ? customSearchKeys : searchKeys}
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
            class={`btn btn-${value.color} ${value.disabled === undefined || !value.disabled ? "" : "disabled"}`}
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
<div class="list-container">
    <SortedList data={filteredData} {schema} {clickableRows} {onRowClick} {idFieldName} bind:selected {selectors} {customRenderer} {emptyMessage} {grayRowOn}/>
</div>
<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .list-container {
        height: 100%;
        margin-top: 0.1rem;

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
