<script lang="ts" context="module">
    export type MultiSelectorItem = {
        id: number | string;
        name: string;
        deletable?: boolean;
        default?: boolean;
    };

</script>
<script lang="ts">
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Close.svelte';
    import { enhance } from '$app/forms';

    export let items: MultiSelectorItem[];
    export let selected: MultiSelectorItem[] = [];
    export let onItemAdd: (item: MultiSelectorItem) => void = () => {};
    export let onItemDeleted: (item: MultiSelectorItem) => void = () => {};
    export let maxItems: number | undefined = undefined;
    export let props: { [key: string]: any } = {};
    export let deleteEndpoint: string | undefined = undefined;

    let showMenu = false;
    let menuRef: HTMLDivElement | null = null;

    selected = items.filter(item => item.default);
    let availableItemsArray = availableItems();
    
    function availableItems() {
        return items.filter(item => !selected.includes(item));
    }

    function clickOutside(node: HTMLElement, callback: () => void) {
        const handleClick = (event: MouseEvent) => {
            if (!node.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick, true);

        return {
            destroy() {
                document.removeEventListener('mousedown', handleClick, true);
            }
        };
    }

    async function deleteItem(value: MultiSelectorItem) {
        onItemDeleted(value);
        selected = selected.filter(item => item.id !== value.id);
        availableItemsArray = availableItems();
    }

    function handleAdd(item: MultiSelectorItem) {
        onItemAdd(item);
        selected = [...selected, item];
        availableItemsArray = availableItems();
        showMenu = false;
    }
</script>


<div class="container">
    {#each selected as item, idx}
        <div class="item">
            <span>{item.name}</span>
            {#if item.deletable === undefined || item.deletable}
                <form use:enhance method="POST" action={deleteEndpoint !== undefined ? deleteEndpoint : ''}>
                    <button type="button"
                        class="btn"
                        on:click={() => deleteItem(item)}
                    >
                        <DeleteIcon size={"2rem"}/>
                    </button>
                </form>
            {/if}
        </div>
    {/each}

    {#if (maxItems === undefined || selected.length < maxItems) && availableItemsArray.length > 0}
        <div class="add-menu-wrapper" style="position: relative;">
            <button type="button"
                class="btn plus"
                on:click={() => showMenu = !showMenu}
            >
                <PlusIcon size={"2rem"}/>
            </button>

            {#if showMenu}
                <div class="add-menu" bind:this={menuRef} use:clickOutside={() => showMenu = false} tabindex="-1">
                    <hr class="divider" />
                    {#each availableItemsArray as item}
                        <button type="button" class="btn add-item-btn" tabindex="-1" on:click={() => handleAdd(item)}>
                            <PlusIcon size="1.2rem" /> {item.name}
                        </button>
                        <hr class="divider" />
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: .5rem;
    }

    .container > div {
        flex: 0 0 auto;
        padding: 0.3rem;
        // padding: .5rem;        
        min-height: 3rem;

        border-radius: vars.$large-radius;
    }

    .btn {
        @include buttons.btn($btn-height: auto);
        width: auto;
        flex-grow: 0;
        aspect-ratio: 1;
        border-radius: vars.$large-radius;
        padding: 0.5rem .5rem .5rem 0;
    
        &.plus {
            padding: .6rem;
            border: solid 1px vars.$second-accent-color;
        }

    }

    .item {
        background-color: vars.$primary-color;
        color: vars.$text-color;
        display: flex;
        align-items: center;
        justify-content: start;
        border: solid 1px vars.$second-accent-color;
        
        span {
            padding: 0 .7rem;
        }
    }

    .add-menu-wrapper {
        position: relative;
    }

    .add-menu {
        position: absolute;
        top: 2.5rem;
        left: 0;
        z-index: 10;

        padding: .5rem;
        border-radius: vars.$small-radius;
        border: solid 1px vars.$second-accent-color;
        background-color: vars.$primary-color;

        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .add-item-btn {
        @include buttons.div-btn;

        aspect-ratio: auto;

        width: 100%;
        padding: 0.5rem;
        text-align: left;
        
        color: vars.$text-color;
    }

    .divider {
        border: none;
        border-top: 1px solid vars.$text2-color;
        margin: 0.2rem 0;
    }
</style>
