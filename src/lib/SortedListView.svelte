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
    export let removeButton: boolean = false;
    export let onRemovePressed: (selectedIds: (string | number)[]) => void = () => {};
    export let buttons: { [key: string]: { 
        icon: "plus" | "delete" | "import",
        color: "red" | "blue" | "green" | "yellow" | "accent",
        action: () => void 
    }} = {};
    
    let selected: (string | number)[] = [];
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
    {#if removeButton}
        <button type="button"
            class={`btn btn-red ${selected.length == 0 ? 'disabled' : ''}`}
            on:click={() => {
                onRemovePressed(selected);
                selected = [];
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
                <PlusIcon size="1.7rem" />
            {:else if value.icon === "delete"}
                <DeleteIcon size="1.7rem" />
            {:else if value.icon === "import"}
                
            {/if}
            {key}
        </button>
    {/each}
</div>
<SortedList {data} {schema} {clickableRows} {onRowClick} {idFieldName} bind:selected/>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .action-bar {
        display: flex; 
        justify-content: end;

        gap: .7rem;
        width: 100%;
        margin-bottom: 1rem;
    }

    $search-bar-height: 3.5rem;
    .search-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: vars.$medium-radius;
        height: $search-bar-height;
        flex-grow: 1;
        background-color: vars.$primary-color;
        padding-left: 1rem;

    }

    input[type="search"] {
        padding: 0.5rem;
        width: 100%;
        background-color: vars.$primary-color;
        border: none;
        margin-right: .5rem;
        color: vars.$text-color;
        font-size: larger;
    }

    input[type="search"]:focus {
        border: none;
        outline: none;
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
